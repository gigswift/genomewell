# Build & Deployment Notes

## Stack
- **Frontend:** React + TypeScript (Vite)
- **Styling:** Tailwind CSS
- **File parsing:** JSZip (zip files) + browser File API (text)
- **AI narrative (optional):** Anthropic Claude API
- **Hosting:** Vercel
- **Repo:** https://github.com/gigswift/genomewell

## Live URL
- Stable alias: https://genomewell.vercel.app
- Last deployment: https://genomewell-8s119emmv-rashadbartholomew-5285s-projects.vercel.app (2026-04-18)

## Local development
```bash
cd ~/genomewell
npm install
npm run dev      # http://localhost:5173
npm run build
```

## Deployment
```bash
cd ~/genomewell      # always deploy from the canonical repo, not a worktree
vercel --prod --yes
```

## Known build constraints
- `.npmrc` contains `legacy-peer-deps=true` to resolve ESLint 9 vs `eslint-plugin-react-dom` peer conflict on Vercel builds.
- **Do not deploy from a `.cline/worktrees/...` checkout.** Worktrees use symlinks for `node_modules`, `dist`, and `.vercel`, which Vercel's uploader silently truncates (only metadata gets shipped, then the remote `vercel build` fails with `ENOENT mkdir '/vercel/path0/dist'`). Always `cd ~/genomewell` before running `vercel`. (Incident: 2026-04-18.)

## Parallel Kanban task drift (incident, 2026-04-13 — resolved 2026-04-17)
During initial scaffold, parallel Kanban tasks each invented their own type schemas and SNP catalogs:

- **Active path (kept)** — `src/types.ts` (`riskLevel`, `fitnessProtocols`), `src/snpCatalog.ts` (31 SNPs), `src/services/*`
- **Orphan path (deleted 2026-04-17)** — `src/types/index.ts` (`risk`, `fitnessProtocol`), `src/engine/snpRules.ts` (17 SNPs), `src/engine/*`, `src/api/claude.ts`

Cleanup landed 2026-04-17: orphan files and their directories (`src/api/`, `src/engine/`, `src/types/`) were removed; `npm run build` passed clean with no active-path changes required.

**Lesson captured in Claude memory:** parallel Kanban tasks require a final reconciliation task; type contracts alone don't prevent drift.

## Vercel project
- Account: `rashadbartholomew-5285`
- Env var to set when activating Claude narrative: `VITE_ANTHROPIC_API_KEY`
- Currently unset — app uses deterministic fallback narrative, which is the preferred default (see `product-strategy.md`)

### Feedback form (`/api/feedback`)

The dashboard and landing headers expose a Feedback button that POSTs to `/api/feedback` (Vercel serverless function at `api/feedback.ts`). The function forwards submissions to `hello@chronicwellness.ai` via the Resend HTTP API.

**Required env var (Vercel project settings, no `VITE_` prefix):**
- `RESEND_API_KEY` — server-only secret. Do **not** prefix with `VITE_` (would expose it in the browser bundle).

**Deploy blocker — domain verification:** the function sends `from: hello@chronicwellness.ai`. Resend requires `chronicwellness.ai` to be verified as a sending domain (SPF/DKIM records added to DNS) before sends will succeed. Verify in the Resend dashboard before the first deploy or sends will return 403.

**Privacy copy** lives in `docs/privacy.md` as source-of-truth and is mirrored as hand-rendered JSX in `src/components/PrivacyModal.tsx`. When updating the privacy story, edit both files.

## Affiliate links

No affiliate env vars needed. All product URLs in `docs/catalogue/herbspro_products.csv` are pre-tagged Rakuten LinkShare deeplinks (`click.linksynergy.com/...&id=lDiltZ8gZ2U`) for the merchant HerbsPro. `src/lib/affiliateLinks.ts` is a passthrough — `BrandOption.productUrl` is what the user clicks.

The user-facing concept is **brand**, not partner. The card renders one "Shop at \<Brand\>" button per brand, max ~4 per supplement card. Adding a new brand: append the slug to the `Brand` union in `src/types.ts`, add the display name to `BRAND_DISPLAY_NAMES` in `src/lib/affiliateLinks.ts`, and add a `GW_BRAND_META` entry in `src/components/ui.tsx`.

### Refreshing prices
The catalog CSV stores brand + URL but not prices; prices are scraped from each HerbsPro product page's `og:price:amount` meta tag and baked into `src/engine/supplementRules.ts` as static `priceDisplay` strings. To refresh:

```bash
node docs/catalogue/.refresh-prices.mjs
# Inspect docs/catalogue/.herbspro_enriched.json, then update the priceDisplay
# fields in src/engine/supplementRules.ts.
```

The script is rate-limited to ~1 req/sec, takes ~80 seconds for the current 70-row catalog, and has no npm dependencies (uses Node 18 built-in fetch).

### Commission rate
Commission structure TBD pending Rakuten LinkShare partner confirmation — the prior tiered direct-program model (see `parking-lot.md` for historical detail) is obsolete; see `commerce-practitioner.md` for the current strategy.
