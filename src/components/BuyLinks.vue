<script setup lang="ts">
import { shops } from '@/lib/shops';
</script>

<template>
  <section id="buy" class="buy bleed bleed-dark">
    <div class="buy-glow" aria-hidden="true"></div>
    <div class="container">
      <p class="eyebrow" v-reveal>{{ $t('buy.eyebrow') }}</p>
      <h2 class="section-title" v-reveal>{{ $t('buy.title') }}</h2>
      <p class="section-sub" v-reveal>
        {{ $t('buy.sub') }}
        <em>{{ $t('buy.note') }}</em>
      </p>
      <ul class="shops" v-reveal="{ stagger: 80 }">
        <li v-for="(shop, i) in shops" :key="shop.url">
          <a class="shop" :href="shop.url" target="_blank" rel="noopener noreferrer">
            <span class="shop-index" aria-hidden="true">{{ String(i + 1).padStart(2, '0') }}</span>
            <span class="shop-body">
              <span class="shop-name">{{ shop.name }}</span>
              <span class="shop-country">{{ shop.country }}</span>
            </span>
            <span class="shop-go" aria-hidden="true">↗</span>
          </a>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.buy { isolation: isolate; padding-block: clamp(4rem, 9vw, 7rem); }
.buy-glow {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(50% 80% at 100% 0%, color-mix(in oklab, var(--accent) 28%, transparent), transparent 60%),
    radial-gradient(40% 70% at 0% 100%, color-mix(in oklab, var(--accent-2) 30%, transparent), transparent 60%);
  pointer-events: none;
  z-index: 0;
}
.buy > .container { position: relative; z-index: 1; }

.shops {
  list-style: none;
  padding: 0;
  margin: 2rem 0 0;
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
}
.shop {
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 1rem;
  padding: 1.4rem 1.5rem;
  background: color-mix(in oklab, #ffffff 6%, transparent);
  border: 2px solid color-mix(in oklab, #ffffff 50%, transparent);
  border-radius: 0;
  color: inherit;
  box-shadow: 4px 4px 0 0 color-mix(in oklab, #000 60%, transparent);
  transition:
    transform 0.12s steps(3, end),
    box-shadow 0.12s steps(3, end),
    background 0.2s ease,
    border-color 0.2s ease;
}
.shop:hover {
  transform: translate(-2px, -2px);
  background: color-mix(in oklab, #ffffff 12%, transparent);
  border-color: var(--accent-2);
  box-shadow: 6px 6px 0 0 var(--accent);
  text-decoration: none;
}
.shop-index {
  font-family: var(--font-title);
  font-size: 1.4rem;
  color: var(--accent-2);
  opacity: 0.9;
  letter-spacing: -0.02em;
}
.shop-body { display: flex; flex-direction: column; gap: 0.15rem; }
.shop-name { font-weight: 600; font-size: 1.05rem; color: inherit; }
.shop-country {
  color: oklch(78% 0.04 70);
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
}
.shop-go {
  font-size: 1.4rem;
  color: var(--accent-2);
  transition: transform 0.3s ease;
}
.shop:hover .shop-go { transform: translate(4px, -4px); }
</style>
