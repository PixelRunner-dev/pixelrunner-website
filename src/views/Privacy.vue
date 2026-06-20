<script setup lang="ts">
import { RouterLink } from 'vue-router';
</script>

<template>
  <main id="main" class="legal">
    <div class="container container-narrow">
      <RouterLink to="/" class="back">{{ $t('legal.back') }}</RouterLink>
      <p class="eyebrow">{{ $t('legal.eyebrow') }}</p>
      <h1 v-reveal data-test="privacy-title">{{ $t('privacy.title') }}</h1>
      <p class="updated">{{ $t('legal.updated', { date: '18 June 2026' }) }}</p>

      <!-- <section v-reveal>
        <h2>{{ $t('privacy.overviewTitle') }}</h2>
        <p>{{ $t('privacy.overview') }}</p>
      </section>

      <section v-reveal>
        <h2>{{ $t('privacy.websiteTitle') }}</h2>
        <p>{{ $t('privacy.website') }}</p>
      </section>

      <section v-reveal>
        <h2>{{ $t('privacy.dataTitle') }}</h2>
        <ul>
          <li>{{ $t('privacy.dataPrice') }}</li>
          <li>{{ $t('privacy.dataLang') }}</li>
          <li>{{ $t('privacy.dataNoCookies') }}</li>
        </ul>
      </section>

      <section v-reveal>
        <h2>{{ $t('privacy.deviceTitle') }}</h2>
        <p>{{ $t('privacy.device') }}</p>
      </section>

      <section v-reveal>
        <h2>{{ $t('privacy.rightsTitle') }}</h2>
        <p>{{ $t('privacy.rights') }}</p>
      </section>

      <section v-reveal>
        <h2>{{ $t('privacy.contactTitle') }}</h2>
        <p>{{ $t('privacy.contact') }}</p>
      </section>

      <p class="placeholder-note">{{ $t('legal.placeholder') }}</p> -->
    </div>
  </main>
</template>

<style scoped>
.legal {
  padding-block: clamp(3rem, 8vw, 6rem);
}
.legal h1 {
  font-family: var(--font-title);
  font-size: clamp(2.4rem, 6vw, 4rem);
  margin-bottom: 0.4rem;
  letter-spacing: -0.03em;
}
.legal h2 {
  margin-top: 2.5rem;
  margin-bottom: 0.6rem;
  color: var(--ink);
  font-family: var(--font-title);
  font-size: clamp(1.2rem, 2vw, 1.4rem);
}
.legal p,
.legal li {
  color: var(--muted);
}
.legal ul {
  padding-left: 1.25rem;
  margin: 0;
}
.legal ul li { margin-bottom: 0.4rem; }
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
