"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * "Z-WING" -- a Galaga-style arcade shooter that takes over the screen.
 *
 * Launched from the Z logo in the header. The mouse cursor becomes the ship
 * (the site's custom cursor is hidden while playing), and WASD / arrow keys
 * work too. Firing is automatic so it stays playable one-handed with a mouse;
 * Space fires an extra shot on demand.
 *
 * Everything runs on one <canvas> driven by a single requestAnimationFrame
 * loop. All mutable game state lives in a ref rather than React state -- the
 * loop mutates it 60x a second, and putting that in state would re-render the
 * component just as often. Only the HUD numbers (score/lives/wave) are mirrored
 * into React state, and only when they actually change.
 */

const ACCENT = "#22d3ee";
const ENEMY = "#c084fc";
const ENEMY_ALT = "#f472b6";

type Vec = { x: number; y: number };

type Bullet = Vec & { vy: number; vx: number };
type Enemy = Vec & {
  homeX: number;
  homeY: number;
  alive: boolean;
  hp: number;
  kind: 0 | 1;
  diving: boolean;
  t: number;
  diveVX: number;
};
type Particle = Vec & { vx: number; vy: number; life: number; max: number; color: string };
type Star = Vec & { z: number };

type Game = {
  w: number;
  h: number;
  ship: Vec;
  target: Vec;
  bullets: Bullet[];
  enemyBullets: Bullet[];
  enemies: Enemy[];
  particles: Particle[];
  stars: Star[];
  cooldown: number;
  invuln: number;
  swayT: number;
  score: number;
  lives: number;
  wave: number;
  over: boolean;
  keys: Set<string>;
  spawnTimer: number;
};

const MOVE_KEYS = new Set([
  "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown",
  "a", "d", "w", "s", "A", "D", "W", "S", " ",
]);

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export default function SpaceGame({ onClose }: { onClose: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const gameRef = useRef<Game | null>(null);
  const rafRef = useRef<number | null>(null);

  const [started, setStarted] = useState(false);
  const [hud, setHud] = useState({ score: 0, lives: 3, wave: 1 });
  const [gameOver, setGameOver] = useState(false);
  const [best, setBest] = useState(0);

  // Personal best, persisted locally. Wrapped because Safari private mode can
  // throw on localStorage access.
  useEffect(() => {
    try {
      const v = window.localStorage.getItem("zwing-best");
      if (v) setBest(parseInt(v, 10) || 0);
    } catch {
      /* ignore */
    }
  }, []);

  const commitBest = useCallback((score: number) => {
    setBest((prev) => {
      if (score <= prev) return prev;
      try {
        window.localStorage.setItem("zwing-best", String(score));
      } catch {
        /* ignore */
      }
      return score;
    });
  }, []);

  /** Build a fresh wave of enemies in a Galaga-style formation. */
  const buildWave = useCallback((g: Game, wave: number) => {
    const cols = Math.min(9, 5 + Math.floor(wave / 2));
    const rows = Math.min(5, 2 + Math.floor(wave / 3));
    const spacingX = Math.min(88, (g.w - 120) / cols);
    const startX = (g.w - (cols - 1) * spacingX) / 2;
    const enemies: Enemy[] = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = startX + c * spacingX;
        const y = 90 + r * 62;
        enemies.push({
          x, y, homeX: x, homeY: y,
          alive: true,
          hp: r === 0 ? 2 : 1,
          kind: r === 0 ? 1 : 0,
          diving: false,
          t: Math.random() * Math.PI * 2,
          diveVX: 0,
        });
      }
    }
    g.enemies = enemies;
  }, []);

  const resetGame = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    const g: Game = {
      w, h,
      ship: { x: w / 2, y: h - 90 },
      target: { x: w / 2, y: h - 90 },
      bullets: [], enemyBullets: [], enemies: [], particles: [],
      stars: Array.from({ length: 110 }, () => ({
        x: Math.random() * w, y: Math.random() * h, z: rand(0.25, 1.4),
      })),
      cooldown: 0, invuln: 0, swayT: 0,
      score: 0, lives: 3, wave: 1,
      over: false,
      keys: new Set(),
      spawnTimer: 0,
    };
    buildWave(g, 1);
    gameRef.current = g;
    setHud({ score: 0, lives: 3, wave: 1 });
    setGameOver(false);
  }, [buildWave]);

  const explode = (g: Game, x: number, y: number, color: string, count = 14) => {
    for (let i = 0; i < count; i++) {
      const a = Math.random() * Math.PI * 2;
      const sp = rand(0.6, 4);
      g.particles.push({
        x, y,
        vx: Math.cos(a) * sp, vy: Math.sin(a) * sp,
        life: 1, max: rand(18, 36), color,
      });
    }
  };

  // ---- main loop -------------------------------------------------------
  useEffect(() => {
    if (!started) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const fit = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(canvas.clientWidth * dpr);
      canvas.height = Math.floor(canvas.clientHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const g = gameRef.current;
      if (g) {
        g.w = canvas.clientWidth;
        g.h = canvas.clientHeight;
      }
    };
    fit();
    if (!gameRef.current) resetGame();
    window.addEventListener("resize", fit);

    const onMove = (e: MouseEvent) => {
      const g = gameRef.current;
      if (!g) return;
      const r = canvas.getBoundingClientRect();
      g.target.x = e.clientX - r.left;
      g.target.y = e.clientY - r.top;
    };
    const onTouch = (e: TouchEvent) => {
      const g = gameRef.current;
      if (!g || !e.touches[0]) return;
      const r = canvas.getBoundingClientRect();
      g.target.x = e.touches[0].clientX - r.left;
      g.target.y = e.touches[0].clientY - r.top;
      e.preventDefault();
    };
    const onKeyDown = (e: KeyboardEvent) => {
      const g = gameRef.current;
      if (!g) return;
      if (MOVE_KEYS.has(e.key)) e.preventDefault(); // stop the page scrolling
      g.keys.add(e.key.length === 1 ? e.key.toLowerCase() : e.key);
      if (e.key === " " && g.cooldown > 3) g.cooldown = 3;
    };
    const onKeyUp = (e: KeyboardEvent) => {
      gameRef.current?.keys.delete(e.key.length === 1 ? e.key.toLowerCase() : e.key);
    };

    window.addEventListener("mousemove", onMove);
    canvas.addEventListener("touchmove", onTouch, { passive: false });
    canvas.addEventListener("touchstart", onTouch, { passive: false });
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);

    let lastHud = { score: -1, lives: -1, wave: -1 };

    const step = () => {
      const g = gameRef.current;
      if (!g) return;
      const { w, h } = g;

      ctx.fillStyle = "#05060a";
      ctx.fillRect(0, 0, w, h);

      // starfield
      for (const s of g.stars) {
        s.y += s.z * 1.6;
        if (s.y > h) { s.y = -2; s.x = Math.random() * w; }
        ctx.globalAlpha = 0.25 + s.z * 0.5;
        ctx.fillStyle = s.z > 1 ? ACCENT : "#ffffff";
        ctx.fillRect(s.x, s.y, s.z > 1 ? 2 : 1, s.z > 1 ? 2 : 1);
      }
      ctx.globalAlpha = 1;

      if (!g.over) {
        // --- ship movement: keyboard nudges the target, mouse sets it ---
        const speed = 7;
        if (g.keys.has("arrowleft") || g.keys.has("ArrowLeft") || g.keys.has("a")) g.target.x -= speed;
        if (g.keys.has("arrowright") || g.keys.has("ArrowRight") || g.keys.has("d")) g.target.x += speed;
        if (g.keys.has("arrowup") || g.keys.has("ArrowUp") || g.keys.has("w")) g.target.y -= speed;
        if (g.keys.has("arrowdown") || g.keys.has("ArrowDown") || g.keys.has("s")) g.target.y += speed;

        g.target.x = Math.max(20, Math.min(w - 20, g.target.x));
        g.target.y = Math.max(h * 0.35, Math.min(h - 40, g.target.y));
        // ease toward the target so movement feels weighty rather than snapping
        g.ship.x += (g.target.x - g.ship.x) * 0.22;
        g.ship.y += (g.target.y - g.ship.y) * 0.22;

        // --- firing (automatic) ---
        g.cooldown -= 1;
        if (g.cooldown <= 0) {
          g.bullets.push({ x: g.ship.x, y: g.ship.y - 18, vy: -11, vx: 0 });
          g.cooldown = 11;
        }

        // --- enemies ---
        g.swayT += 0.012;
        const sway = Math.sin(g.swayT) * Math.min(70, 24 + g.wave * 5);
        let aliveCount = 0;

        for (const e of g.enemies) {
          if (!e.alive) continue;
          aliveCount++;
          e.t += 0.03;
          if (e.diving) {
            e.y += 3.4 + g.wave * 0.25;
            e.x += e.diveVX + Math.sin(e.t * 2) * 1.4;
            if (e.y > h + 40) { // wrap back to formation
              e.diving = false;
              e.y = -30;
            }
          } else {
            e.x = e.homeX + sway;
            e.y = e.homeY + Math.sin(e.t) * 5;
          }

          // occasional dive + shots
          if (!e.diving && Math.random() < 0.0009 + g.wave * 0.00012) {
            e.diving = true;
            e.diveVX = (g.ship.x - e.x) / 110;
          }
          if (Math.random() < 0.0012 + g.wave * 0.00015) {
            g.enemyBullets.push({ x: e.x, y: e.y + 14, vy: 4.2 + g.wave * 0.15, vx: 0 });
          }
        }

        // wave cleared
        if (aliveCount === 0) {
          g.wave += 1;
          g.score += 150;
          buildWave(g, g.wave);
        }

        // --- bullets ---
        g.bullets = g.bullets.filter((b) => {
          b.y += b.vy;
          return b.y > -20;
        });
        g.enemyBullets = g.enemyBullets.filter((b) => {
          b.y += b.vy;
          return b.y < h + 20;
        });

        // player bullets vs enemies
        for (const b of g.bullets) {
          for (const e of g.enemies) {
            if (!e.alive) continue;
            if (Math.abs(b.x - e.x) < 18 && Math.abs(b.y - e.y) < 16) {
              b.y = -999;
              e.hp -= 1;
              if (e.hp <= 0) {
                e.alive = false;
                g.score += e.kind === 1 ? 150 : 100;
                explode(g, e.x, e.y, e.kind === 1 ? ENEMY_ALT : ENEMY);
              } else {
                explode(g, e.x, e.y, "#ffffff", 5);
              }
              break;
            }
          }
        }
        g.bullets = g.bullets.filter((b) => b.y > -20);

        // hazards vs player
        g.invuln -= 1;
        const hit = (x: number, y: number, r: number) =>
          Math.abs(x - g.ship.x) < r && Math.abs(y - g.ship.y) < r;

        if (g.invuln <= 0) {
          let struck = false;
          for (const b of g.enemyBullets) {
            if (hit(b.x, b.y, 15)) { struck = true; b.y = h + 999; break; }
          }
          if (!struck) {
            for (const e of g.enemies) {
              if (e.alive && e.diving && hit(e.x, e.y, 24)) {
                struck = true;
                e.alive = false;
                explode(g, e.x, e.y, ENEMY);
                break;
              }
            }
          }
          if (struck) {
            g.lives -= 1;
            g.invuln = 110;
            explode(g, g.ship.x, g.ship.y, ACCENT, 30);
            if (g.lives <= 0) {
              g.over = true;
              setGameOver(true);
              commitBest(g.score);
            }
          }
        }
        g.enemyBullets = g.enemyBullets.filter((b) => b.y < h + 20);
      }

      // --- draw enemies ---
      for (const e of g.enemies) {
        if (!e.alive) continue;
        const col = e.kind === 1 ? ENEMY_ALT : ENEMY;
        ctx.save();
        ctx.translate(e.x, e.y);
        ctx.shadowColor = col;
        ctx.shadowBlur = 12;
        ctx.fillStyle = col;
        // little crab-ish invader shape
        ctx.beginPath();
        ctx.moveTo(0, -11);
        ctx.lineTo(13, 3);
        ctx.lineTo(7, 3);
        ctx.lineTo(9, 11);
        ctx.lineTo(0, 6);
        ctx.lineTo(-9, 11);
        ctx.lineTo(-7, 3);
        ctx.lineTo(-13, 3);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }

      // --- draw bullets ---
      ctx.shadowBlur = 10;
      ctx.shadowColor = ACCENT;
      ctx.fillStyle = ACCENT;
      for (const b of g.bullets) ctx.fillRect(b.x - 1.5, b.y - 10, 3, 12);
      ctx.shadowColor = ENEMY_ALT;
      ctx.fillStyle = ENEMY_ALT;
      for (const b of g.enemyBullets) ctx.fillRect(b.x - 2, b.y - 6, 4, 10);
      ctx.shadowBlur = 0;

      // --- particles ---
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

      // --- draw ship ---
      if (!g.over) {
        const blink = g.invuln > 0 && Math.floor(g.invuln / 5) % 2 === 0;
        if (!blink) {
          ctx.save();
          ctx.translate(g.ship.x, g.ship.y);
          ctx.shadowColor = ACCENT;
          ctx.shadowBlur = 18;
          ctx.fillStyle = ACCENT;
          ctx.beginPath();
          ctx.moveTo(0, -20);
          ctx.lineTo(13, 12);
          ctx.lineTo(4, 7);
          ctx.lineTo(0, 15);
          ctx.lineTo(-4, 7);
          ctx.lineTo(-13, 12);
          ctx.closePath();
          ctx.fill();
          // thruster
          ctx.globalAlpha = 0.75;
          ctx.fillStyle = "#fff";
          ctx.fillRect(-2, 13, 4, rand(5, 12));
          ctx.globalAlpha = 1;
          ctx.restore();
        }
      }

      // mirror HUD into React only when the numbers change
      if (g.score !== lastHud.score || g.lives !== lastHud.lives || g.wave !== lastHud.wave) {
        lastHud = { score: g.score, lives: g.lives, wave: g.wave };
        setHud({ score: g.score, lives: g.lives, wave: g.wave });
      }

      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", fit);
      window.removeEventListener("mousemove", onMove);
      canvas.removeEventListener("touchmove", onTouch);
      canvas.removeEventListener("touchstart", onTouch);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [started, resetGame, buildWave, commitBest]);

  // Escape closes; hide the site cursor and lock scroll while the game is up.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    document.documentElement.setAttribute("data-zgame", "open");
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.removeAttribute("data-zgame");
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  const start = () => {
    resetGame();
    setStarted(true);
  };
  const restart = () => {
    resetGame();
    setGameOver(false);
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-[#05060a]">
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full touch-none" />

      {/* HUD */}
      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-4 font-mono text-xs sm:text-sm">
        <div className="space-y-1 text-accent">
          <div>SCORE {String(hud.score).padStart(6, "0")}</div>
          <div className="opacity-70">BEST {String(best).padStart(6, "0")}</div>
        </div>
        <div className="space-y-1 text-right text-accent">
          <div>WAVE {hud.wave}</div>
          <div aria-label={`${hud.lives} lives remaining`}>
            {"▲".repeat(Math.max(0, hud.lives))}
            <span className="opacity-25">{"▲".repeat(Math.max(0, 3 - hud.lives))}</span>
          </div>
        </div>
      </div>

      <button
        onClick={onClose}
        className="absolute right-3 top-16 z-10 rounded-md border border-accent/40 px-3 py-1.5 font-mono text-xs text-accent transition-colors hover:bg-accent/10 sm:top-20"
      >
        ESC ✕
      </button>

      {/* Start screen */}
      {!started && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 bg-[#05060a]/85 px-6 text-center">
          <h2
            className="font-cyber text-4xl text-accent sm:text-6xl"
            style={{ textShadow: "0 0 18px rgba(34,211,238,0.8)" }}
          >
            Z-WING
          </h2>
          <p className="max-w-sm font-mono text-xs leading-relaxed text-gray-400 sm:text-sm">
            Move with the <span className="text-accent">mouse</span> or{" "}
            <span className="text-accent">WASD / arrows</span>.
            <br />
            Guns are automatic. Clear the swarm.
          </p>
          <button
            onClick={start}
            className="rounded-md bg-accent px-8 py-3 font-mono font-bold text-dark transition-transform hover:scale-105"
          >
            LAUNCH
          </button>
          <p className="font-mono text-[11px] text-gray-600">ESC to exit</p>
        </div>
      )}

      {/* Game over */}
      {gameOver && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-5 bg-[#05060a]/85 px-6 text-center">
          <h2 className="font-cyber text-3xl text-accent sm:text-5xl">GAME OVER</h2>
          <div className="font-mono text-sm text-gray-300">
            <div>SCORE {hud.score}</div>
            <div className="mt-1 text-gray-500">
              {hud.score >= best ? "NEW PERSONAL BEST" : `BEST ${best}`}
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={restart}
              className="rounded-md bg-accent px-6 py-2.5 font-mono font-bold text-dark transition-transform hover:scale-105"
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
        </div>
      )}
    </div>
  );
}
