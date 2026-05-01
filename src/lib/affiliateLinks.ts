// Affiliate URLs in this project come from a single source: the curated CSV at
// docs/catalogue/herbspro_products.csv. Every URL is a Rakuten LinkShare deeplink
// (host: click.linksynergy.com) for the merchant HerbsPro, pre-tagged with our
// affiliate ID. There is no runtime appending — what's in BrandOption.productUrl
// is what the user clicks. No env vars, no per-brand templates.
//
// Adding a brand: append the slug to the Brand union in src/types.ts, add the
// display name below, and add a GW_BRAND_META entry in components/ui.tsx.

import type { Brand } from '../types';

const BRAND_DISPLAY_NAMES: Record<Brand, string> = {
  'source-naturals': 'Source Naturals',
  solgar: 'Solgar',
  'now-foods': 'NOW Foods',
  'life-extension': 'Life Extension',
  solaray: 'Solaray',
  'jarrow-formulas': 'Jarrow Formulas',
  'bucked-up': 'Bucked Up',
  primaforce: 'PrimaForce',
  nutricost: 'Nutricost',
};

export function getBrandDisplayName(brand: Brand): string {
  return BRAND_DISPLAY_NAMES[brand];
}

export function buildAffiliateUrl(productUrl: string): string {
  return productUrl;
}
