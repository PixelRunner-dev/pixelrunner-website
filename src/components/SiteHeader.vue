<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';
import { RouterLink, useRoute } from 'vue-router';

import { availableLanguages, i18next, setLanguage } from '@/i18n';

const route = useRoute();
const open = ref(false);
const scrolled = ref(false);

function close() { open.value = false; }
function toggle() { open.value = !open.value; }
function onLang(e: Event) {
  void setLanguage((e.target as HTMLSelectElement).value);
}

function onScroll() { scrolled.value = window.scrollY > 8; }

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
});
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll));
</script>

<template>
  <header class="site-header" :class="{ 'is-scrolled': scrolled }">
    <div class="container header-row">
      <RouterLink to="/" class="brand" data-test="brand-home" @click="close">
        <img src="/logo-symbol.svg" alt="" width="36" height="36" aria-hidden="true" />
        <span class="brand-text">{{ $t('footer.title') }}</span>
      </RouterLink>

      <button
        class="menu-toggle"
        type="button"
        :aria-expanded="open"
        aria-controls="primary-nav"
        :aria-label="$t('header.menuLabel')"
        @click="toggle"
      >
        <span class="bar" :class="{ 'bar-1': true, open }"></span>
        <span class="bar" :class="{ 'bar-2': true, open }"></span>
      </button>

      <nav
        id="primary-nav"
        class="nav"
        :class="{ open }"
        :aria-label="$t('header.navLabel')"
      >
        <a v-if="route.name === 'home'" href="#applets" class="nav-link" @click="close">
          {{ $t('header.applets') }}
        </a>
        <a v-if="route.name === 'home'" href="#gallery" class="nav-link" @click="close">
          {{ $t('header.gallery') }}
        </a>
        <a v-if="route.name === 'home'" href="#buy" class="nav-link" @click="close">
          {{ $t('header.buy') }}
        </a>
        <RouterLink v-else to="/" class="nav-link" @click="close">
          {{ $t('legal.back') }}
        </RouterLink>

        <label class="lang-pick">
          <span class="visually-hidden">{{ $t('footer.language') }}</span>
          <select
            :value="i18next.language"
            data-test="header-language-select"
            @change="onLang"
          >
            <option v-for="lang in availableLanguages" :key="lang" :value="lang">
              {{ lang.toUpperCase() }}
            </option>
          </select>
        </label>

        <a
          v-if="route.name === 'home'"
          href="#buy"
          class="btn btn-primary nav-cta"
          @click="close"
        >
          {{ $t('header.cta') }} <span class="btn-arrow" aria-hidden="true">→</span>
        </a>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.site-header {
  position: sticky;
  top: 0;
  z-index: 50;
  background: color-mix(in oklab, var(--bg) 75%, transparent);
  backdrop-filter: saturate(140%) blur(16px);
  -webkit-backdrop-filter: saturate(140%) blur(16px);
  border-bottom: 1px solid transparent;
  transition: border-color 0.25s ease, background 0.25s ease;
}
.site-header.is-scrolled {
  border-bottom-color: var(--border);
  background: color-mix(in oklab, var(--bg) 90%, transparent);
}
.header-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding-block: 0.85rem;
}
.brand {
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  color: var(--ink);
  font-family: var(--font-title);
  font-size: 1.15rem;
  letter-spacing: -0.01em;
}
.brand:hover { text-decoration: none; }
.brand img { width: 36px; height: 36px; }

.nav {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 1.25rem;
}
.nav-link {
  color: var(--ink);
  font-weight: 500;
  font-size: 0.95rem;
  position: relative;
}
.nav-link::after {
  content: '';
  position: absolute;
  left: 0; right: 0; bottom: -6px;
  height: 2px;
  background: var(--accent);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.25s ease;
}
.nav-link:hover { text-decoration: none; }
.nav-link:hover::after,
.nav-link:focus-visible::after { transform: scaleX(1); }

.lang-pick select {
  background: transparent;
  color: var(--ink);
  border: 2px solid var(--ink);
  border-radius: 0;
  padding: 0.3rem 0.6rem;
  font: inherit;
  font-family: var(--font-mono);
  font-size: 0.78rem;
  font-weight: 700;
  cursor: pointer;
  letter-spacing: 0.12em;
}

.nav-cta { padding: 0.55rem 1.05rem; font-size: 0.9rem; }

.menu-toggle {
  display: none;
  background: transparent;
  border: 1px solid var(--border);
  border-radius: 0;
  width: 40px; height: 40px;
  margin-left: auto;
  position: relative;
  cursor: pointer;
}
.bar {
  position: absolute;
  left: 25%; right: 25%;
  height: 2px;
  background: var(--ink);
  transition: transform 0.25s ease, top 0.25s ease;
}
.bar-1 { top: 35%; }
.bar-2 { top: 60%; }
.bar-1.open { top: 47%; transform: rotate(45deg); }
.bar-2.open { top: 47%; transform: rotate(-45deg); }

@media (max-width: 760px) {
  .menu-toggle { display: inline-block; }
  .nav {
    position: fixed;
    inset: 64px 0 0;
    flex-direction: column;
    align-items: stretch;
    gap: 0.5rem;
    background: var(--bg);
    padding: 1.5rem var(--gutter);
    transform: translateY(-12px);
    opacity: 0;
    pointer-events: none;
    transition: transform 0.25s ease, opacity 0.25s ease;
    border-bottom: 1px solid var(--border);
  }
  .nav.open {
    transform: none;
    opacity: 1;
    pointer-events: auto;
  }
  .nav-link {
    font-size: 1.4rem;
    padding-block: 0.65rem;
    font-family: var(--font-title);
    color: var(--ink);
  }
  .lang-pick { margin-top: 0.5rem; }
  .nav-cta { align-self: flex-start; margin-top: 0.5rem; }
}
</style>
