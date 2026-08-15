"use client";

import { usePathname } from 'next/navigation';
import React from 'react';

/**
 * Wraps each page. Deliberately renders content with NO entrance animation.
 *
 * Why: this previously used Framer Motion's <AnimatePresence mode="wait">,
 * where every page mounted at opacity: 0 and only became visible once an
 * animation ran to completion. That makes visibility depend on the animation
 * succeeding -- and if the animation stalls for any reason (a stalled
 * compositor, a throttled rAF loop, an AnimatePresence exit handshake that
 * never fires), the page is left permanently invisible even though all of its
 * content is present and correct in the DOM. That matches the reported bug
 * exactly: content there but unseen, nothing in the console, a hard refresh
 * working, and clicking around sometimes shaking it loose.
 *
 * Rather than guess at which specific stall was to blame, this removes the
 * failure mode: content is visible by default and nothing has to run for it to
 * show up.
 *
 * `key={pathname}` is kept so React still remounts page content on navigation.
 * `my-auto` keeps the vertical centering fix.
 *
 * If an entrance animation is added back later, animate transform only (or
 * start from opacity: 1) so that a stalled animation can never hide content.
 */
const PageTransition = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();

  return (
    <div key={pathname} className="w-full my-auto">
      {children}
    </div>
  );
};

export default PageTransition;
