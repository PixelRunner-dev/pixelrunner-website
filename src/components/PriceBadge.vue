<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';

import { PRICE_EUR, fetchBtcEur, formatSats, productPriceSats } from '@/lib/price';
import { motion, prefersReducedMotion } from '@/lib/anim';

const REFRESH_MS = 60_000;

const btcEur = ref<number | null>(null);
const failed = ref(false);
const displaySats = ref<number | null>(null);
let timer: ReturnType<typeof setInterval> | undefined;
let controller: AbortController | undefined;

const targetSats = computed(() => {
  if (btcEur.value === null) return null;
  try { return productPriceSats(btcEur.value); }
  catch { return null; }
});

const satsLabel = computed(() =>
  displaySats.value === null ? '—' : formatSats(displaySats.value)
);

async function refresh() {
  controller?.abort();
  controller = new AbortController();
  try {
    btcEur.value = await fetchBtcEur(controller.signal);
    failed.value = false;
  } catch (error) {
    if ((error as Error).name !== 'AbortError') failed.value = true;
  }
}

watch(targetSats, (next, prev) => {
  if (next === null) { displaySats.value = null; return; }
  if (prev === null || prev === undefined || prefersReducedMotion()) {
    displaySats.value = next;
    return;
  }
  const proxy = { v: prev };
  displaySats.value = prev;
  motion(proxy, {
    v: next,
    duration: 1200,
    easing: 'cubicBezier(.2,.7,.2,1)',
    onUpdate: () => { displaySats.value = Math.round(proxy.v); }
  });
});

onMounted(() => {
  void refresh();
  timer = setInterval(() => void refresh(), REFRESH_MS);
});

onBeforeUnmount(() => {
  if (timer) clearInterval(timer);
  controller?.abort();
});
</script>

<template>
  <section
    class="price-band"
    data-test="price-badge"
    :aria-label="$t('price.ariaLabel')"
  >
    <div class="scanlines" aria-hidden="true"></div>
    <div class="grid-overlay" aria-hidden="true"></div>

    <div class="container price-row">
      <div class="price-amount">
        <p class="price-label">{{ $t('price.label') }}</p>
        <span class="price-sats" aria-live="polite">
          <span data-test="sats" class="sats-num">{{ satsLabel }}</span>
          <span class="unit">{{ $t('price.unit') }}</span>
        </span>
        <span class="price-eur">≈ €{{ PRICE_EUR }}</span>
        <p class="price-tag">{{ $t('price.tagline') }}</p>
      </div>

      <div class="price-meta">
        <p v-if="failed" class="price-stale">{{ $t('price.stale') }}</p>
        <a href="#buy" class="pixel-btn" data-test="hero-cta-buy">
          <span class="pixel-btn-glint" aria-hidden="true"></span>
          <span class="pixel-btn-label">{{ $t('price.cta') }}</span>
          <span class="pixel-btn-arrow" aria-hidden="true">▶</span>
        </a>
      </div>
    </div>
  </section>
</template>

<style scoped>
.price-band {
  position: relative;
  overflow: hidden;
  padding-block: clamp(3rem, 7vw, 5.5rem);
  background:
    linear-gradient(180deg,
      color-mix(in oklab, var(--ink) 100%, transparent),
      color-mix(in oklab, var(--ink) 92%, transparent));
  color: var(--bg);
  border-top: 4px solid var(--accent);
  border-bottom: 4px solid var(--accent);
  box-shadow:
    inset 0 6px 0 color-mix(in oklab, var(--accent-2) 35%, transparent),
    inset 0 -6px 0 color-mix(in oklab, var(--accent-2) 35%, transparent);
}

.scanlines {
  position: absolute;
  inset: 0;
  background-image: repeating-linear-gradient(
    to bottom,
    color-mix(in oklab, #000 20%, transparent) 0 2px,
    transparent 2px 4px
  );
  pointer-events: none;
  opacity: 0.35;
  mix-blend-mode: overlay;
}
/* Pixel grid backdrop */
.grid-overlay {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(to right,
      color-mix(in oklab, var(--accent) 14%, transparent) 1px, transparent 1px),
    linear-gradient(to bottom,
      color-mix(in oklab, var(--accent) 14%, transparent) 1px, transparent 1px);
  background-size: 16px 16px;
  pointer-events: none;
  mask-image: linear-gradient(180deg, transparent, #000 40%, #000 60%, transparent);
  -webkit-mask-image: linear-gradient(180deg, transparent, #000 40%, #000 60%, transparent);
}

.price-row {
  position: relative;
  display: grid;
  grid-template-columns: 1fr;
  gap: 2.5rem;
  align-items: center;
}
@media (min-width: 880px) {
  .price-row { grid-template-columns: 1.4fr auto; gap: 3rem; }
}

.price-amount {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.75rem;
}
.price-label {
  margin: 0;
  font-family: var(--font-mono);
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: var(--accent-2);
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
}
.price-label::before {
  content: '';
  width: 10px; height: 10px;
  background: var(--accent-2);
  /* tiny pixel diamond */
  clip-path: polygon(50% 0, 100% 50%, 50% 100%, 0 50%);
  animation: pixelBlink 1.4s steps(2, end) infinite;
}
@keyframes pixelBlink {
  0%, 60% { opacity: 1; }
  61%, 100% { opacity: 0.25; }
}

.price-sats {
  display: inline-flex;
  align-items: baseline;
  gap: 0.55rem;
  line-height: 1;
}
.sats-num {
  /* Mono pixel-flavor for the big number — NOT Cooper */
  font-family: var(--font-mono);
  font-weight: 800;
  font-size: clamp(3rem, 9vw, 6rem);
  letter-spacing: -0.04em;
  color: var(--bg);
  font-variant-numeric: tabular-nums;
}
.unit {
  font-family: var(--font-body);
  font-size: 1rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.22em;
  color: var(--accent-2);
}
.price-eur {
  font-family: var(--font-mono);
  font-size: 0.95rem;
  font-weight: 600;
  color: color-mix(in oklab, var(--bg) 70%, transparent);
  letter-spacing: 0.08em;
}
.price-tag {
  margin: 0.4rem 0 0;
  font-family: var(--font-body);
  font-size: 0.9rem;
  color: color-mix(in oklab, var(--bg) 80%, transparent);
  max-width: 38ch;
}

.price-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1.5rem;
  width: 100%;
}
@media (min-width: 880px) {
  .price-meta { align-items: flex-end; width: auto; }
}
.price-stale {
  margin: 0;
  font-family: var(--font-mono);
  font-size: 0.74rem;
  text-transform: uppercase;
  letter-spacing: 0.2em;
  color: oklch(78% 0.16 70);
}

/* ============== Pixel CTA — much bigger, animated ============== */
.pixel-btn {
  --btn-bg: var(--accent);
  --btn-shadow: var(--bg);
  --btn-shadow-2: var(--accent-2);

  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 1.5rem 2.5rem;
  min-width: clamp(260px, 28vw, 360px);
  background: var(--btn-bg);
  color: var(--bg);
  font-family: var(--font-title);
  font-size: clamp(1.3rem, 2.4vw, 1.75rem);
  letter-spacing: 0.04em;
  text-transform: uppercase;
  border: 4px solid var(--bg);
  border-radius: 0;
  text-decoration: none;
  overflow: hidden;
  /* multi-layer stepped pixel shadow */
  box-shadow:
    6px 6px 0 0 var(--btn-shadow),
    12px 12px 0 0 var(--btn-shadow-2);
  transition:
    transform 0.12s steps(3, end),
    box-shadow 0.12s steps(3, end),
    filter 0.2s ease;
  animation: pixelPulse 2.4s steps(8, end) infinite;
}
@keyframes pixelPulse {
  0%, 100% { filter: brightness(1); }
  50%      { filter: brightness(1.18); }
}

.pixel-btn:hover {
  transform: translate(-3px, -3px);
  text-decoration: none;
  box-shadow:
    9px 9px 0 0 var(--btn-shadow),
    16px 16px 0 0 var(--btn-shadow-2);
  animation-play-state: paused;
}
.pixel-btn:active {
  transform: translate(3px, 3px);
  box-shadow:
    3px 3px 0 0 var(--btn-shadow),
    6px 6px 0 0 var(--btn-shadow-2);
}

.pixel-btn-label { position: relative; z-index: 1; }
.pixel-btn-arrow {
  position: relative;
  z-index: 1;
  font-size: 0.85em;
  transition: transform 0.12s steps(2, end);
}
.pixel-btn:hover .pixel-btn-arrow { transform: translateX(6px); }

/* Sweeping pixel glint on hover */
.pixel-btn-glint {
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    115deg,
    transparent 0 10px,
    color-mix(in oklab, #ffffff 30%, transparent) 10px 14px,
    transparent 14px 28px
  );
  transform: translateX(-120%);
  pointer-events: none;
  transition: transform 0.5s steps(12, end);
}
.pixel-btn:hover .pixel-btn-glint { transform: translateX(120%); }

/* Pixel border-walk — chasing accents around the button */
.pixel-btn::before,
.pixel-btn::after {
  content: '';
  position: absolute;
  width: 8px; height: 8px;
  background: var(--bg);
  z-index: 2;
  animation: walkPixel 2.4s steps(4, end) infinite;
}
.pixel-btn::before { top: -4px; left: -4px; }
.pixel-btn::after  { bottom: -4px; right: -4px; animation-delay: 1.2s; }
@keyframes walkPixel {
  0%   { transform: translate(0, 0);    background: var(--bg); }
  25%  { transform: translate(calc(100% + 4px), 0); }
  50%  { transform: translate(calc(100% + 4px), calc(100% + 4px)); }
  75%  { transform: translate(0, calc(100% + 4px)); }
  100% { transform: translate(0, 0); }
}

@media (prefers-reduced-motion: reduce) {
  .pixel-btn { animation: none; }
  .pixel-btn::before, .pixel-btn::after { animation: none; }
  .pixel-btn-glint { display: none; }
  .price-label::before { animation: none; }
}
</style>
