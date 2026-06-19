# Pixelrunner one-page marketing site

## Context

`website/` today holds only `demo-apps.json` (85 applet entries) + a stub README.
We need a single-page marketing site to sell the Pixelrunner device for **€210,
payable only in sats**, with a live BTC price conversion, product photos, an
applet showcase grouped by tag, mocked webshop links, a documentation link, and
separate Privacy Policy + Terms pages. Product photos/screenshots are provided
later (placeholders for now). Stack matches `admin-vue` (Vue 3.5 + Vite 8 + TS),
deployable to GitHub Pages.

## Decisions (confirmed)

- **fileName**: add a `fileName` field to every `demo-apps.json` entry. Image URL
  = `https://applets.pixelrunner.dev/$packageName/$fileName.webp`. CDN currently
  404s — user owns that infra; we just build correct URLs.
- **Stack**: Vue 3.5 + Vite 8 + TypeScript + vue-router (hash mode for GH Pages).
- **Showcase**: all 85 applets, grouped/filterable by `tags` (29 tags, long tail).
- **Price**: €210 fixed anchor; live sats equivalent via mempool.space.

## fileName enrichment

One-off script `website/scripts/add-filenames.mjs` (Node, re-runnable) reads each
applet's manifest under `applets/vendor/tronbyt/apps/<packageName>/manifest.yaml`
and writes `fileName` into `website/src/data/demo-apps.json`. Resolution per entry:

1. manifest `fileName:` value with trailing `.star` stripped (e.g.
   `wrigley_clock.star` → `wrigley_clock`) — covers 77/85.
2. else the lone `*.star` basename in the app dir (covers `dryer`, `doorbell`,
   `lastfmnow`, `motogp`, `weather`, `pihole`).
3. else `packageName` as fallback, and **log a warning** — only
   `tagesschau_news` (dir `tagesschau-news`) and `gitlabpipeline` (dir
   `gitlabpipelinestatus`) hit this; user verifies those 2 against the CDN later.

Keep the script committed so it can re-run when the applet catalog changes.
Move `demo-apps.json` to `website/src/data/demo-apps.json` (imported by the app).

## Site structure

```
website/
  index.html
  package.json            # vue, vue-router, vite, typescript, vitest
  vite.config.ts          # base: '/'  (set repo base if project-pages)
  tsconfig.json / tsconfig.node.json
  scripts/add-filenames.mjs
  public/                 # placeholder hero/gallery images (real ones later)
  src/
    main.ts               # createApp + router (hash history)
    App.vue               # <RouterView/>
    router.ts             # / , /privacy , /terms
    data/demo-apps.json   # enriched with fileName
    lib/
      price.ts            # eurToSats(), fetchBtcEur()  (pure + fetch split)
      applets.ts          # load entries, imageUrl(), groupByTag()
      price.test.ts
      applets.test.ts
    views/
      Home.vue            # the one page (sections below)
      Privacy.vue
      Terms.vue
    components/
      HeroSection.vue
      PriceBadge.vue      # €210 anchor + live sats
      ProductGallery.vue  # photos + screenshots (placeholders)
      AppletShowcase.vue  # tag tabs + grid of webp images
      BuyLinks.vue        # mocked webshop list
      SiteFooter.vue      # privacy / terms (router) + docs (external)
```

### Home sections (top → bottom)
1. **Hero** — name, tagline, hero photo placeholder, CTA "Get yours — €210, paid in sats".
2. **PriceBadge** — €210 anchor + live sats (see price logic), "Bitcoin only".
3. **ProductGallery** — responsive grid of photo/screenshot placeholders.
4. **AppletShowcase** — tag filter tabs (top ~10 tags + "All"), lazy-loaded
   `<img loading="lazy">` from `imageUrl(entry)`, name/desc/author on hover/caption.
5. **BuyLinks** — mocked shops (e.g. "Bitcoin Store NL", "Sats Shop EU", "21 Hardware")
   as outbound links with `rel="noopener"`; clearly placeholder.
6. **SiteFooter** — RouterLinks to `/privacy`, `/terms`; external Documentation
   link (placeholder `https://docs.pixelrunner.dev`, "coming soon").

## Price logic (`lib/price.ts`)

- `fetchBtcEur()` → `GET https://mempool.space/api/v1/prices`, read `.EUR`.
- `eurToSats(eur, btcEur)` → `Math.round(eur / btcEur * 1e8)` (pure, tested).
- `PriceBadge.vue`: fetch on mount, refresh every 60s, format sats with
  thousands separators. On fetch failure keep €210 visible, show "—" for sats +
  silent retry. ~376,000 sats at current rate.

## Animations (light, no heavy libs)

- Scroll-reveal via `IntersectionObserver` (small `v-reveal` directive) — fade +
  translateY on section enter.
- CSS hover lift on cards/CTA, staggered fade-in on showcase grid.
- `prefers-reduced-motion` disables transitions.
- No animation dependency added (native APIs only).

## Testing (required for new project per CLAUDE.md)

Match `admin-vue` deps + script layout: `vitest@^4`, `@vitest/coverage-v8`,
`@vue/test-utils`, `@playwright/test@^1.60`, `eslint-plugin-playwright`.

```jsonc
// package.json scripts (mirror admin-vue)
"test":           "run-p test:unit test:e2e",
"test:unit":      "vitest run --coverage",
"test:unit:ci":   "vitest run --coverage --no-color --reporter dot",
"test:unit:watch":"vitest watch --coverage --ui",
"test:e2e":       "playwright test",
"test:e2e:ci":    "playwright test --quiet --reporter dot",
"test:e2e:watch": "playwright test --ui"
```

### Unit (Vitest)
- `lib/price.test.ts`: `eurToSats` rounding + edge (zero/NaN/negative BTC price
  guarded); `fetchBtcEur()` parses `.EUR` from a mocked `fetch` response and
  throws on non-200 / missing field.
- `lib/applets.test.ts`: `imageUrl()` builds `…/$packageName/$fileName.webp`;
  `groupByTag()` buckets entries, handles multi-tag membership, "All" bucket.
- Component (`@vue/test-utils`): `PriceBadge` renders €210 + formatted sats from
  injected price, shows "—" on fetch failure; `AppletShowcase` filters grid when
  a tag tab is selected.

### E2E (Playwright)
- `playwright.config.ts`: `webServer` runs `npm run dev` (or `vite preview` after
  build), `baseURL` to that port, chromium project (add webkit/firefox if cheap).
- `e2e/home.spec.ts`: page loads; hero CTA visible; PriceBadge shows €210 and a
  non-empty sats figure (stub `**/api/v1/prices` via `page.route` for
  determinism); applet `<img>` `src` matches the CDN URL pattern.
- `e2e/showcase.spec.ts`: clicking a tag tab filters the visible applet cards.
- `e2e/routing.spec.ts`: footer links navigate to `/privacy` and `/terms` as
  separate pages; browser back returns home; documentation link `href` = docs URL.
- `e2e/price-failure.spec.ts`: route `**/api/v1/prices` → abort; €210 stays, sats
  shows "—", no console error / crash.

## Verification

1. `cd website && npm install`
2. `node scripts/add-filenames.mjs` → confirm every entry has `fileName`, review
   the 2 flagged warnings.
3. `npm run dev` → open site:
   - PriceBadge shows €210 + a live sats number that refreshes.
   - Showcase tag tabs filter; applet images request the correct CDN URLs
     (Network tab — they 404 until CDN is populated, URLs must be right).
   - `/privacy` and `/terms` render as separate pages; nav back works.
   - Footer documentation link points to the placeholder docs URL.
   - Throttle/offline → €210 stays, sats shows "—", no crash.
4. `npm run build` succeeds. `npx playwright install` once, then `npm test`
   (`run-p test:unit test:e2e`) green — or `test:unit` / `test:e2e` separately.
5. (later) Drop real photos into `public/`, populate the CDN, re-verify images.

## Out of scope / later

- Real product photos + screenshots (placeholders now).
- Real webshop URLs (mocked).
- Documentation content (link only).
- Actual sats checkout/payment flow (CTA links to buy list for now).
