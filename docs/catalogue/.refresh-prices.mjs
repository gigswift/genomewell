// docs/catalogue/.refresh-prices.mjs
// One-shot scraper that enriches docs/catalogue/herbspro_products.csv with prices
// pulled from each HerbsPro product page's <meta property="og:price:amount">.
//
// Output: docs/catalogue/.herbspro_enriched.json — keyed by 1-based row index
//   matching the CSV (header is row 1, data starts at row 2). Each entry holds
//   the deeplink, merchant URL, image URL, product slug, product name (from og:title),
//   and the formatted priceDisplay string.
//
// Usage:  node docs/catalogue/.refresh-prices.mjs
// Re-run when prices drift. Requires Node >= 18 (built-in fetch). No npm deps.

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const HERE = dirname(fileURLToPath(import.meta.url));
const CSV_PATH = join(HERE, 'herbspro_products.csv');
const OUT_PATH = join(HERE, '.herbspro_enriched.json');
const THROTTLE_MS = 1100;
const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 ' +
  '(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

function parseCsv(text) {
  // Minimal CSV parser that handles quoted fields with embedded commas + escaped quotes.
  const rows = [];
  let cell = '';
  let row = [];
  let i = 0;
  let inQuotes = false;
  while (i < text.length) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          cell += '"';
          i += 2;
          continue;
        }
        inQuotes = false;
        i++;
        continue;
      }
      cell += ch;
      i++;
      continue;
    }
    if (ch === '"') {
      inQuotes = true;
      i++;
      continue;
    }
    if (ch === ',') {
      row.push(cell);
      cell = '';
      i++;
      continue;
    }
    if (ch === '\n' || ch === '\r') {
      row.push(cell);
      rows.push(row);
      cell = '';
      row = [];
      if (ch === '\r' && text[i + 1] === '\n') i += 2;
      else i++;
      continue;
    }
    cell += ch;
    i++;
  }
  if (cell.length > 0 || row.length > 0) {
    row.push(cell);
    rows.push(row);
  }
  return rows.filter((r) => r.length > 1 || (r.length === 1 && r[0] !== ''));
}

function extractFromCellC(cellC) {
  // Returns { deeplink, imageUrl }.
  const trimmed = cellC.trim();
  if (trimmed.startsWith('<')) {
    const hrefMatch = trimmed.match(/href="([^"]+)"/i);
    const imgSrcMatch = trimmed.match(/<IMG[^>]*\bsrc="([^"]+)"/i);
    return {
      deeplink: hrefMatch ? hrefMatch[1] : '',
      imageUrl: imgSrcMatch ? imgSrcMatch[1] : '',
    };
  }
  return { deeplink: trimmed, imageUrl: '' };
}

function decodeMurl(deeplink) {
  // Pull the murl=... param and URL-decode it to recover the merchant page URL.
  const match = deeplink.match(/[?&]murl=([^&]+)/i);
  if (!match) return '';
  try {
    return decodeURIComponent(match[1]);
  } catch {
    return match[1];
  }
}

function deriveSlug(merchantUrl) {
  // herbspro.com/products/<slug>?variant=...  → <slug>
  const m = merchantUrl.match(/\/products\/([^?#]+)/i);
  return m ? m[1].toLowerCase() : '';
}

async function fetchPrice(merchantUrl) {
  const res = await fetch(merchantUrl, {
    headers: { 'User-Agent': UA, Accept: 'text/html,*/*' },
    redirect: 'follow',
  });
  if (!res.ok) {
    return { priceDisplay: '', productNameFromOG: '', httpStatus: res.status };
  }
  const html = await res.text();
  const priceMatch = html.match(/<meta[^>]*property="og:price:amount"[^>]*content="([^"]+)"/i);
  const titleMatch = html.match(/<meta[^>]*property="og:title"[^>]*content="([^"]+)"/i);
  const price = priceMatch ? Number(priceMatch[1]) : NaN;
  const priceDisplay = Number.isFinite(price) ? `$${price.toFixed(2)}` : '';
  const productNameFromOG = titleMatch ? titleMatch[1].trim() : '';
  return { priceDisplay, productNameFromOG, httpStatus: res.status };
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  const text = readFileSync(CSV_PATH, 'utf-8');
  const rows = parseCsv(text);
  // rows[0] is the header. CSV row index is 1-based and includes the header,
  // so data row N in the CSV = rows[N-1] in this array. We key the output by
  // 1-based CSV row index (row 2 = first data row).
  const out = {};
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (row.length < 3) continue;
    const csvRowIndex = i + 1;
    const [supplement, brand, cellC] = row;
    const { deeplink, imageUrl } = extractFromCellC(cellC);
    const merchantUrl = decodeMurl(deeplink);
    const productSlug = deriveSlug(merchantUrl);
    let priceDisplay = '';
    let productNameFromOG = '';
    let httpStatus = 0;
    if (merchantUrl) {
      try {
        const result = await fetchPrice(merchantUrl);
        priceDisplay = result.priceDisplay;
        productNameFromOG = result.productNameFromOG;
        httpStatus = result.httpStatus;
      } catch (err) {
        console.error(`row ${csvRowIndex}: fetch error`, err.message);
      }
    }
    out[csvRowIndex] = {
      supplement: supplement.trim(),
      brand: brand.trim(),
      deeplink,
      imageUrl,
      merchantUrl,
      productSlug,
      productNameFromOG,
      priceDisplay,
      httpStatus,
    };
    const status = priceDisplay || `(no price; HTTP ${httpStatus})`;
    console.log(
      `row ${String(csvRowIndex).padStart(3)} ${brand.padEnd(18)} ${supplement.slice(0, 30).padEnd(30)} ${status}`,
    );
    await sleep(THROTTLE_MS);
  }
  writeFileSync(OUT_PATH, JSON.stringify(out, null, 2), 'utf-8');
  const successes = Object.values(out).filter((r) => r.priceDisplay).length;
  const total = Object.keys(out).length;
  console.log(`\nWrote ${OUT_PATH}\n${successes}/${total} rows have prices.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
