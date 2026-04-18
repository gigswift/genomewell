import type { Partner } from '../types';

// Per-partner URL template + affiliate query-param convention.
// Slugs come from the supplement catalog (PartnerOption.productSlug).
// The query-param keys here are placeholders — confirm the actual tracking
// parameter with each partner at onboarding. Sources:
//   - Thorne: ShareASale network; `aff` stands in for the ShareASale merchant-id redirect
//   - BioTrust: `ref` used by most Impact/CJ-style attribution links
//   - Organifi: Refersion (`rfsn=` is their documented tracking param)
// Changing a convention here is a one-line edit; nothing downstream hardcodes it.
const PARTNER_CONFIG: Record<
  Partner,
  { displayName: string; baseUrl: string; affParam: string; envKey: string }
> = {
  thorne: {
    displayName: 'Thorne',
    baseUrl: 'https://www.thorne.com/products',
    affParam: 'aff',
    envKey: 'VITE_THORNE_AFFILIATE_ID',
  },
  biotrust: {
    displayName: 'BioTrust',
    baseUrl: 'https://biotrust.com/products',
    affParam: 'ref',
    envKey: 'VITE_BIOTRUST_AFFILIATE_ID',
  },
  organifi: {
    displayName: 'Organifi',
    baseUrl: 'https://organifi.com/products',
    affParam: 'rfsn',
    envKey: 'VITE_ORGANIFI_AFFILIATE_ID',
  },
};

const PLACEHOLDER_ID = 'pending-approval';
const warned = new Set<Partner>();

function readAffiliateId(partner: Partner): string {
  const { envKey } = PARTNER_CONFIG[partner];
  const raw = (import.meta.env as Record<string, string | undefined>)[envKey];
  const id = raw?.trim();
  if (id) return id;
  if (import.meta.env.DEV && !warned.has(partner)) {
    warned.add(partner);
    // eslint-disable-next-line no-console
    console.warn(
      `[affiliateLinks] ${envKey} is unset — using placeholder. ` +
        `Commission will not attribute until the real ID is set.`,
    );
  }
  return PLACEHOLDER_ID;
}

export function buildAffiliateUrl(partner: Partner, slug: string): string {
  const { baseUrl, affParam } = PARTNER_CONFIG[partner];
  const id = readAffiliateId(partner);
  const safeSlug = encodeURIComponent(slug);
  return `${baseUrl}/${safeSlug}?${affParam}=${encodeURIComponent(id)}`;
}

export function getPartnerDisplayName(partner: Partner): string {
  return PARTNER_CONFIG[partner].displayName;
}
