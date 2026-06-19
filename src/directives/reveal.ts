import type { Directive, DirectiveBinding } from 'vue';

import { motion } from '@/lib/anim';

// v-reveal: animates an element into view when it scrolls past the threshold.
// Supports modifiers via binding.value: { delay?, y?, scale?, stagger? }.
// CSS sets the resting state (.reveal { opacity: 0 }); animeJS resolves it.

const REVEALED = 'is-revealed';

interface RevealOptions {
  delay?: number;
  y?: number;
  scale?: number;
  stagger?: number; // ms between direct children
}

function show(el: HTMLElement, opts: RevealOptions = {}) {
  const { delay = 0, y = 28, scale, stagger: gap } = opts;
  el.classList.add(REVEALED);

  if (typeof gap === 'number' && el.children.length > 0) {
    // Stagger direct children for grid-style entrances.
    for (const child of Array.from(el.children) as HTMLElement[]) {
      child.style.opacity = '0';
      child.style.willChange = 'opacity, transform';
    }
    motion(Array.from(el.children) as HTMLElement[], {
      opacity: [0, 1],
      translateY: [y, 0],
      scale: scale === undefined ? undefined : [scale, 1],
      delay: ((_t: HTMLElement, i: number) => delay + i * gap) as unknown as number,
      duration: 850,
      easing: 'cubicBezier(.2,.7,.2,1)'
    });
    el.style.opacity = '1'; // container already visible
    return;
  }

  motion(el, {
    opacity: [0, 1],
    translateY: [y, 0],
    scale: scale === undefined ? undefined : [scale, 1],
    delay,
    duration: 900,
    easing: 'cubicBezier(.2,.7,.2,1)'
  }) ?? (el.style.opacity = '1');
}

export const reveal: Directive<HTMLElement, RevealOptions | undefined> = {
  mounted(el, binding: DirectiveBinding<RevealOptions | undefined>) {
    el.classList.add('reveal');
    const opts = binding.value ?? {};

    if (typeof IntersectionObserver === 'undefined') {
      show(el, opts);
      return;
    }

    const io = new IntersectionObserver(
      (entries, obs) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            show(entry.target as HTMLElement, opts);
            obs.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.14, rootMargin: '0px 0px -10% 0px' }
    );
    io.observe(el);
  }
};
