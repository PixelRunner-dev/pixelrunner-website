<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';

import { applets, imageUrl } from '@/lib/applets';
import { motion, stagger } from '@/lib/anim';

const titleRef = ref<HTMLElement | null>(null);
const ledRef = ref<HTMLElement | null>(null);

// 6 deterministic applet thumbs for the floating preview cluster.
const thumbs = computed(() =>
  ['nos', 'doorbell', 'clockbyhenry', 'bitcointicker', 'buienradar', 'solaredgemonitor']
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
        <h1 ref="titleRef" v-once class="hero-title">{{ $t('hero.title') }}</h1>
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
  font-size: clamp(3rem, 11vw, 7.5rem);
  line-height: 0.92;
  margin: 0.4rem 0 1.25rem;
  letter-spacing: -0.04em;
  color: var(--ink);
}
.hero-title :deep(.word) {
  display: inline-block;
  will-change: transform, opacity;
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
