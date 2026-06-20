# Pixelrunner website — CLAUDE.md

One-page marketing site for the Pixelrunner LED matrix device.
Static Vue 3 + Vite SPA on GitHub Pages. Hash router. No backend.

## Stack

- Vue 3.5, Vite 8, TypeScript (strict via `@vue/tsconfig/tsconfig.dom.json`)
- vue-router 5 (hash history — GH Pages)
- i18next + i18next-vue (en, nl)
- animejs v4 (showcase animations)
- Vitest 4 + @vue/test-utils (unit)
- Playwright (e2e, chromium-only project)
- Node ^24

## Commands

```bash
npm install
npm run dev              # vite dev server
npm run type-check       # vue-tsc --build (run from website/)
npm run test:unit        # vitest run --coverage
npm run test:e2e         # playwright (builds + previews, then runs)
npm test                 # run-p unit + e2e
npm run build            # type-check + vite build
npm run enrich           # rebuild src/data/demo-apps.json fileName fields
```

E2E runs against `vite preview` on port 4173 (see `playwright.config.ts`).
Type-check / vitest must run with `cwd = website/`.

## Layout

```
website/
  index.html              SPA shell, <html lang> updated by main.ts
  vite.config.ts          base './', @ alias → ./src
  playwright.config.ts    chromium, webServer = vite build + preview
  public/
    fonts/cooper-black-std.woff
    logo-symbol.svg
    mask.png              LED-bezel mask for applet thumbnails
  translations/
    en.json, nl.json      flat key tree; en is source of truth
  src/
    main.ts               i18n init → mount; syncs <html lang>
    App.vue               skip-link + SiteHeader + RouterView + SiteFooter
    router.ts             /, /privacy, /terms (hash)
    style.css             global design system (see below)
    i18n.ts               lazy backend, localStorage 'lang' key
    directives/reveal.ts  v-reveal — animeJS-driven, supports
                            { delay, y, scale, stagger } binding
    lib/
      anim.ts             motion()/stagger wrappers, respects PRM
      price.ts            eurToSats, productPriceSats, fetchBtcEur,
                            formatSats — pure + fetch split
      applets.ts          imageUrl, tagCounts, topTags, filterByTag
      shops.ts            mocked reseller list (placeholders)
    data/demo-apps.json   85 applets w/ fileName field
    views/                Home, Privacy, Terms
    components/
      SiteHeader.vue      sticky glass nav, burger menu, lang switcher
      HeroSection.vue     animated split-word title + floating LED cluster
      PriceBadge.vue      full-width retro price band + big pixel CTA
      FeatureStrip.vue    3-up benefit row
      AppletShowcase.vue  search + tabs + animated indicator + grid
      ProductGallery.vue  broken 12-col grid + cursor-tilt parallax
      BuyLinks.vue        dark band w/ reseller cards
      SiteFooter.vue      dark band, GDPR one-liner, lang select
  test/
    unit/                 vitest specs
    e2e/                  playwright specs
  scripts/add-filenames.mjs  re-runnable applet manifest enrichment
```

Home page order: Hero → PriceBadge → FeatureStrip → AppletShowcase →
ProductGallery → BuyLinks. SiteFooter is rendered globally in App.vue.

## Design system (style.css)

**Colors — preserved from original:**
- `--bg`, `--bg-soft`, `--surface`, `--border`, `--text`, `--muted`
- `--accent` (oklch red/brown), `--accent-2` (oklch orange), `--accent-text`
- `--ink` (#2a1605 = darkest brown), `--bg-warm`, `--bg-deep`

**Type:**
- `--font-title` = Cooper Std Black (titles only)
- `--font-body` = Inter / system
- `--font-mono` = JetBrains Mono / Plex / SF Mono — used for chips, labels,
  the price-band sats number, tab labels, lang select. Do not use Cooper
  for numeric readouts.

**Pixel aesthetics:**
- `--radius-s/--radius/--radius-l` all = `0` (square corners everywhere)
- `--shadow-1/--shadow-2` are hard-offset pixel shadows, NO soft blur
- Buttons + cards animate with `transition: ... steps(3, end)` for a
  chunky click feel; reduced-motion disables.
- Body background is a 16px dot grid + 48px pixel-checker.
- `.eyebrow` is mono caps with a square `::before` dash.
- `.pixel-divider` utility for chunky dashed band separators.

**Bleed bands:** `.bleed-soft`, `.bleed-warm`, `.bleed-dark` apply
full-width section backgrounds with dark-mode text overrides.

**Accessibility primitives:**
- `.skip-link` (first focusable element, slides in on focus)
- `.visually-hidden` for SR-only text
- `:focus-visible` shows 3px accent outline, offset 2px
- `prefers-reduced-motion`: all anims clamp to 0.001ms, `.reveal` snaps
  to visible — set globally + per-component for any custom keyframes
- Skip link target is `#main` (Home, Privacy, Terms each render
  `<main id="main">`)

## Animations (animeJS v4)

Use `motion()` from `@/lib/anim` instead of importing `animate` directly
— it no-ops when `prefers-reduced-motion: reduce` is set. `stagger`
re-exports from animejs unchanged. v4 API: `import { animate, stagger }
from 'animejs'`; v4 uses `onUpdate` (not `update`), `delay: stagger(...)`,
no global `anime()` default export.

`v-reveal` directive scrolls elements in via IntersectionObserver, then
runs `motion()`. Accepts `{ delay?, y?, scale?, stagger? }`. When
`stagger` is set, animates direct children with that ms gap.

Per-component anims:
- HeroSection: word-by-word title entrance + floating LED-thumb cluster
- PriceBadge: animeJS counter for sats refresh (skip first/PRM);
  CSS-only pixelPulse / walkPixel / glint-sweep on CTA
- AppletShowcase: animated tab indicator (CSS `steps()`), stagger
  fade-in on filter change, count-clamped reveal on grid
- ProductGallery: cursor-tilt parallax + stagger reveal

## i18n

- `en.json` is source of truth; `i18n` unit test enforces key parity.
- `availableLanguages` in `i18n.ts`. Add a language: drop
  `translations/<code>.json` + one loader line.
- Switcher persists to `localStorage['lang']`. `main.ts` keeps
  `document.documentElement.lang` in sync with i18next — WCAG 3.1.1.
- Both header and footer have a `<select>` switcher. Footer uses
  `data-test="language-select"` (canonical), header uses
  `data-test="header-language-select"`.

Skip-translation policy: stat-card values like `1000+`, `64 × 32` and
`—` may be translated per locale (see hero.statApplets.title etc.).

## Tests

Unit tests stub `$t` as `(k) => k` and stub `v-reveal` as `{}`. When
mounting components that read i18n, pass:
`{ global: { directives: { reveal: {} }, mocks: { $t: (k) => k } } }`.

PriceBadge tests: `fetchBtcEur` is mocked via `vi.hoisted(vi.fn())` +
`vi.mock('@/lib/price', ...)`. Fake timers are used; the watch on
`targetSats` is intentionally a no-op on the first set (prev null) so the
text lands synchronously after `await flushPromises()`.

E2E test ids (data-test):
- `price-badge`, `sats` — inside PriceBadge band
- `hero-cta-buy` — primary CTA inside PriceBadge (NOT in Hero)
- `applet-grid`, `applet-search`
- `language-select` (footer), `header-language-select` (header)
- `docs-link`, `privacy-link`, `terms-link`, `brand-home`

Coverage: e2e mocks `**/api/v1/prices` to `{ EUR: 55815 }` — deterministic
sats text is `376 300` (Math.round(210 / 55815 * 1e8) → ceil to next 100).

## Price logic

- Anchor: `PRICE_EUR = 210`.
- `eurToSats` rounds to nearest sat; `productPriceSats` ceils to the next
  100 sats; `formatSats` groups with spaces (en-US locale then comma→space).
- `fetchBtcEur` hits `https://mempool.space/api/v1/prices`, reads `.EUR`.
- PriceBadge refreshes every 60 s; aborts the previous request; on
  failure keeps €210 + `—` + `.price-stale` notice, no console error.

## Applet thumbnails

- CDN: `https://applets.pixelrunner.dev/$packageName.webp` (current
  `imageUrl()` shape — `fileName` lives on the data but isn't currently
  used in the URL builder).
- LED mask: `public/mask.png` is applied via `mask-image` to give the
  bezel look. `image-rendering: pixelated` keeps the LED look crisp.
- 404s are expected today (CDN not populated); broken `<img>` adds
  `.broken` class and hides itself.

## GDPR

- No cookies, no analytics, no fingerprinting. Single piece of state:
  `localStorage['lang']` (strictly functional under ePrivacy).
- Live BTC price requests to mempool.space disclose IP — documented in
  Privacy view (`privacy.dataPrice`).
- Privacy view lists data inventory, GDPR rights, contact route.
- Footer carries a one-line GDPR notice (`footer.gdpr`).
- Do NOT add tracking pixels, GA, Plausible, etc. without re-doing the
  Privacy view and adding a real consent UI.

## WCAG

Targeting WCAG 2.2 AA. Required when changing UI:
- Keep `:focus-visible` ring intact
- Keep `prefers-reduced-motion` guards on any new keyframe / animeJS
- Maintain colour-contrast on dark bleed bands (avoid `--muted` on
  dark backgrounds — use `oklch(78% 0.04 70)` instead)
- All non-decorative images need `alt`; decorative ones get `aria-hidden`
- Skip link must remain the first focusable element on every route

## Conventions

- All new features ship with tests (project rule — `CLAUDE.md` root).
- Prefer editing existing components over adding new ones.
- Don't add new deps for things stdlib / current deps can do.
- TypeScript: replace `any` with `unknown`; don't disable eslint.
- Component data-test attributes: kebab-case scoped to behavior.
- Translations: add the key to en.json first, then add the same key to
  every other locale (unit test enforces parity).

## Out of scope / placeholder

- Real product photos (public/ has nothing yet; ProductGallery shows
  labelled tile placeholders).
- Reseller URLs in `lib/shops.ts` are example.com stubs.
- Documentation site URL `https://docs.pixelrunner.dev` is a placeholder.
- No checkout flow — CTAs anchor to `#buy` on the reseller band.
