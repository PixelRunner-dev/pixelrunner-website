<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { applets, filterByTag, imageUrl, topTags } from '@/lib/applets';
import { motion, stagger } from '@/lib/anim';

const tabs = ['all', ...topTags(10)];
const active = ref<string>('all');
const route = useRoute();
const router = useRouter();
// Seed from ?q= — only strings. router.query values are typed unknown-string-or-null,
// and we bind via v-model to a text input (no HTML interpolation), so XSS-safe by construction.
const initialQ = typeof route.query.q === 'string' ? route.query.q : '';
const query = ref(initialQ);

watch(query, (value) => {
  const next = { ...route.query };
  const trimmed = value.trim();
  if (trimmed) next.q = trimmed;
  else delete next.q;
  // Anchor to the showcase: first keystroke scrolls here; subsequent ones share the hash
  // so scrollBehavior leaves the page where it is.
  router.replace({ query: next, hash: '#applets' });
});
const tabsEl = ref<HTMLElement | null>(null);
const indicator = ref({ left: 0, width: 0 });

const visible = computed(() => {
  const byTag = filterByTag(active.value, applets);
  const q = query.value.trim().toLowerCase();
  if (!q) return byTag;
  return byTag.filter((a) =>
    `${a.name} ${a.summary} ${a.author} ${a.tags.join(' ')}`
      .toLowerCase()
      .includes(q)
  );
});

function select(tag: string) { active.value = tag; }

function moveIndicator() {
  if (!tabsEl.value) return;
  const btn = tabsEl.value.querySelector<HTMLElement>(`[data-tag="${active.value}"]`);
  if (!btn) return;
  const parentRect = tabsEl.value.getBoundingClientRect();
  const r = btn.getBoundingClientRect();
  indicator.value = {
    left: r.left - parentRect.left,
    width: r.width
  };
}

watch(active, async () => {
  await nextTick();
  moveIndicator();
});

onMounted(async () => {
  await nextTick();
  moveIndicator();
  window.addEventListener('resize', moveIndicator);
});

// Stagger fade-in for visible cards when filter changes.
const grid = ref<HTMLElement | null>(null);
watch(visible, async () => {
  await nextTick();
  if (!grid.value) return;
  motion(grid.value.querySelectorAll('.applet'), {
    opacity: [0, 1],
    translateY: [12, 0],
    duration: 500,
    delay: stagger(25),
    easing: 'easeOutQuart'
  });
});
</script>

<template>
  <section id="applets" class="showcase">
    <div class="container">
      <div class="showcase-head">
        <div>
          <p class="eyebrow" v-reveal>{{ $t('applets.eyebrow') }}</p>
          <h2 class="section-title" v-reveal>{{ $t('applets.title') }}</h2>
          <p class="section-sub" v-reveal>{{ $t('applets.sub') }}</p>
        </div>
        <label class="search" v-reveal>
          <span class="visually-hidden">{{ $t('applets.searchLabel') }}</span>
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>
          </svg>
          <input
            v-model="query"
            type="search"
            :placeholder="$t('applets.searchPlaceholder')"
            data-test="applet-search"
          />
        </label>
      </div>

      <div ref="tabsEl" class="tabs" role="tablist" :aria-label="$t('applets.categoriesLabel')">
        <span
          class="tab-indicator"
          aria-hidden="true"
          :style="{ transform: `translateX(${indicator.left}px)`, width: indicator.width + 'px' }"
        ></span>
        <button
          v-for="tag in tabs"
          :key="tag"
          class="tab"
          :class="{ 'tab-active': active === tag }"
          role="tab"
          :aria-selected="active === tag"
          :data-tag="tag"
          @click="select(tag)"
        >
          {{ tag === 'all' ? $t('applets.all') : tag }}
        </button>
      </div>

      <div ref="grid" class="grid" data-test="applet-grid" v-reveal="{ stagger: 30 }">
        <article v-for="applet in visible" :key="applet.packageName" class="card applet">
          <div class="thumb component--applet-image">
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
          <div class="meta">
            <h3 class="applet-name">{{ applet.name }}</h3>
            <p class="applet-desc">{{ applet.summary }}</p>
            <p class="applet-author">{{ applet.author }}</p>
          </div>
        </article>
        <aside v-if="visible.length" class="more-applets">
          {{ $t('applets.more') }}
        </aside>
        <p v-if="!visible.length" class="empty">{{ $t('applets.empty') }}</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.showcase-head {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.25rem;
  align-items: end;
  margin-bottom: 1.5rem;
}
@media (min-width: 780px) {
  .showcase-head {
    grid-template-columns: 1fr auto;
    gap: 2rem;
  }
}
.search {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: var(--surface);
  border: 2px solid var(--ink);
  border-radius: 0;
  padding: 0.5rem 0.85rem;
  color: var(--muted);
  box-shadow: 4px 4px 0 0 var(--ink);
  transition: box-shadow 0.12s steps(3, end), transform 0.12s steps(3, end);
}
.search:focus-within {
  transform: translate(-2px, -2px);
  box-shadow: 6px 6px 0 0 var(--accent);
  border-color: var(--accent);
}
.search input {
  border: 0;
  background: transparent;
  font: inherit;
  font-family: var(--font-mono);
  font-size: 0.9rem;
  color: var(--ink);
  min-width: 220px;
  outline: none;
}

.tabs {
  position: relative;
  display: flex;
  flex-wrap: nowrap;
  gap: 0;
  margin: 1rem 0 1.75rem;
  padding: 4px;
  background: var(--surface);
  border: 2px solid var(--ink);
  border-radius: 0;
  box-shadow: 4px 4px 0 0 var(--ink);
  overflow-x: auto;
  scrollbar-width: none;
}
.tabs::-webkit-scrollbar { display: none; }
.tab {
  position: relative;
  z-index: 1;
  background: transparent;
  border: 0;
  color: var(--ink);
  border-radius: 0;
  padding: 0.55rem 1rem;
  font: inherit;
  font-family: var(--font-mono);
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  cursor: pointer;
  white-space: nowrap;
  transition: color 0.2s ease;
}
.tab:hover { color: var(--accent); }
.tab-active { color: var(--bg); }
.tab-indicator {
  position: absolute;
  top: 4px; bottom: 4px;
  left: 0;
  background: var(--ink);
  border-radius: 0;
  transition: transform 0.28s steps(8, end), width 0.28s steps(8, end);
  z-index: 0;
}

.grid {
  display: grid;
  gap: clamp(0.75rem, 1.5vw, 1.1rem);
  grid-template-columns: repeat(2, 1fr);
}
@media (min-width: 620px)  { .grid { grid-template-columns: repeat(3, 1fr); } }
@media (min-width: 920px)  { .grid { grid-template-columns: repeat(4, 1fr); } }
@media (min-width: 1240px) { .grid { grid-template-columns: repeat(5, 1fr); } }

.applet {
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.more-applets {
  display: grid;
  place-items: center;
  padding: 1.5rem;
  border: 2px dashed var(--ink);
  border-radius: 0;
  color: color-mix(in oklab, var(--muted) 72%, transparent);
  font-family: var(--font-title);
  font-size: clamp(1.1rem, 2vw, 1.6rem);
  text-align: center;
  background: transparent;
  grid-column: span 2;
}
@media (min-width: 620px) { .more-applets { grid-column: auto; } }

.empty {
  grid-column: 1 / -1;
  text-align: center;
  color: var(--muted);
  padding: 2rem 0;
}

.thumb {
  background: #000;
  display: grid;
  place-items: center;
  aspect-ratio: 2 / 1;
  overflow: hidden;
}
.applet-image {
  aspect-ratio: 2 / 1;
  image-rendering: pixelated;
  mask-image: url('/mask.png');
  -webkit-mask-image: url('/mask.png');
  mask-size: contain;
  -webkit-mask-size: contain;
  mask-repeat: no-repeat;
  -webkit-mask-repeat: no-repeat;
  mask-position: center;
  -webkit-mask-position: center;
  width: 100%;
  height: 100%;
  object-fit: contain;
  transition: transform 0.6s ease;
}
.applet:hover .applet-image { transform: scale(1.05); }
.applet-image.broken { visibility: hidden; }

.meta { padding: 0.85rem 1rem 1rem; }
.applet-name { font-size: 1rem; margin: 0 0 0.2rem; }
.applet-desc {
  color: var(--muted);
  font-size: 0.85rem;
  margin: 0 0 0.4rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.applet-author {
  color: var(--accent-2);
  font-size: 0.75rem;
  margin: 0;
}
</style>
