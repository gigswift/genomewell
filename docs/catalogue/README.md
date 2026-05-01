# Catalogue

`herbspro_products.csv` is the source-of-truth product list for v0 commerce. All rows are sold by **HerbsPro** (`herbspro.com`) and reach us via the **Rakuten LinkShare** affiliate network. URLs are pre-tagged with our affiliate ID (`id=lDiltZ8gZ2U`) — the runtime uses each URL verbatim, no env-var appending.

## Schema

| Column | Field | Notes |
|---|---|---|
| A | Product (supplement) | Maps to a supplement in `src/engine/supplementRules.ts` by name. |
| B | Brand | One of nine curated brands; the user-facing label on each "Shop at \<Brand\>" button. |
| C | Link | Either a full HTML `<a><img></a>` snippet (most rows) or a clean deeplink URL (DAO row). Both pre-tagged with our Rakuten ID. |

The clean-deeplink form (`https://click.linksynergy.com/deeplink?...&murl=<urlencoded>`) is what we'd ideally have for every row; the HTML-wrapped form needs `href` + `<IMG src>` extracted before use.

## Curated brand list

Source Naturals · Solgar · NOW Foods · Life Extension · Solaray · Jarrow Formulas · Bucked Up · PrimaForce · Nutricost.

Two brand-name normalizations live only in code, not in the CSV (the CSV is the raw HerbsPro feed):
- `Solary` (typo in feed) → `Solaray`.
- `essentials` (mislabel for the single Bucked Up creatine product, row 54) → `Bucked Up`.

## Refreshing prices

The CSV doesn't carry prices; prices are scraped from each HerbsPro product page's `<meta property="og:price:amount">` tag and baked into `src/engine/supplementRules.ts` as static `priceDisplay` strings.

```bash
node docs/catalogue/.refresh-prices.mjs
```

The script is rate-limited to ~1 req/sec (no flood), takes ~80 seconds for the 70-row catalog, has no npm dependencies (Node 18+ built-in `fetch`), and writes a sidecar JSON at `docs/catalogue/.herbspro_enriched.json` (gitignored). After running, manually transcribe updated `priceDisplay` values into `src/engine/supplementRules.ts` for any product that drifted.

## Adding a brand

1. Append the slug to the `Brand` union in `src/types.ts`.
2. Add the display name to `BRAND_DISPLAY_NAMES` in `src/lib/affiliateLinks.ts`.
3. Add a `GW_BRAND_META` entry in `src/components/ui.tsx`.
4. Add product rows to `herbspro_products.csv`.
5. Re-run `.refresh-prices.mjs` and update `supplementRules.ts`.
