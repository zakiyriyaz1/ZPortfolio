"use client";

import { usePathname } from 'next/navigation';
import React from 'react';

/**
 * Wraps each page and gives it a subtle slide-up entrance on navigation.
 *
 * THE RULE HERE: animate transform only, never opacity.
 *
 * This previously used Framer Motion's <AnimatePresence mode="wait">, where
 * every page mounted at opacity: 0 and only became visible once an animation
 * ran to completion. That makes visibility depend on an animation succeeding,
 * so any stall left the page permanently invisible even though its content was
 * present and correct in the DOM -- the "content flashes then disappears" bug.
 *
 * A transform-only animation cannot reproduce that. Content is always fully
 * opaque; the worst case if the animation never runs is that it sits 14px
 * lower than intended, still perfectly readable. The `rise` keyframes
 * (tailwind.config.ts) also deliberately carry no fill-mode, so the element's
 * resting state is its natural position.
 *
 * `key={pathname}` remounts on navigation, which restarts the animation.
 * `my-auto` keeps the vertical centering.
 */
const PageTransition = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  return (
    <div key={pathname} className="w-full my-auto motion-safe:animate-rise">
      {children}
    </div>
  );
};

export default PageTransition;
