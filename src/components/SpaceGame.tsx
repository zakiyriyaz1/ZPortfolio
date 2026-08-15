"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * "Z-WING" -- a Galaga-style arcade shooter that takes over the screen.
 *
 * Launched from the Z logo in the header. The ship is the site's own custom
 * cursor: the same yellow arrow path, same glow. It gains hardware as you
 * collect upgrades, so the silhouette grows over a run.
 *
 * Structure
 *  - Five enemy archetypes with distinct movement/fire behaviour.
 *  - Waves escalate; every 5th wave is a multi-phase SECTOR BOSS.
 *  - Permanent ship upgrades (MK.I -> MK.IV) from upgrade drops.
 *  - Temporary powerups: rapid fire, spread, shield, and an instant smart bomb.
 *
 * Everything runs on one <canvas> driven by a single requestAnimationFrame
 * loop. All mutable game state lives in a ref rather than React state -- the
 * loop mutates it ~60x a second, and putting that in state would re-render the
 * component just as often. Only HUD values are mirrored into state, and only
 * when they actually change.
 */

/* ----------------------------- tuning ---------------------------------- */

const SHIP_COLOR = "#FFEC00";      // matches CustomCursor
const ACCENT = "#22d3ee";          // site brand cyan
const WAVES_PER_SECTOR = 5;        // every 5th wave is a boss
const START_LIVES = 3;
const MAX_LIVES = 6;
// Pickups are deliberately scarce. Firepower should feel earned over a run
// rather than showered on the player.
const DROP_CHANCE = 0.05;          // chance a regular kill drops a pickup

// Classic Galaga only lets a couple of your shots exist at once. Capping
// on-screen bullets is what keeps the screen readable at high weapon marks --
// an upgrade widens your spread rather than flooding the playfield.
const BULLETS_ON_SCREEN = [3, 5, 7, 9];   // by mark: MK.I .. MK.IV
const PLAYER_BULLET_SPEED = -8.5;         // was -12; deliberately languid

// Only ever this many enemies peeling out of formation at once, so a wave
// pressures you in sequence instead of all rushing at once.
const maxDivers = (wave: number) => Math.min(4, 1 + Math.floor(wave / 6));

const ENEMY_TYPES = {
  grunt:   { hp: 1, score: 100, color: "#c084fc", r: 13, fire: 0.0008, dive: 0.0006 },
  soldier: { hp: 2, score: 150, color: "#f472b6", r: 14, fire: 0.0014, dive: 0.0004 },
  diver:   { hp: 1, score: 200, color: "#fb923c", r: 12, fire: 0.0003, dive: 0.0050 },
  weaver:  { hp: 2, score: 250, color: "#34d399", r: 13, fire: 0.0011, dive: 0.0007 },
  tank:    { hp: 6, score: 500, color: "#ef4444", r: 20, fire: 0.0018, dive: 0.0002 },
} as const;

type EnemyKind = keyof typeof ENEMY_TYPES;
type PowerKind = "rapid" | "spread" | "shield" | "bomb" | "upgrade" | "life";

// Timed powerups are short bursts, not a state you live in.
const POWER_META: Record<PowerKind, { label: string; color: string; ms: number }> = {
  rapid:   { label: "R", color: "#22d3ee", ms: 6000 },
  spread:  { label: "S", color: "#a78bfa", ms: 6000 },
  shield:  { label: "O", color: "#34d399", ms: 7000 },
  bomb:    { label: "B", color: "#f87171", ms: 0 },
  upgrade: { label: "^", color: SHIP_COLOR, ms: 0 },
  life:    { label: "♥", color: "#fb7185", ms: 0 },
};

/** Boss silhouettes, one per sector (cycling). Each sector looks distinct. */
const BOSS_VARIANTS = [
  { name: "DREADNOUGHT", color: "#c084fc" },
  { name: "HIVE CARRIER", color: "#38bdf8" },
  { name: "WARDEN", color: "#fb7185" },
] as const;

/* ----------------------------- types ----------------------------------- */

type Vec = { x: number; y: number };
type Bullet = Vec & { vx: number; vy: number; r: number };
type Pickup = Vec & { vy: number; kind: PowerKind; t: number };
type Particle = Vec & { vx: number; vy: number; life: number; max: number; color: string };
type Star = Vec & { z: number };

type Enemy = Vec & {
  homeX: number; homeY: number;
  kind: EnemyKind;
  hp: number;
  alive: boolean;
  diving: boolean;
  t: number;
  diveVX: number;
  flash: number;
};

type Boss = {
  x: number; y: number;
  hp: number; maxHp: number;
  phase: 1 | 2 | 3;
  t: number;
  dir: number;
  fireT: number;
  flash: number;
  entering: boolean;
  variant: number;   // index into BOSS_VARIANTS
};

type Game = {
  w: number; h: number;
  ship: Vec;
  target: Vec;
  bullets: Bullet[];
  enemyBullets: Bullet[];
  enemies: Enemy[];
  pickups: Pickup[];
  particles: Particle[];
  stars: Star[];
  boss: Boss | null;
  cooldown: number;
  invuln: number;
  swayT: number;
  shake: number;
  score: number;
  lives: number;
  wave: number;
  level: number;                       // ship mark, 1-4
  timers: Record<string, number>;       // powerup expiry timestamps
  over: boolean;
  keys: Set<string>;
  banner: { text: string; sub: string; t: number } | null;
};

const MOVE_KEYS = new Set([
  "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown",
  "a", "d", "w", "s", "A", "D", "W", "S", " ",
]);

const rand = (a: number, b: number) => Math.random() * (b - a) + a;
const now = () => performance.now();

/* ---------------------------- leaderboard ------------------------------
 * Scores are kept locally. To make the board genuinely global, point
 * LEADERBOARD_ENDPOINT at an HTTP endpoint that accepts POST {name, score,
 * wave} and returns GET -> Entry[]. The site is a static export, so it can't
 * host that itself; it needs an external service. Until one is configured this
 * degrades to a local, per-browser board.
 */
const LEADERBOARD_ENDPOINT: string | null = null;
const LB_KEY = "zwing-scores";
const LB_MAX = 10;

type Entry = { name: string; score: number; wave: number; at: number };

async function loadScores(): Promise<Entry[]> {
  if (LEADERBOARD_ENDPOINT) {
    try {
      const res = await fetch(LEADERBOARD_ENDPOINT, { cache: "no-store" });
      if (res.ok) return (await res.json()) as Entry[];
    } catch { /* fall through to local */ }
  }
  try {
    return JSON.parse(window.localStorage.getItem(LB_KEY) || "[]") as Entry[];
  } catch { return []; }
}

async function submitScore(entry: Entry): Promise<Entry[]> {
  if (LEADERBOARD_ENDPOINT) {
    try {
      await fetch(LEADERBOARD_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(entry),
      });
      return await loadScores();
    } catch { /* fall through to local */ }
  }
  const list = await loadScores();
  list.push(entry);
  list.sort((a, b) => b.score - a.score);
  const top = list.slice(0, LB_MAX);
  try { window.localStorage.setItem(LB_KEY, JSON.stringify(top)); } catch { /* ignore */ }
  return top;
}

/** Muzzle offsets/angles for each ship mark. */
function shotPorts(level: number, spread: boolean): { x: number; vx: number }[] {
  const base =
    level >= 4 ? [{ x: -7, vx: 0 }, { x: 7, vx: 0 }, { x: -15, vx: -0.28 }, { x: 15, vx: 0.28 }]
    : level === 3 ? [{ x: 0, vx: 0 }, { x: -10, vx: -0.2 }, { x: 10, vx: 0.2 }]
    : level === 2 ? [{ x: -6, vx: 0 }, { x: 6, vx: 0 }]
    : [{ x: 0, vx: 0 }];
  return spread ? [...base, { x: -20, vx: -0.55 }, { x: 20, vx: 0.55 }] : base;
}

/* ============================== component ============================== */

export default function SpaceGame({ onClose }: { onClose: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const gameRef = useRef<Game | null>(null);
  const rafRef = useRef<number | null>(null);

  const [started, setStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [best, setBest] = useState(0);
  const [scores, setScores] = useState<Entry[]>([]);
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [hud, setHud] = useState({
    score: 0, lives: 3, wave: 1, sector: 1, level: 1,
    boss: null as { hp: number; max: number; phase: number; name: string } | null,
    powers: [] as { k: PowerKind; pct: number }[],
  });

  useEffect(() => {
    try {
      const v = window.localStorage.getItem("zwing-best");
      if (v) setBest(parseInt(v, 10) || 0);
      const n = window.localStorage.getItem("zwing-name");
      if (n) setName(n);
    } catch { /* private mode */ }
  }, []);

  const commitBest = useCallback((score: number) => {
    setBest((prev) => {
      if (score <= prev) return prev;
      try { window.localStorage.setItem("zwing-best", String(score)); } catch { /* ignore */ }
      return score;
    });
  }, []);

  /* ------------------------- spawning helpers ------------------------- */

  const buildWave = useCallback((g: Game, wave: number) => {
    // Every 5th wave is a boss instead of a formation.
    if (wave % WAVES_PER_SECTOR === 0) {
      const sector = wave / WAVES_PER_SECTOR;
      const variant = (sector - 1) % BOSS_VARIANTS.length;
      // Substantially tankier than before -- bosses were melting in seconds.
      const maxHp = 130 + (sector - 1) * 95;
      g.boss = {
        x: g.w / 2, y: -120, hp: maxHp, maxHp,
        phase: 1, t: 0, dir: 1, fireT: 0, flash: 0, entering: true, variant,
      };
      g.enemies = [];
      g.banner = { text: BOSS_VARIANTS[variant].name, sub: `sector ${sector} · destroy it`, t: 170 };
      return;
    }

    // Difficulty ramp. Archetypes are introduced one at a time and the
    // formation grows slowly, so each wave reads as its own step up rather
    // than blurring into the next.
    const pool: EnemyKind[] = ["grunt"];
    if (wave >= 5) pool.push("soldier");
    if (wave >= 9) pool.push("diver");
    if (wave >= 13) pool.push("weaver");

    const cols = Math.min(8, 4 + Math.floor(wave / 5));
    const rows = Math.min(4, 2 + Math.floor(wave / 7));
    const spacingX = Math.min(86, (g.w - 120) / cols);
    const startX = (g.w - (cols - 1) * spacingX) / 2;

    const enemies: Enemy[] = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        // Front rows get the tougher archetypes.
        let kind: EnemyKind = pool[Math.min(pool.length - 1, Math.floor(rand(0, pool.length)))];
        if (r === 0 && wave >= 5) kind = "soldier";
        if (wave >= 16 && r === 0 && c % 4 === 0) kind = "tank";

        const spec = ENEMY_TYPES[kind];
        const x = startX + c * spacingX;
        const y = 96 + r * 60;
        enemies.push({
          x, y, homeX: x, homeY: y, kind,
          hp: spec.hp + Math.floor(wave / 10),
          alive: true, diving: false,
          t: Math.random() * Math.PI * 2, diveVX: 0, flash: 0,
        });
      }
    }
    g.enemies = enemies;
    g.boss = null;
    g.banner = { text: `WAVE ${wave}`, sub: `${enemies.length} hostiles`, t: 120 };
  }, []);

  const resetGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const w = canvas.clientWidth, h = canvas.clientHeight;
    const g: Game = {
      w, h,
      ship: { x: w / 2, y: h - 90 },
      target: { x: w / 2, y: h - 90 },
      bullets: [], enemyBullets: [], enemies: [], pickups: [], particles: [],
      stars: Array.from({ length: 130 }, () => ({
        x: Math.random() * w, y: Math.random() * h, z: rand(0.25, 1.5),
      })),
      boss: null,
      cooldown: 0, invuln: 0, swayT: 0, shake: 0,
      score: 0, lives: START_LIVES, wave: 1, level: 1,
      timers: {},
      over: false,
      keys: new Set(),
      banner: null,
    };
    buildWave(g, 1);
    gameRef.current = g;
    setGameOver(false);
    setHud({ score: 0, lives: START_LIVES, wave: 1, sector: 1, level: 1, boss: null, powers: [] });
  }, [buildWave]);

  /* ------------------------------ loop -------------------------------- */

  useEffect(() => {
    if (!started) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Size the backing store to the canvas's real laid-out size.
    //
    // This has to be re-checked continuously, not just once on mount: if the
    // canvas is measured before layout has settled it reports a near-zero
    // height, and the whole game then runs inside a sliver -- ship off-screen,
    // enemies spawning below the drawable area, nothing hittable. Reconciling
    // every frame is a couple of integer comparisons and makes that
    // unrecoverable state impossible.
    const fit = () => {
      const cw = canvas.clientWidth, ch = canvas.clientHeight;
      if (cw < 2 || ch < 2) return false;                 // not laid out yet
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(cw * dpr);
      canvas.height = Math.floor(ch * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const g = gameRef.current;
      if (g) { g.w = cw; g.h = ch; }
      return true;
    };
    fit();
    if (!gameRef.current) resetGame();
    window.addEventListener("resize", fit);
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(() => fit()) : null;
    ro?.observe(canvas);

    /* ---- input ---- */
    const onMove = (e: MouseEvent) => {
      const g = gameRef.current; if (!g) return;
      const r = canvas.getBoundingClientRect();
      g.target.x = e.clientX - r.left;
      g.target.y = e.clientY - r.top;
    };
    const onTouch = (e: TouchEvent) => {
      const g = gameRef.current; if (!g || !e.touches[0]) return;
      const r = canvas.getBoundingClientRect();
      g.target.x = e.touches[0].clientX - r.left;
      g.target.y = e.touches[0].clientY - r.top;
      e.preventDefault();
    };
    const norm = (k: string) => (k.length === 1 ? k.toLowerCase() : k);
    const onKeyDown = (e: KeyboardEvent) => {
      const g = gameRef.current; if (!g) return;
      if (MOVE_KEYS.has(e.key)) e.preventDefault();
      g.keys.add(norm(e.key));
      if (e.key === " " && g.cooldown > 2) g.cooldown = 2;
    };
    const onKeyUp = (e: KeyboardEvent) => gameRef.current?.keys.delete(norm(e.key));
    // Pause input state if the tab loses focus, so the ship doesn't drift.
    const onBlur = () => gameRef.current?.keys.clear();

    window.addEventListener("mousemove", onMove);
    canvas.addEventListener("touchmove", onTouch, { passive: false });
    canvas.addEventListener("touchstart", onTouch, { passive: false });
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("blur", onBlur);

    /* ---- helpers bound to this loop ---- */
    const boom = (g: Game, x: number, y: number, color: string, n = 14, power = 1) => {
      for (let i = 0; i < n; i++) {
        const a = Math.random() * Math.PI * 2, sp = rand(0.6, 4) * power;
        g.particles.push({
          x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
          life: 0, max: rand(18, 38), color,
        });
      }
    };

    // Weighting: the common drops are the short timed buffs. Weapon marks come
    // almost entirely from the guaranteed sources (boss kills and the wave
    // cadence), and hearts are the only way to gain a life at all.
    const dropPickup = (g: Game, x: number, y: number, forceUpgrade = false) => {
      const roll = Math.random();
      let kind: PowerKind;
      if (forceUpgrade) kind = "upgrade";
      else if (roll < 0.34) kind = "rapid";
      else if (roll < 0.64) kind = "spread";
      else if (roll < 0.88) kind = "shield";
      else if (roll < 0.96) kind = "bomb";
      else kind = "life";
      g.pickups.push({ x, y, vy: 1.4, kind, t: 0 });
    };

    const grantPower = (g: Game, kind: PowerKind) => {
      if (kind === "upgrade") {
        g.level = Math.min(4, g.level + 1);
        g.banner = { text: `MK.${["I", "II", "III", "IV"][g.level - 1]}`, sub: "weapons upgraded", t: 90 };
        return;
      }
      if (kind === "life") {
        // The only source of extra lives in the whole game.
        g.lives = Math.min(MAX_LIVES, g.lives + 1);
        g.banner = { text: "+1 LIFE", sub: "", t: 80 };
        return;
      }
      if (kind === "bomb") {
        // Smart bomb: clear every enemy bullet, damage everything on screen.
        g.enemyBullets = [];
        for (const e of g.enemies) {
          if (!e.alive) continue;
          e.hp -= 3;
          if (e.hp <= 0) { e.alive = false; g.score += ENEMY_TYPES[e.kind].score; boom(g, e.x, e.y, ENEMY_TYPES[e.kind].color); }
        }
        if (g.boss) { g.boss.hp -= 25; g.boss.flash = 10; }
        g.shake = 18;
        boom(g, g.ship.x, g.ship.y, "#f87171", 40, 2);
        return;
      }
      g.timers[kind] = now() + POWER_META[kind].ms;
    };

    const damageBoss = (g: Game, dmg: number) => {
      const b = g.boss; if (!b || b.entering) return;
      b.hp -= dmg; b.flash = 6;
      const pct = b.hp / b.maxHp;
      const nextPhase = pct <= 0.33 ? 3 : pct <= 0.66 ? 2 : 1;
      if (nextPhase !== b.phase) {
        b.phase = nextPhase as 1 | 2 | 3;
        g.shake = 14;
        boom(g, b.x, b.y, "#f472b6", 30, 1.6);
        g.banner = { text: `PHASE ${b.phase}`, sub: "", t: 70 };
      }
      if (b.hp <= 0) {
        const sector = Math.floor(g.wave / WAVES_PER_SECTOR);
        g.score += 1500 + sector * 500;
        g.shake = 26;
        boom(g, b.x, b.y, "#f472b6", 70, 2.4);
        boom(g, b.x, b.y, SHIP_COLOR, 40, 1.8);
        // The boss is the sole source of weapon marks. Granted outright rather
        // than dropped, so a hard-won kill can't be wasted by a missed pickup.
        if (g.level < 4) grantPower(g, "upgrade");
        dropPickup(g, b.x, b.y);
        g.boss = null;
        g.banner = { text: "SECTOR CLEAR", sub: "", t: 120 };
      }
    };

    /* ---- draw: the ship, built from the site's cursor arrow ---- */
    const drawShip = (g: Game) => {
      const { x, y } = g.ship;
      const shield = g.timers.shield && g.timers.shield > now();
      const blink = g.invuln > 0 && Math.floor(g.invuln / 5) % 2 === 0;
      if (blink) return;

      ctx.save();
      ctx.translate(x, y);

      // Upgrade hardware sits behind the arrow so the cursor stays the hero.
      if (g.level >= 2) {
        ctx.fillStyle = ACCENT;
        ctx.shadowColor = ACCENT;
        ctx.shadowBlur = 10;
        ctx.fillRect(-16, 2, 6, 13);
        ctx.fillRect(10, 2, 6, 13);
      }
      if (g.level >= 3) {
        ctx.fillStyle = ACCENT;
        ctx.fillRect(-24, 6, 5, 10);
        ctx.fillRect(19, 6, 5, 10);
      }
      if (g.level >= 4) {
        ctx.globalAlpha = 0.9;
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(-28, 10, 4, 7);
        ctx.fillRect(24, 10, 4, 7);
        ctx.globalAlpha = 1;
      }

      // thruster
      ctx.fillStyle = "#ffffff";
      ctx.globalAlpha = 0.8;
      ctx.fillRect(-2.5, 12, 5, rand(6, 15));
      ctx.globalAlpha = 1;

      // The cursor arrow itself: same path as CustomCursor, rotated to fly up.
      ctx.save();
      ctx.rotate(-Math.PI / 2);
      const s = 1.15;
      ctx.scale(s, s);
      ctx.translate(-16, -16);
      ctx.shadowColor = SHIP_COLOR;
      ctx.shadowBlur = 18;
      ctx.fillStyle = SHIP_COLOR;
      ctx.beginPath();
      ctx.moveTo(2, 2);
      ctx.lineTo(28, 16);
      ctx.lineTo(2, 30);
      ctx.lineTo(10, 16);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      if (shield) {
        ctx.strokeStyle = "#34d399";
        ctx.shadowColor = "#34d399";
        ctx.shadowBlur = 16;
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.75 + Math.sin(now() / 90) * 0.2;
        ctx.beginPath();
        ctx.arc(0, 0, 30, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
      ctx.restore();
      ctx.shadowBlur = 0;
    };

    const drawEnemy = (e: Enemy) => {
      const spec = ENEMY_TYPES[e.kind];
      const col = e.flash > 0 ? "#ffffff" : spec.color;
      const r = spec.r;
      ctx.save();
      ctx.translate(e.x, e.y);
      ctx.shadowColor = spec.color;
      ctx.shadowBlur = 12;
      ctx.fillStyle = col;
      ctx.beginPath();
      if (e.kind === "tank") {
        // chunky hexagon
        for (let i = 0; i < 6; i++) {
          const a = (Math.PI / 3) * i - Math.PI / 2;
          const px = Math.cos(a) * r, py = Math.sin(a) * r * 0.85;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
      } else if (e.kind === "diver") {
        // downward dart
        ctx.moveTo(0, r); ctx.lineTo(r * 0.8, -r * 0.6);
        ctx.lineTo(0, -r * 0.2); ctx.lineTo(-r * 0.8, -r * 0.6);
      } else if (e.kind === "weaver") {
        // diamond
        ctx.moveTo(0, -r); ctx.lineTo(r * 0.8, 0);
        ctx.lineTo(0, r); ctx.lineTo(-r * 0.8, 0);
      } else {
        // classic invader silhouette
        ctx.moveTo(0, -r * 0.85); ctx.lineTo(r, r * 0.25);
        ctx.lineTo(r * 0.55, r * 0.25); ctx.lineTo(r * 0.7, r * 0.85);
        ctx.lineTo(0, r * 0.45); ctx.lineTo(-r * 0.7, r * 0.85);
        ctx.lineTo(-r * 0.55, r * 0.25); ctx.lineTo(-r, r * 0.25);
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();
      ctx.shadowBlur = 0;
    };

    const drawBoss = (b: Boss) => {
      // Each sector's boss has its own silhouette and palette; the phase only
      // shifts the hue so damage is still readable at a glance.
      const base = BOSS_VARIANTS[b.variant].color;
      const phaseCol = b.phase === 3 ? "#f87171" : b.phase === 2 ? "#f472b6" : base;
      const col = b.flash > 0 ? "#ffffff" : phaseCol;
      ctx.save();
      ctx.translate(b.x, b.y);
      ctx.shadowColor = phaseCol;
      ctx.shadowBlur = 26;
      ctx.fillStyle = col;
      ctx.beginPath();
      if (b.variant === 1) {
        // HIVE CARRIER -- broad hexagonal slab with notched shoulders
        ctx.moveTo(-30, -42); ctx.lineTo(30, -42); ctx.lineTo(78, -8);
        ctx.lineTo(58, 30); ctx.lineTo(22, 44); ctx.lineTo(-22, 44);
        ctx.lineTo(-58, 30); ctx.lineTo(-78, -8);
      } else if (b.variant === 2) {
        // WARDEN -- tall diamond with swept arms
        ctx.moveTo(0, -52); ctx.lineTo(34, -12); ctx.lineTo(80, 4);
        ctx.lineTo(44, 16); ctx.lineTo(20, 50); ctx.lineTo(0, 30);
        ctx.lineTo(-20, 50); ctx.lineTo(-44, 16); ctx.lineTo(-80, 4);
        ctx.lineTo(-34, -12);
      } else {
        // DREADNOUGHT -- wide angular capital ship
        ctx.moveTo(0, 46); ctx.lineTo(-40, 22); ctx.lineTo(-72, 6);
        ctx.lineTo(-52, -26); ctx.lineTo(0, -40); ctx.lineTo(52, -26);
        ctx.lineTo(72, 6); ctx.lineTo(40, 22);
      }
      ctx.closePath();
      ctx.fill();

      // Per-variant detailing, so the three bosses read as different ships at
      // a glance rather than as recolours of one silhouette.
      ctx.shadowBlur = 0;
      if (b.variant === 0) {
        // DREADNOUGHT: armoured bridge spine + engine bank
        ctx.fillStyle = "rgba(0,0,0,0.35)";
        ctx.fillRect(-14, -30, 28, 46);
        ctx.fillStyle = "#f87171";
        for (let i = -2; i <= 2; i++) ctx.fillRect(i * 15 - 3, 30, 6, 10);
      } else if (b.variant === 1) {
        // HIVE CARRIER: honeycomb of launch cells
        ctx.fillStyle = "rgba(0,0,0,0.4)";
        for (let row = 0; row < 2; row++) {
          for (let i = 0; i < 5; i++) {
            const hx = -48 + i * 24 + (row % 2 ? 12 : 0);
            const hy = -18 + row * 26;
            ctx.beginPath();
            for (let k = 0; k < 6; k++) {
              const a = (Math.PI / 3) * k - Math.PI / 2;
              const px = hx + Math.cos(a) * 9, py = hy + Math.sin(a) * 9;
              if (k === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
            }
            ctx.closePath();
            ctx.fill();
          }
        }
      } else {
        // WARDEN: counter-rotating guard rings
        ctx.strokeStyle = base;
        ctx.lineWidth = 3;
        ctx.globalAlpha = 0.85;
        for (let i = 0; i < 2; i++) {
          const rot = b.t / (i ? -55 : 40);
          ctx.beginPath();
          ctx.arc(0, 0, 34 + i * 13, rot, rot + Math.PI * 1.15);
          ctx.stroke();
        }
        ctx.globalAlpha = 1;
      }

      // core
      ctx.fillStyle = SHIP_COLOR;
      ctx.shadowColor = SHIP_COLOR;
      ctx.shadowBlur = 18;
      ctx.beginPath();
      ctx.arc(0, -2, 13 + Math.sin(b.t / 8) * 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      ctx.shadowBlur = 0;
    };

    /* ------------------------------ tick ------------------------------ */
    let lastHudKey = "";

    const step = () => {
      const g = gameRef.current;
      if (!g) {
        rafRef.current = requestAnimationFrame(step);
        return;
      }
      // Self-heal if the canvas's real size ever drifts from what the game
      // thinks it is (see fit()). Cheap, and prevents an unplayable sliver.
      if (canvas.clientWidth !== g.w || canvas.clientHeight !== g.h) fit();
      const { w, h } = g;
      const t = now();

      ctx.save();
      if (g.shake > 0) {
        ctx.translate(rand(-g.shake, g.shake) * 0.4, rand(-g.shake, g.shake) * 0.4);
        g.shake *= 0.9;
        if (g.shake < 0.4) g.shake = 0;
      }

      ctx.fillStyle = "#05060a";
      ctx.fillRect(-40, -40, w + 80, h + 80);

      for (const s of g.stars) {
        s.y += s.z * 1.7;
        if (s.y > h) { s.y = -2; s.x = Math.random() * w; }
        ctx.globalAlpha = 0.22 + s.z * 0.5;
        ctx.fillStyle = s.z > 1.1 ? ACCENT : "#ffffff";
        const sz = s.z > 1.1 ? 2 : 1;
        ctx.fillRect(s.x, s.y, sz, sz);
      }
      ctx.globalAlpha = 1;

      const rapid = !!(g.timers.rapid && g.timers.rapid > t);
      const spread = !!(g.timers.spread && g.timers.spread > t);
      const shielded = !!(g.timers.shield && g.timers.shield > t);

      if (!g.over) {
        /* ---- ship ---- */
        const sp = 7.5;
        if (g.keys.has("ArrowLeft") || g.keys.has("a")) g.target.x -= sp;
        if (g.keys.has("ArrowRight") || g.keys.has("d")) g.target.x += sp;
        if (g.keys.has("ArrowUp") || g.keys.has("w")) g.target.y -= sp;
        if (g.keys.has("ArrowDown") || g.keys.has("s")) g.target.y += sp;
        g.target.x = Math.max(24, Math.min(w - 24, g.target.x));
        g.target.y = Math.max(h * 0.3, Math.min(h - 40, g.target.y));
        g.ship.x += (g.target.x - g.ship.x) * 0.22;
        g.ship.y += (g.target.y - g.ship.y) * 0.22;

        /* ---- firing ---- */
        // Volleys are gated by an on-screen bullet budget, not just a cooldown.
        // Higher marks raise the budget, so an upgrade means a wider, denser
        // spread rather than an unreadable wall of projectiles.
        const budget = BULLETS_ON_SCREEN[Math.min(3, g.level - 1)] + (rapid ? 3 : 0);
        g.cooldown -= 1;
        if (g.cooldown <= 0 && g.bullets.length < budget) {
          for (const p of shotPorts(g.level, spread)) {
            g.bullets.push({
              x: g.ship.x + p.x, y: g.ship.y - 16,
              vx: p.vx * 9, vy: PLAYER_BULLET_SPEED, r: 3,
            });
          }
          g.cooldown = rapid ? 6 : 12;
        }

        /* ---- enemies ---- */
        g.swayT += 0.0085;
        const sway = Math.sin(g.swayT) * Math.min(70, 22 + g.wave * 4);
        let alive = 0;
        const waveSpeed = 1 + g.wave * 0.025;
        // Enforce the concurrent-dive ceiling.
        let divingNow = 0;
        for (const e of g.enemies) if (e.alive && e.diving) divingNow++;
        const diveCap = maxDivers(g.wave);

        for (const e of g.enemies) {
          if (!e.alive) continue;
          alive++;
          e.t += 0.03;
          if (e.flash > 0) e.flash--;
          const spec = ENEMY_TYPES[e.kind];

          if (e.diving) {
            e.y += (e.kind === "diver" ? 4.0 : 2.7) * waveSpeed;
            e.x += e.diveVX + Math.sin(e.t * 2) * 1.3;
            if (e.y > h + 40) { e.diving = false; e.y = -30; divingNow--; }
          } else if (e.kind === "weaver") {
            e.x = e.homeX + sway + Math.sin(e.t * 1.6) * 26;
            e.y = e.homeY + Math.cos(e.t * 1.2) * 12;
          } else {
            e.x = e.homeX + sway;
            e.y = e.homeY + Math.sin(e.t) * 5;
          }

          if (!e.diving && divingNow < diveCap && Math.random() < spec.dive * (1 + g.wave * 0.04)) {
            e.diving = true;
            divingNow++;
            e.diveVX = (g.ship.x - e.x) / 130;
          }
          if (Math.random() < spec.fire * (1 + g.wave * 0.035)) {
            const ang = Math.atan2(g.ship.y - e.y, g.ship.x - e.x);
            const speed = 2.9 + g.wave * 0.07;
            const aimed = e.kind === "soldier" || e.kind === "tank";
            g.enemyBullets.push({
              x: e.x, y: e.y + 12,
              vx: aimed ? Math.cos(ang) * speed : 0,
              vy: aimed ? Math.sin(ang) * speed : speed,
              r: 4,
            });
          }
        }

        /* ---- boss ---- */
        const b = g.boss;
        if (b) {
          b.t += 1;
          if (b.flash > 0) b.flash--;
          if (b.entering) {
            b.y += 2.2;
            if (b.y >= 130) { b.y = 130; b.entering = false; }
          } else {
            const speed = 1.4 + b.phase * 0.9;
            b.x += b.dir * speed;
            if (b.x < 110) { b.x = 110; b.dir = 1; }
            if (b.x > w - 110) { b.x = w - 110; b.dir = -1; }
            b.y = 130 + Math.sin(b.t / 40) * 18;

            b.fireT -= 1;
            if (b.fireT <= 0) {
              const bs = 3.4 + b.phase * 0.4;
              if (b.phase === 1) {
                for (let i = -2; i <= 2; i++) {
                  g.enemyBullets.push({ x: b.x, y: b.y + 40, vx: i * 1.1, vy: bs, r: 5 });
                }
                b.fireT = 62;
              } else if (b.phase === 2) {
                const ang = Math.atan2(g.ship.y - b.y, g.ship.x - b.x);
                for (let i = -1; i <= 1; i++) {
                  g.enemyBullets.push({
                    x: b.x, y: b.y + 40,
                    vx: Math.cos(ang + i * 0.16) * bs,
                    vy: Math.sin(ang + i * 0.16) * bs, r: 5,
                  });
                }
                b.fireT = 38;
              } else {
                const n = 10;
                for (let i = 0; i < n; i++) {
                  const a = (Math.PI * 2 * i) / n + b.t / 40;
                  g.enemyBullets.push({ x: b.x, y: b.y, vx: Math.cos(a) * bs * 0.75, vy: Math.sin(a) * bs * 0.75, r: 5 });
                }
                b.fireT = 66;
              }
            }
          }
        }

        /* ---- wave / sector progression ---- */
        if (alive === 0 && !g.boss) {
          g.wave += 1;
          g.score += 200;
          // Guaranteed reward for clearing: a weapon upgrade on the cadence,
          // otherwise a random powerup. Keeps the player's firepower scaling
          // with the difficulty instead of relying purely on drop luck.
          // Weapon marks come ONLY from killing a sector boss -- one per boss,
          // so MK.IV lands around wave 15 rather than within the first minute.
          // Clearing a normal wave is worth points and nothing else.
          g.invuln = Math.max(g.invuln, 70); // breathing room as the wave lands
          buildWave(g, g.wave);
        }

        /* ---- projectiles ---- */
        for (const p of g.bullets) { p.x += p.vx; p.y += p.vy; }
        g.bullets = g.bullets.filter((p) => p.y > -30 && p.x > -30 && p.x < w + 30);
        for (const p of g.enemyBullets) { p.x += p.vx; p.y += p.vy; }
        g.enemyBullets = g.enemyBullets.filter((p) => p.y < h + 30 && p.y > -60 && p.x > -40 && p.x < w + 40);

        // player bullets -> enemies / boss
        for (const p of g.bullets) {
          if (p.y < -20) continue;
          if (g.boss && !g.boss.entering &&
              Math.abs(p.x - g.boss.x) < 66 && Math.abs(p.y - g.boss.y) < 40) {
            p.y = -999;
            damageBoss(g, 1);
            continue;
          }
          for (const e of g.enemies) {
            if (!e.alive) continue;
            const rr = ENEMY_TYPES[e.kind].r;
            if (Math.abs(p.x - e.x) < rr && Math.abs(p.y - e.y) < rr) {
              p.y = -999;
              e.hp -= 1; e.flash = 3;
              if (e.hp <= 0) {
                e.alive = false;
                g.score += ENEMY_TYPES[e.kind].score;
                boom(g, e.x, e.y, ENEMY_TYPES[e.kind].color);
                // Tanks always drop; others occasionally.
                if (e.kind === "tank") dropPickup(g, e.x, e.y, Math.random() < 0.6);
                else if (Math.random() < DROP_CHANCE) dropPickup(g, e.x, e.y);
              }
              break;
            }
          }
        }
        g.bullets = g.bullets.filter((p) => p.y > -30);

        /* ---- pickups ---- */
        // Gentle magnetism once a drop is near the ship, so the rare pickups
        // don't sail past just out of reach.
        for (const p of g.pickups) {
          p.y += p.vy; p.t += 1;
          const dx = g.ship.x - p.x, dy = g.ship.y - p.y;
          if (Math.abs(dx) < 190 && Math.abs(dy) < 190) p.x += Math.sign(dx) * Math.min(2.2, Math.abs(dx) * 0.05);
        }
        g.pickups = g.pickups.filter((p) => {
          if (p.y > h + 30) return false;
          if (Math.abs(p.x - g.ship.x) < 30 && Math.abs(p.y - g.ship.y) < 30) {
            grantPower(g, p.kind);
            g.score += 50;
            boom(g, p.x, p.y, POWER_META[p.kind].color, 12);
            return false;
          }
          return true;
        });

        /* ---- damage to player ---- */
        g.invuln -= 1;
        const near = (x: number, y: number, r: number) =>
          Math.abs(x - g.ship.x) < r && Math.abs(y - g.ship.y) < r;

        if (g.invuln <= 0) {
          let struck = false;
          for (const p of g.enemyBullets) {
            if (near(p.x, p.y, 16)) { struck = true; p.y = h + 999; break; }
          }
          if (!struck) {
            for (const e of g.enemies) {
              if (e.alive && e.diving && near(e.x, e.y, 26)) {
                struck = true; e.alive = false;
                boom(g, e.x, e.y, ENEMY_TYPES[e.kind].color);
                break;
              }
            }
          }
          if (struck) {
            if (shielded) {
              // Shield absorbs the hit and is consumed.
              delete g.timers.shield;
              g.invuln = 60;
              g.shake = 10;
              boom(g, g.ship.x, g.ship.y, "#34d399", 26, 1.4);
            } else {
              g.lives -= 1;
              // Generous recovery window -- dying used to also cost a weapon
              // mark, which turned one mistake into a death spiral. Upgrades
              // are now kept on death.
              g.invuln = 150;
              g.shake = 16;
              boom(g, g.ship.x, g.ship.y, SHIP_COLOR, 34, 1.8);
              if (g.lives <= 0) {
                g.over = true;
                setGameOver(true);
                commitBest(g.score);
              }
            }
          }
        }
        g.enemyBullets = g.enemyBullets.filter((p) => p.y < h + 20);
      }

      /* ------------------------------ draw ---------------------------- */
      for (const e of g.enemies) if (e.alive) drawEnemy(e);
      if (g.boss) drawBoss(g.boss);

      // pickups
      for (const p of g.pickups) {
        const meta = POWER_META[p.kind];
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(Math.sin(p.t / 18) * 0.35);
        ctx.shadowColor = meta.color;
        ctx.shadowBlur = 14;
        ctx.strokeStyle = meta.color;
        ctx.lineWidth = 2;
        ctx.strokeRect(-11, -11, 22, 22);
        ctx.fillStyle = meta.color;
        ctx.font = "bold 14px ui-monospace, monospace";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(meta.label, 0, 1);
        ctx.restore();
        ctx.shadowBlur = 0;
      }

      // bullets
      ctx.shadowBlur = 10;
      ctx.shadowColor = SHIP_COLOR;
      ctx.fillStyle = SHIP_COLOR;
      for (const p of g.bullets) ctx.fillRect(p.x - 1.75, p.y - 11, 3.5, 13);
      ctx.shadowColor = "#f472b6";
      ctx.fillStyle = "#f472b6";
      for (const p of g.enemyBullets) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;

      // particles
      g.particles = g.particles.filter((p) => {
        p.x += p.vx; p.y += p.vy; p.vy += 0.04; p.life += 1;
        const a = 1 - p.life / p.max;
        if (a <= 0) return false;
        ctx.globalAlpha = a;
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x, p.y, 3, 3);
        ctx.globalAlpha = 1;
        return true;
      });

      if (!g.over) drawShip(g);

      // banner
      if (g.banner) {
        g.banner.t -= 1;
        const a = Math.min(1, g.banner.t / 30);
        ctx.globalAlpha = a;
        ctx.textAlign = "center";
        ctx.fillStyle = SHIP_COLOR;
        ctx.shadowColor = SHIP_COLOR;
        ctx.shadowBlur = 16;
        ctx.font = "bold 34px ui-monospace, monospace";
        ctx.fillText(g.banner.text, w / 2, h * 0.42);
        if (g.banner.sub) {
          ctx.shadowBlur = 0;
          ctx.fillStyle = "#9ca3af";
          ctx.font = "13px ui-monospace, monospace";
          ctx.fillText(g.banner.sub, w / 2, h * 0.42 + 26);
        }
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
        if (g.banner.t <= 0) g.banner = null;
      }

      ctx.restore();

      /* ---- mirror HUD ---- */
      const powers = (["rapid", "spread", "shield"] as PowerKind[])
        .filter((k) => g.timers[k] && g.timers[k] > t)
        .map((k) => ({ k, pct: Math.max(0, (g.timers[k] - t) / POWER_META[k].ms) }));
      const bossHud = g.boss && !g.boss.entering
        ? {
            hp: Math.max(0, g.boss.hp), max: g.boss.maxHp, phase: g.boss.phase,
            name: BOSS_VARIANTS[g.boss.variant].name,
          }
        : null;
      const sector = Math.floor((g.wave - 1) / WAVES_PER_SECTOR) + 1;
      const key = `${g.score}|${g.lives}|${g.wave}|${g.level}|${bossHud?.hp ?? -1}|${powers.map((p) => p.k + Math.round(p.pct * 20)).join(",")}`;
      if (key !== lastHudKey) {
        lastHudKey = key;
        setHud({ score: g.score, lives: g.lives, wave: g.wave, sector, level: g.level, boss: bossHud, powers });
      }

      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      ro?.disconnect();
      window.removeEventListener("resize", fit);
      window.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("touchmove", onTouch);
      canvas.removeEventListener("touchstart", onTouch);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", onBlur);
    };
  }, [started, resetGame, buildWave, commitBest]);

  /* ---- overlay lifecycle: ESC + scroll lock ---- */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.removeAttribute("data-zgame");
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  /* The site's custom cursor is only hidden while actually flying -- during
     the menus it has to stay visible or the buttons can't be clicked. */
  const playing = started && !gameOver;
  useEffect(() => {
    document.documentElement.setAttribute("data-zgame", playing ? "playing" : "menu");
  }, [playing]);

  const start = () => { resetGame(); setStarted(true); };
  const retry = () => { resetGame(); setGameOver(false); setSubmitted(false); };

  // Load the board whenever a menu is showing.
  useEffect(() => {
    if (!playing) loadScores().then(setScores);
  }, [playing]);

  const doSubmit = async () => {
    const clean = name.trim().slice(0, 14) || "ANON";
    setSubmitted(true);
    try { window.localStorage.setItem("zwing-name", clean); } catch { /* ignore */ }
    const list = await submitScore({ name: clean, score: hud.score, wave: hud.wave, at: Date.now() });
    setScores(list);
  };

  // Enter activates the primary action on each menu, so the game is fully
  // playable without ever needing to find the cursor.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Enter") return;
      const el = document.activeElement as HTMLElement | null;
      if (el && el.tagName === "INPUT") return; // the name field handles its own Enter
      if (!started) { e.preventDefault(); start(); }
      else if (gameOver) { e.preventDefault(); retry(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const MARK = ["I", "II", "III", "IV"][Math.min(3, hud.level - 1)];

  return (
    <div className="fixed inset-0 z-[9999] bg-[#05060a]">
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full touch-none" />

      {/* HUD */}
      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-4 font-mono text-xs sm:text-sm">
        <div className="space-y-1" style={{ color: SHIP_COLOR }}>
          <div>SCORE {String(hud.score).padStart(6, "0")}</div>
          <div className="opacity-60">BEST {String(best).padStart(6, "0")}</div>
        </div>
        <div className="space-y-1 text-right text-accent">
          <div>SECTOR {hud.sector} · WAVE {hud.wave}</div>
          <div aria-label={`${hud.lives} lives remaining`} style={{ color: SHIP_COLOR }}>
            {"▲".repeat(Math.max(0, hud.lives))}
            <span className="opacity-25">
              {"▲".repeat(Math.max(0, START_LIVES - hud.lives))}
            </span>
          </div>
        </div>
      </div>

      {/* boss health */}
      {hud.boss && (
        <div className="pointer-events-none absolute inset-x-0 top-16 mx-auto w-[min(560px,80vw)] px-4">
          <div className="mb-1 flex justify-between font-mono text-[10px] text-pink-300">
            <span>{hud.boss.name}</span>
            <span>PHASE {hud.boss.phase}</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-fuchsia-500 to-pink-400 transition-[width] duration-150"
              style={{ width: `${(hud.boss.hp / hud.boss.max) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* ship mark + active powerups */}
      <div className="pointer-events-none absolute bottom-4 left-4 flex items-center gap-3 font-mono text-xs">
        <span style={{ color: SHIP_COLOR }}>MK.{MARK}</span>
        {hud.powers.map((p) => (
          <span key={p.k} className="flex items-center gap-1" style={{ color: POWER_META[p.k].color }}>
            {POWER_META[p.k].label}
            <span className="inline-block h-1 w-10 overflow-hidden rounded bg-white/15">
              <span
                className="block h-full rounded"
                style={{ width: `${p.pct * 100}%`, background: POWER_META[p.k].color }}
              />
            </span>
          </span>
        ))}
      </div>

      <button
        onClick={onClose}
        className="absolute right-3 top-16 z-10 rounded-md border border-accent/40 px-3 py-1.5 font-mono text-xs text-accent transition-colors hover:bg-accent/10 sm:top-20"
      >
        ESC ✕
      </button>

      {/* start screen */}
      {!started && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 overflow-y-auto bg-[#05060a]/90 px-6 py-10 text-center">
          <h2 className="font-cyber text-4xl sm:text-6xl" style={{ color: SHIP_COLOR, textShadow: `0 0 18px ${SHIP_COLOR}` }}>
            Z-WING
          </h2>
          <p className="max-w-md font-mono text-xs leading-relaxed text-gray-400 sm:text-sm">
            Move with the <span style={{ color: SHIP_COLOR }}>mouse</span> or{" "}
            <span style={{ color: SHIP_COLOR }}>WASD / arrows</span>. Guns are automatic.
            <br />
            Survive the swarm. Every 5th wave is a <span className="text-pink-400">sector boss</span>.
          </p>
          <div className="grid max-w-md grid-cols-2 gap-x-6 gap-y-1.5 font-mono text-[11px] text-gray-500">
            <span><span style={{ color: POWER_META.rapid.color }}>R</span> rapid fire</span>
            <span><span style={{ color: POWER_META.spread.color }}>S</span> spread shot</span>
            <span><span style={{ color: POWER_META.shield.color }}>O</span> shield</span>
            <span><span style={{ color: POWER_META.bomb.color }}>B</span> smart bomb</span>
            <span><span style={{ color: POWER_META.life.color }}>♥</span> extra life (rare)</span>
            <span><span style={{ color: SHIP_COLOR }}>^</span> weapon upgrade</span>
            <span className="col-span-2 pt-1 text-gray-600">
              drops are scarce — weapon marks come only from killing a boss
            </span>
          </div>
          <button
            autoFocus
            onClick={start}
            className="rounded-md px-8 py-3 font-mono font-bold text-dark transition-transform hover:scale-105"
            style={{ background: SHIP_COLOR }}
          >
            LAUNCH
          </button>
          <p className="font-mono text-[11px] text-gray-600">ENTER to launch · ESC to exit</p>
        </div>
      )}

      {/* game over */}
      {gameOver && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 overflow-y-auto bg-[#05060a]/92 px-6 py-10 text-center">
          <h2 className="font-cyber text-3xl sm:text-5xl" style={{ color: SHIP_COLOR }}>GAME OVER</h2>
          <div className="font-mono text-sm text-gray-300">
            <div>SCORE {hud.score}</div>
            <div className="mt-1 text-gray-500">
              REACHED SECTOR {hud.sector} · WAVE {hud.wave}
            </div>
            <div className="mt-1 text-gray-500">
              {hud.score >= best ? "NEW PERSONAL BEST" : `BEST ${best}`}
            </div>
          </div>

          {/* name entry */}
          {!submitted ? (
            <form
              onSubmit={(e) => { e.preventDefault(); doSubmit(); }}
              className="flex flex-col items-center gap-2"
            >
              <label htmlFor="zwing-name" className="font-mono text-[11px] uppercase tracking-widest text-gray-500">
                enter your name for the leaderboard
              </label>
              <div className="flex gap-2">
                <input
                  id="zwing-name"
                  autoFocus
                  value={name}
                  maxLength={14}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="ANON"
                  className="w-40 rounded-md border border-accent/40 bg-black/50 px-3 py-2 text-center font-mono text-sm uppercase tracking-widest text-accent outline-none focus:border-accent"
                />
                <button
                  type="submit"
                  className="rounded-md px-4 py-2 font-mono text-sm font-bold text-dark transition-transform hover:scale-105"
                  style={{ background: SHIP_COLOR }}
                >
                  SAVE
                </button>
              </div>
            </form>
          ) : (
            <p className="font-mono text-[11px] uppercase tracking-widest text-emerald-400">score saved</p>
          )}

          {/* leaderboard */}
          {scores.length > 0 && (
            <div className="w-full max-w-xs font-mono text-xs">
              <div className="mb-1 flex justify-between text-[10px] uppercase tracking-widest text-gray-600">
                <span>leaderboard</span>
                <span>{LEADERBOARD_ENDPOINT ? "global" : "this device"}</span>
              </div>
              <ol className="divide-y divide-white/5 rounded-md border border-white/10">
                {scores.slice(0, LB_MAX).map((s, i) => (
                  <li key={`${s.at}-${i}`} className="flex items-center justify-between px-3 py-1.5">
                    <span className="text-gray-500">{String(i + 1).padStart(2, "0")}</span>
                    <span className="flex-1 px-3 text-left text-gray-300">{s.name}</span>
                    <span style={{ color: SHIP_COLOR }}>{s.score}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={retry}
              className="rounded-md px-6 py-2.5 font-mono font-bold text-dark transition-transform hover:scale-105"
              style={{ background: SHIP_COLOR }}
            >
              RETRY
            </button>
            <button
              onClick={onClose}
              className="rounded-md border border-accent/40 px-6 py-2.5 font-mono text-accent transition-colors hover:bg-accent/10"
            >
              EXIT
            </button>
          </div>
          <p className="font-mono text-[11px] text-gray-600">ENTER to retry · ESC to exit</p>
        </div>
      )}
    </div>
  );
}
