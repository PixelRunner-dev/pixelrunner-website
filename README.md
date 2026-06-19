# The Pixelrunner website (https://pixelrunner.dev)

One-page marketing site for the Pixelrunner device. Vue 3 + Vite + TypeScript,
deployable as a static hash-routed SPA (GitHub Pages).

## Commands

```bash
npm install
npm run dev          # local dev server
npm run enrich       # rebuild src/data/demo-apps.json fileName fields from applet manifests
npm run type-check
npm run test:unit    # Vitest
npm run test:e2e     # Playwright (builds + previews, then runs)
npm run build
```

## Languages (i18next)

All copy lives in `translations/<code>.json`; `en.json` is the source of truth.
`src/i18n.ts` bundles `en` and lazy-loads the rest, detecting the language from
`localStorage` → browser → `en`. The footer has a switcher.

Add a language: drop `translations/<code>.json` (same keys as `en.json`) and add
one loader line in `src/i18n.ts`. The `i18n` unit test fails if keys drift.

## Notes

- Price: €210 anchor, shown live in sats via `mempool.space` (`src/lib/price.ts`).
- Applet previews: `applets.pixelrunner.dev/$packageName/$fileName.webp`
  (`src/lib/applets.ts`). `fileName` comes from each applet manifest via
  `scripts/add-filenames.mjs`.
- Placeholders: product photos (`public/`), reseller URLs (`src/lib/shops.ts`),
  and the docs link are stubs to be filled in before launch.
