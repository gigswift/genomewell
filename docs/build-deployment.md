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

## Behavioral tracking & Google Ads attribution

The app implements first-party behavioral tracking and Google Ads conversion reporting under the "Option C" privacy posture: DNA stays on device (unchanged), but click/page events, session IDs, and `gclid` values are logged server-side and reported to Google Ads.

**Privacy invariant (must hold across all future changes):** DNA bytes, genotypes, rsids, and SNPResult arrays NEVER appear in any tracking payload. The `TrackPayload` type in `src/lib/tracking.ts` is closed to a fixed shape; `api/track.ts` drops unknown fields. No third-party analytics SDKs (Mixpanel/Segment/Amplitude/Heap/Plausible/Hotjar/FullStory/Facebook Pixel/TikTok Pixel) are loaded.

### `/api/track` endpoint

Vercel serverless function at `api/track.ts`. Accepts POST only (non-POST → 405). Fire-and-forget from the client: errors are swallowed, navigation is never blocked.

**Request body (JSON):**

```ts
{
  event: 'affiliate_click' | 'file_parsed' | 'page_view',
  partner?: string,         // brand slug, e.g. 'now-foods' (affiliate_click only)
  supplementId?: string,    // supplement display name (affiliate_click only)
  sessionId: string,        // UUID v4 from cw_session cookie
  gclid?: string,           // from cw_gclid cookie if present
  timestamp: string,        // ISO 8601
  page: string              // window.location.pathname
}
```

Unknown event names are rejected with 400. All strings are truncated server-side at 256 chars. The server logs a single-line JSON record (`type: 'track'`) plus user-agent and referer to stdout.

### Cookies

| Name | Lifetime | Purpose |
| --- | --- | --- |
| `cw_session` | 30 days | UUID v4 per browser. Set on first page load if missing. SameSite=Lax, first-party, path=/. |
| `cw_gclid`   | 90 days | Captured from `?gclid=` query string on landing. Used to attribute downstream affiliate clicks back to the Google Ads click that drove the visit. SameSite=Lax, first-party, path=/. |

Both are set by `src/lib/tracking.ts` via `initTracking()`, called from `src/main.tsx` at app bootstrap.

### Google Ads (gtag.js)

`initTracking()` injects `https://www.googletagmanager.com/gtag/js?id=${VITE_GOOGLE_ADS_ID}` once at boot when `VITE_GOOGLE_ADS_ID` is set. There are **three distinct conversion events**, each mapped to its own Google Ads Conversion Action / label by `fireGoogleAdsConversion(event)` in `src/lib/tracking.ts`:

| Event | Fires when | Wired in | Label env var |
| --- | --- | --- | --- |
| `page_view` | App bootstrap — exactly once per page load | `track({ event: 'page_view' })` at the end of `initTracking()` in `src/lib/tracking.ts` | `VITE_GOOGLE_ADS_LABEL_PAGE_VIEW` |
| `affiliate_click` | A "Shop" button on a supplement card is clicked | `track({ event: 'affiliate_click', ... })` in `src/components/SupplementCard.tsx` (`BrandRow.openProduct`) | `VITE_GOOGLE_ADS_LABEL_AFFILIATE_CLICK` |
| `file_parsed` | A 23andMe/AncestryDNA file is parsed successfully (valid file, SNPs extracted) | `track({ event: 'file_parsed' })` at the parse-success line in `src/App.tsx` (`handleFile`), right after `setParseState('done')` | `VITE_GOOGLE_ADS_LABEL_FILE_PARSED` |

Each event fires:

```js
gtag('event', 'conversion', { send_to: `${VITE_GOOGLE_ADS_ID}/<label for this event>` })
```

`file_parsed` is guarded by a module-level session flag in `tracking.ts` so it fires at most once per loaded page — the parse-success codepath running twice (e.g. a remount) will not double-count the conversion. A full reload resets the flag. `file_parsed` fires only on a **successful** parse, never on parse failure and never merely on file selection.

`page_view` fires exactly once per page load via the `bootstrapped` re-entry guard in `initTracking()` (no separate dedup flag needed — `initTracking()` short-circuits on the second call within the same loaded page). A full reload starts a fresh page and fires it again.

If `VITE_GOOGLE_ADS_ID` or the label for a given event is unset, that event's gtag conversion is skipped silently and the `/api/track` POST still fires.

**Env vars (Vercel project settings — `VITE_` prefix so Vite inlines them at build time):**
- `VITE_GOOGLE_ADS_ID` — AdWords account conversion ID (e.g. `AW-1234567890`).
- `VITE_GOOGLE_ADS_LABEL_AFFILIATE_CLICK` — Conversion label for the affiliate-click conversion event.
- `VITE_GOOGLE_ADS_LABEL_FILE_PARSED` — Conversion label for the file-parsed conversion event.
- `VITE_GOOGLE_ADS_LABEL_PAGE_VIEW` — Conversion label for the page-view conversion event.

### Querying events

In the Vercel dashboard → Project → Logs (Runtime Logs), filter by function `api/track` or grep for `"type":"track"`. Each event is a single JSON line.

### Verifying the Google Ads conversion is firing

1. Install the Chrome extension **Tag Assistant Companion** (or use **Tag Assistant** at tagassistant.google.com).
2. Open the deployed site and accept the gtag tags. On initial load, a `conversion` event for the `page_view` label should fire once. Upload a valid DNA file (or use the demo file) — on a successful parse, a `conversion` event for the `file_parsed` label should fire once. Then click any "Shop" button on a supplement card to fire the `affiliate_click` label.
3. Tag Assistant should show a `conversion` event for the configured `AW-…/<label>` send_to (one per event, with the matching label). In the Network tab, you can also confirm a request to `https://www.google.com/pagead/conversion/...` fires alongside each `/api/track` POST.
4. The new tab to the partner URL must still open normally — tracking is fire-and-forget and never blocks navigation.
