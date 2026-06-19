<script setup lang="ts">
import { RouterLink } from 'vue-router';

import { availableLanguages, i18next, setLanguage } from '@/i18n';

// ponytail: docs site not built yet — placeholder URL.
const DOCS_URL = 'https://docs.pixelrunner.dev';

function onLanguageChange(event: Event) {
  void setLanguage((event.target as HTMLSelectElement).value);
}

const year = new Date().getFullYear();
</script>

<template>
  <footer class="footer bleed bleed-dark">
    <div class="container footer-inner">
      <div class="footer-top">
        <div class="brand">
          <img src="/logo-symbol.svg" alt="" width="44" height="44" aria-hidden="true" />
          <div>
            <strong class="brand-title">{{ $t('footer.title') }}</strong>
            <span class="tagline">{{ $t('footer.tagline') }}</span>
          </div>
        </div>

        <nav class="links" :aria-label="$t('footer.navLabel')">
          <a :href="DOCS_URL" target="_blank" rel="noopener noreferrer" data-test="docs-link">
            {{ $t('footer.documentation') }} <span aria-hidden="true">↗</span>
          </a>
          <RouterLink to="/privacy" data-test="privacy-link">{{ $t('footer.privacy') }}</RouterLink>
          <RouterLink to="/terms" data-test="terms-link">{{ $t('footer.terms') }}</RouterLink>
        </nav>

        <label class="lang">
          <span class="visually-hidden">{{ $t('footer.language') }}</span>
          <select
            :value="i18next.language"
            data-test="language-select"
            @change="onLanguageChange"
          >
            <option v-for="lang in availableLanguages" :key="lang" :value="lang">
              {{ lang.toUpperCase() }}
            </option>
          </select>
        </label>
      </div>

      <div class="footer-bottom">
        <p>© {{ year }} {{ $t('footer.title') }}.</p>
        <p class="legal-line">{{ $t('footer.gdpr') }}</p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  padding-block: clamp(2.5rem, 6vw, 4rem);
  margin-top: 0;
}
.footer-inner { display: flex; flex-direction: column; gap: 2rem; }
.footer-top {
  display: grid;
  gap: 1.5rem;
  align-items: start;
  grid-template-columns: 1fr;
}
@media (min-width: 760px) {
  .footer-top { grid-template-columns: 1.2fr 1fr auto; align-items: center; }
}
.brand { display: flex; align-items: center; gap: 0.85rem; }
.brand-title {
  display: block;
  font-family: var(--font-title);
  font-size: 1.4rem;
}
.tagline {
  display: block;
  color: oklch(78% 0.04 70);
  font-size: 0.85rem;
}
.links {
  display: flex;
  flex-wrap: wrap;
  gap: 1.25rem;
  align-items: center;
}
.links a {
  color: oklch(85% 0.03 70);
  font-weight: 500;
  font-size: 0.95rem;
}
.links a:hover { color: var(--accent-2); }
.lang select {
  background: transparent;
  color: inherit;
  border: 2px solid color-mix(in oklab, #ffffff 60%, transparent);
  border-radius: 0;
  padding: 0.4rem 0.7rem;
  font: inherit;
  font-family: var(--font-mono);
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  cursor: pointer;
}
.footer-bottom {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1.5rem;
  justify-content: space-between;
  padding-top: 1.5rem;
  border-top: 1px solid color-mix(in oklab, #ffffff 18%, transparent);
  color: oklch(78% 0.04 70);
  font-size: 0.82rem;
}
.footer-bottom p { margin: 0; }
.legal-line { max-width: 60ch; }
</style>
