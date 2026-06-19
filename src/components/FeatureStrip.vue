<script setup lang="ts">
// Three-up benefit strip — keeps the page "fuller" without filler copy.
const items = ['nocloud', 'configure', 'open'] as const;
</script>

<template>
  <section class="features bleed bleed-soft">
    <div class="container">
      <div class="feat-grid">
        <article v-for="(key, i) in items" :key="key" class="feat" v-reveal="{ delay: i * 90 }">
          <span class="feat-num" aria-hidden="true">0{{ i + 1 }}</span>
          <h3 class="feat-title">{{ $t(`features.${key}.title`) }}</h3>
          <p class="feat-body">{{ $t(`features.${key}.body`) }}</p>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.features { padding-block: clamp(3rem, 7vw, 5rem); }
.feat-grid {
  display: grid;
  gap: clamp(1.25rem, 3vw, 2.5rem);
  grid-template-columns: 1fr;
}
@media (min-width: 760px) { .feat-grid { grid-template-columns: repeat(3, 1fr); } }
.feat {
  padding-top: 0.75rem;
  border-top: 2px solid var(--ink);
}
.feat-num {
  font-family: var(--font-title);
  font-size: 0.95rem;
  color: var(--accent);
  display: block;
  margin-bottom: 0.5rem;
}
.feat-title {
  font-family: var(--font-title);
  font-size: clamp(1.3rem, 2.5vw, 1.7rem);
  margin: 0 0 0.5rem;
  color: var(--ink);
}
.feat-body { color: var(--muted); margin: 0; max-width: 36ch; font-size: 0.95rem; }
</style>
