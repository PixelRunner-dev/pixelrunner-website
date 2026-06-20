<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';

import { applets, imageUrl } from '@/lib/applets';
import { motion, stagger } from '@/lib/anim';

const titleRef = ref<HTMLElement | null>(null);
const ledRef = ref<HTMLElement | null>(null);

// 6 deterministic applet thumbs for the floating preview cluster.
const thumbs = computed(() =>
  ['nunl', 'doorbell', 'clockbyhenry', 'bitcointicker', 'buienradar', 'nyancat']
    .map((pkg) => applets.find((a) => a.packageName === pkg) ?? applets[0])
    .filter(Boolean)
);

function splitTitle(el: HTMLElement) {
  // Wrap each word in a span so we can stagger the entrance.
  const text = el.textContent ?? '';
  el.textContent = '';
  for (const word of text.split(/\s+/).filter(Boolean)) {
    const w = document.createElement('span');
    w.className = 'word';
    w.textContent = word;
    el.appendChild(w);
    el.appendChild(document.createTextNode(' '));
  }
}

onMounted(() => {
  if (titleRef.value) {
    splitTitle(titleRef.value);
    motion(titleRef.value.querySelectorAll('.word'), {
      opacity: [0, 1],
      translateY: [60, 0],
      rotateZ: [4, 0],
      duration: 1100,
      delay: stagger(70, { start: 200 }),
      easing: 'cubicBezier(.2,.7,.2,1)'
    });
  }
  if (ledRef.value) {
    motion(ledRef.value.querySelectorAll('.led-thumb'), {
      opacity: [0, 1],
      translateY: [40, 0],
      scale: [0.9, 1],
      duration: 900,
      delay: stagger(110, { start: 350 }),
      easing: 'cubicBezier(.2,.7,.2,1)'
    });
  }
});
</script>

<template>
  <header class="hero">
    <div class="hero-glow" aria-hidden="true"></div>

    <div class="container hero-inner">
      <div class="hero-copy">
        <p class="eyebrow">{{ $t('hero.eyebrow') }}</p>
        <h1 ref="titleRef" v-once class="hero-title" data-test="hero-title">{{ $t('hero.title') }}</h1>
        <p class="hero-lede">{{ $t('hero.lede') }}</p>

        <dl class="hero-stats" v-reveal="{ delay: 600 }">
          <div>
            <dt>{{ $t('hero.statApplets.title') }}</dt>
            <dd>{{ $t('hero.statApplets.body') }}</dd>
          </div>
          <div>
            <dt>{{ $t('hero.statPixels.title') }}</dt>
            <dd>{{ $t('hero.statPixels.body') }}</dd>
          </div>
          <div>
            <dt>{{ $t('hero.statCloud.title') }}</dt>
            <dd>{{ $t('hero.statCloud.body') }}</dd>
          </div>
        </dl>
      </div>

      <div class="hero-stage">
        <div ref="ledRef" class="led-cluster" aria-hidden="true">
          <div
            v-for="(applet, i) in thumbs"
            :key="applet.packageName"
            class="led-thumb"
            :class="`led-thumb-${i + 1}`"
          >
            <img
              :src="imageUrl(applet)"
              :alt="applet.name"
              class="applet-image"
              loading="lazy"
              decoding="async"
              width="128"
              height="64"
              @error="(e) => (e.target as HTMLImageElement).classList.add('broken')"
            />
          </div>
        </div>
      </div>
    </div>

  </header>
</template>

<style scoped>
.hero {
  position: relative;
  overflow: hidden;
  padding-block: clamp(2rem, 6vw, 5rem) clamp(4rem, 8vw, 8rem);
}
.hero-glow {
  position: absolute;
  inset: -10% -10% auto -10%;
  height: 60%;
  background:
    radial-gradient(60% 80% at 80% 20%, color-mix(in oklab, var(--accent) 24%, transparent), transparent 60%),
    radial-gradient(40% 60% at 10% 30%, color-mix(in oklab, var(--accent-2) 30%, transparent), transparent 70%);
  filter: blur(8px);
  pointer-events: none;
  z-index: 0;
}
.hero-inner {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: 1fr;
  gap: clamp(2rem, 4vw, 4rem);
  align-items: center;
}
@media (min-width: 960px) {
  .hero-inner {
    grid-template-columns: minmax(0, 1.05fr) minmax(0, 1fr);
  }
}

.hero-title {
  position: relative;
  isolation: isolate;
  font-size: clamp(3rem, 11vw, 7.5rem);
  line-height: 0.92;
  margin: 0.4rem 0 1.25rem;
  letter-spacing: -0.04em;
  color: var(--ink);
}
.hero-title :deep(.word) {
  position: relative;
  display: inline-block;
  will-change: transform, opacity;
  background-image:
    radial-gradient(
      circle at center,
      transparent 0 24%,
      color-mix(in oklab, var(--bg-soft) 70%, transparent) 26% 34%,
      transparent 36%
    ),
    linear-gradient(
      100deg,
      color-mix(in oklab, var(--ink)    55%, transparent)  0%,
      color-mix(in oklab, var(--ink)    55%, transparent) 30%,
      color-mix(in oklab, var(--accent) 55%, transparent) 55%,
      color-mix(in oklab, var(--ink)    55%, transparent) 90%
    );
  background-size: 9px 9px, 240% 100%;
  background-position: 0 0, 0% 50%;
  background-repeat: repeat, no-repeat;
  background-clip: text, text;
  -webkit-background-clip: text;
  color: transparent;
  -webkit-text-fill-color: transparent;
  text-shadow:
    1px 1px 0 color-mix(in oklab, var(--accent) 90%, transparent),
    2px 2px 0 color-mix(in oklab, var(--accent) 75%, transparent),
    3px 3px 0 color-mix(in oklab, var(--accent) 55%, transparent),
    4px 4px 0 color-mix(in oklab, var(--ink) 90%, transparent),
    5px 5px 0 color-mix(in oklab, var(--ink) 70%, transparent),
    6px 6px 0 color-mix(in oklab, var(--ink) 50%, transparent),
    7px 7px 0 color-mix(in oklab, var(--ink) 30%, transparent),
    8px 8px 0 color-mix(in oklab, var(--ink) 15%, transparent);
  animation: title-sweep 9s steps(48, end) infinite alternate;
}
.hero-title :deep(.word:nth-child(even)) {
  animation-delay: -4.5s;
}
@keyframes title-sweep {
  from { background-position: 0 0,    0% 50%; }
  to   { background-position: 9px 0, 240% 50%; }
}
@media (prefers-reduced-motion: reduce) {
  .hero-title :deep(.word) {
    animation: none;
    background-position: 0 0, 35% 50%;
  }
}
.hero-lede {
  color: var(--muted);
  font-size: clamp(1.05rem, 1.6vw, 1.25rem);
  max-width: 52ch;
  margin: 0;
}
.hero-stats {
  display: grid;
  grid-template-columns: repeat(3, auto);
  gap: 1.5rem 2.5rem;
  margin: 2.5rem 0 0;
  padding: 0;
}
.hero-stats div { margin: 0; }
.hero-stats dt {
  font-family: var(--font-title);
  font-size: clamp(1.6rem, 3vw, 2.2rem);
  color: var(--ink);
}
.hero-stats dd {
  margin: 0;
  font-size: 0.85rem;
  color: var(--muted);
  text-transform: uppercase;
  letter-spacing: 0.12em;
}

/* Stage: floating LED thumbs */
.hero-stage {
  position: relative;
  min-height: clamp(360px, 50vw, 540px);
}
.led-cluster {
  position: absolute;
  inset: 0;
}
.led-thumb {
  position: absolute;
  width: clamp(140px, 22vw, 220px);
  aspect-ratio: 2 / 1;
  background: #000;
  border-radius: var(--radius-s);
  overflow: hidden;
  display: grid;
  place-items: center;
  box-shadow: var(--shadow-2);
  border: 4px solid color-mix(in oklab, var(--ink) 88%, transparent);
  will-change: transform, opacity;
}
.led-thumb-1 { top: 0%;   left: 5%;  transform: rotate(-6deg); }
.led-thumb-2 { top: 8%;   right: 0%; transform: rotate(5deg); }
.led-thumb-3 { top: 38%;  left: 0%;  transform: rotate(2deg); }
.led-thumb-4 { top: 32%;  right: 10%; transform: rotate(-3deg); }
.led-thumb-5 { bottom: 8%; left: 18%; transform: rotate(4deg); }
.led-thumb-6 { bottom: 0%; right: 4%; transform: rotate(-5deg); }

.applet-image {
  width: 100%;
  height: 100%;
  image-rendering: pixelated;
  object-fit: contain;
  mask-image: url('/mask.png');
  -webkit-mask-image: url('/mask.png');
  mask-size: contain;
  -webkit-mask-size: contain;
  mask-repeat: no-repeat;
  -webkit-mask-repeat: no-repeat;
  mask-position: center;
  -webkit-mask-position: center;
}
.applet-image.broken { visibility: hidden; }

@media (max-width: 760px) {
  .hero-stage { min-height: 380px; }
  .led-thumb { width: clamp(120px, 38vw, 180px); }
  .led-thumb-2 { right: 4%; }
  .led-thumb-4 { right: 4%; }
  .hero-stats { gap: 1rem 1.5rem; }
}

</style>
