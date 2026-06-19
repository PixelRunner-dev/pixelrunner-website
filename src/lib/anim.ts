// Thin wrapper around animeJS that respects prefers-reduced-motion.
// Showcase animations should *never* fight assistive tech.

import { animate, stagger } from 'animejs';

export function prefersReducedMotion(): boolean {
  return (
    typeof globalThis.matchMedia === 'function' &&
    globalThis.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

type Targets = Parameters<typeof animate>[0];
type Params = Parameters<typeof animate>[1];

/** animate() that snaps to the final state when reduced motion is requested. */
export function motion(targets: Targets, params: Params) {
  if (prefersReducedMotion()) {
    // Skip — let CSS show the resting state, no transform/opacity needed.
    return null;
  }
  return animate(targets, params);
}

export { stagger };
