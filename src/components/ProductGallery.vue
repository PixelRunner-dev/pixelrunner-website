<script setup lang="ts">
import { onMounted, ref } from 'vue';

import { motion, stagger } from '@/lib/anim';

// ponytail: placeholder tiles — real photos/screenshots dropped into public/ later.
const tiles = [
  { key: 'front', span: 'wide' },
  { key: 'clock', span: 'narrow' },
  { key: 'side', span: 'tall' },
  { key: 'weather', span: 'square' },
  { key: 'desk', span: 'wide' },
  { key: 'bitcoin', span: 'narrow' }
];

const grid = ref<HTMLElement | null>(null);

function onTilt(event: MouseEvent) {
  const tile = event.currentTarget as HTMLElement;
  const rect = tile.getBoundingClientRect();
  const px = (event.clientX - rect.left) / rect.width - 0.5;
  const py = (event.clientY - rect.top) / rect.height - 0.5;
  tile.style.setProperty('--rx', `${(-py * 6).toFixed(2)}deg`);
  tile.style.setProperty('--ry', `${(px * 6).toFixed(2)}deg`);
}
function resetTilt(event: MouseEvent) {
  const tile = event.currentTarget as HTMLElement;
  tile.style.setProperty('--rx', '0deg');
  tile.style.setProperty('--ry', '0deg');
}

onMounted(() => {
  if (!grid.value) return;
  const io = new IntersectionObserver((entries, obs) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      motion(grid.value!.querySelectorAll('.gtile'), {
        opacity: [0, 1],
        translateY: [40, 0],
        scale: [0.96, 1],
        duration: 900,
        delay: stagger(80),
        easing: 'cubicBezier(.2,.7,.2,1)'
      }) ?? grid.value!.querySelectorAll('.gtile').forEach(
        (el) => ((el as HTMLElement).style.opacity = '1')
      );
      obs.disconnect();
    }
  }, { threshold: 0.2 });
  io.observe(grid.value);
});
</script>

<template>
  <section id="gallery" class="gallery bleed bleed-warm">
    <div class="container">
      <p class="eyebrow" v-reveal>{{ $t('gallery.eyebrow') }}</p>
      <h2 class="section-title" v-reveal>{{ $t('gallery.title') }}</h2>
      <p class="section-sub" v-reveal>{{ $t('gallery.sub') }}</p>

      <div ref="grid" class="gallery-grid">
        <figure
          v-for="tile in tiles"
          :key="tile.key"
          class="gtile"
          :class="`span-${tile.span}`"
          @mousemove="onTilt"
          @mouseleave="resetTilt"
        >
          <div class="gtile-inner">
            <span class="gtile-label">{{ $t(`gallery.tiles.${tile.key}`) }}</span>
          </div>
        </figure>
      </div>
    </div>
  </section>
</template>

<style scoped>
.gallery { isolation: isolate; }

.gallery-grid {
  display: grid;
  gap: clamp(0.75rem, 1.5vw, 1.25rem);
  grid-template-columns: repeat(6, 1fr);
  grid-auto-rows: clamp(120px, 16vw, 200px);
}
.gtile {
  margin: 0;
  border-radius: 0;
  overflow: hidden;
  position: relative;
  perspective: 800px;
  transform-style: preserve-3d;
  background: var(--surface);
  border: 2px solid var(--ink);
  box-shadow: 4px 4px 0 0 var(--ink);
  transition: box-shadow 0.12s steps(3, end), transform 0.12s steps(3, end);
}
.gtile:hover {
  transform: translate(-2px, -2px);
  box-shadow: 6px 6px 0 0 var(--ink), 10px 10px 0 0 var(--accent);
}

.gtile-inner {
  position: absolute;
  inset: 0;
  transform: rotateX(var(--rx, 0)) rotateY(var(--ry, 0));
  transition: transform 0.4s cubic-bezier(.2,.7,.2,1);
  display: grid;
  place-items: center;
  background:
    repeating-linear-gradient(45deg,
      color-mix(in oklab, var(--surface) 60%, transparent) 0 14px,
      transparent 14px 28px),
    linear-gradient(135deg,
      color-mix(in oklab, var(--bg-soft) 80%, transparent),
      color-mix(in oklab, var(--accent-2) 28%, transparent));
}
.gtile-label {
  font-family: var(--font-title);
  color: var(--ink);
  font-size: clamp(1rem, 1.8vw, 1.4rem);
  padding: 0.55rem 0.9rem;
  background: var(--surface);
  border: 2px solid var(--ink);
  border-radius: 0;
  box-shadow: 3px 3px 0 0 var(--accent);
  text-align: center;
}

.span-wide   { grid-column: span 6; grid-row: span 2; }
.span-narrow { grid-column: span 3; grid-row: span 1; }
.span-tall   { grid-column: span 3; grid-row: span 2; }
.span-square { grid-column: span 3; grid-row: span 2; }

@media (min-width: 780px) {
  .gallery-grid {
    grid-template-columns: repeat(12, 1fr);
    grid-auto-rows: clamp(120px, 9vw, 180px);
  }
  .span-wide   { grid-column: span 7; grid-row: span 2; }
  .span-narrow { grid-column: span 5; grid-row: span 2; }
  .span-tall   { grid-column: span 4; grid-row: span 3; }
  .span-square { grid-column: span 4; grid-row: span 2; }

  .gtile:nth-child(1) { grid-column: 1 / span 7; grid-row: span 3; }
  .gtile:nth-child(2) { grid-column: 8 / span 5; grid-row: span 2; }
  .gtile:nth-child(3) { grid-column: 8 / span 5; grid-row: span 2; }
  .gtile:nth-child(4) { grid-column: 1 / span 4; grid-row: span 2; }
  .gtile:nth-child(5) { grid-column: 5 / span 8; grid-row: span 2; }
  .gtile:nth-child(6) { grid-column: 1 / span 6; grid-row: span 2; }
}
</style>
