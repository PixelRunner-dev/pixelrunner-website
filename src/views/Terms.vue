<script setup lang="ts">
import { RouterLink } from 'vue-router';
</script>

<template>
  <main id="main" class="legal">
    <div class="container container-narrow">
      <RouterLink to="/" class="back">{{ $t('legal.back') }}</RouterLink>
      <p class="eyebrow">{{ $t('legal.eyebrow') }}</p>
      <h1 v-reveal>{{ $t('terms.title') }}</h1>
      <p class="updated">{{ $t('legal.updated', { date: '18 June 2026' }) }}</p>

      <section v-reveal>
        <h2>{{ $t('terms.productTitle') }}</h2>
        <p>{{ $t('terms.product') }}</p>
      </section>

      <section v-reveal>
        <h2>{{ $t('terms.ordersTitle') }}</h2>
        <p>{{ $t('terms.orders') }}</p>
      </section>

      <section v-reveal>
        <h2>{{ $t('terms.warrantyTitle') }}</h2>
        <p>{{ $t('terms.warranty') }}</p>
      </section>

      <section v-reveal>
        <h2>{{ $t('terms.openSourceTitle') }}</h2>
        <p>{{ $t('terms.openSource') }}</p>
      </section>

      <section v-reveal>
        <h2>{{ $t('terms.accessibilityTitle') }}</h2>
        <p>{{ $t('terms.accessibility') }}</p>
      </section>

      <p class="placeholder-note">{{ $t('legal.placeholder') }}</p>
    </div>
  </main>
</template>

<style scoped>
.legal { padding-block: clamp(3rem, 8vw, 6rem); }
.legal h1 {
  font-family: var(--font-title);
  font-size: clamp(2.4rem, 6vw, 4rem);
  margin-bottom: 0.4rem;
  letter-spacing: -0.03em;
}
.legal h2 {
  margin-top: 2.5rem;
  margin-bottom: 0.6rem;
  font-family: var(--font-title);
  font-size: clamp(1.2rem, 2vw, 1.4rem);
  color: var(--ink);
}
.legal p { color: var(--muted); }
.back {
  display: block;
  width: max-content;
  margin-bottom: 2rem;
  color: var(--accent);
  font-weight: 600;
}
.legal .eyebrow { margin-bottom: 0.75rem; }
.updated { font-size: 0.85rem; margin-bottom: 1.5rem; }
.placeholder-note {
  margin-top: 2.5rem;
  font-style: italic;
  font-size: 0.85rem;
  opacity: 0.7;
}
</style>
