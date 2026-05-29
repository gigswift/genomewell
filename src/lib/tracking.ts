// First-party behavioral tracking — see docs/build-deployment.md for full
// contract. Two outputs per event:
//   1. POST /api/track  (fire-and-forget, our own Vercel function logs)
//   2. gtag('event', 'conversion', { send_to: ID/LABEL })  (Google Ads)
//
// Privacy invariants enforced here:
//   - Payload type TrackPayload is closed; DNA / genotypes / rsids cannot leak
//     through unless a caller passes them, and no caller is allowed to.
//   - Fire-and-forget: errors are swallowed; nothing here may block navigation.
//   - If gtag env vars are missing, the gtag call is silently skipped (the
//     /api/track POST still fires).

const SESSION_COOKIE = 'cw_session';
const GCLID_COOKIE = 'cw_gclid';
const SESSION_TTL_DAYS = 30;
const GCLID_TTL_DAYS = 90;

type TrackEvent = 'affiliate_click' | 'file_parsed' | 'page_view';

interface TrackPayload {
  event: TrackEvent;
  partner?: string;
  supplementId?: string;
}

interface GtagFn {
  (command: 'js', date: Date): void;
  (command: 'config', targetId: string, params?: Record<string, unknown>): void;
  (command: 'event', eventName: string, params?: Record<string, unknown>): void;
}

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: GtagFn;
  }
}

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.slice(name.length + 1)) : null;
}

function setCookie(name: string, value: string, days: number): void {
  if (typeof document === 'undefined') return;
  const maxAge = days * 24 * 60 * 60;
  document.cookie = `${name}=${encodeURIComponent(value)}; Max-Age=${maxAge}; Path=/; SameSite=Lax`;
}

function uuidv4(): string {
  const c = globalThis.crypto;
  if (c && typeof c.randomUUID === 'function') return c.randomUUID();
  // Fallback for older browsers (still RFC 4122 v4 layout).
  const bytes = new Uint8Array(16);
  if (c && typeof c.getRandomValues === 'function') {
    c.getRandomValues(bytes);
  } else {
    for (let i = 0; i < 16; i++) bytes[i] = Math.floor(Math.random() * 256);
  }
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0'));
  return `${hex.slice(0, 4).join('')}-${hex.slice(4, 6).join('')}-${hex.slice(6, 8).join('')}-${hex.slice(8, 10).join('')}-${hex.slice(10, 16).join('')}`;
}

function getOrCreateSessionId(): string {
  const existing = getCookie(SESSION_COOKIE);
  if (existing) return existing;
  const fresh = uuidv4();
  setCookie(SESSION_COOKIE, fresh, SESSION_TTL_DAYS);
  return fresh;
}

function captureGclidFromUrl(): void {
  if (typeof window === 'undefined') return;
  try {
    const params = new URLSearchParams(window.location.search);
    const gclid = params.get('gclid');
    if (gclid && gclid.length > 0 && gclid.length <= 256) {
      setCookie(GCLID_COOKIE, gclid, GCLID_TTL_DAYS);
    }
  } catch {
    // ignore — malformed URL or no window
  }
}

function getGclid(): string | undefined {
  const v = getCookie(GCLID_COOKIE);
  return v ?? undefined;
}

function getEnv(
  name:
    | 'VITE_GOOGLE_ADS_ID'
    | 'VITE_GOOGLE_ADS_LABEL_AFFILIATE_CLICK'
    | 'VITE_GOOGLE_ADS_LABEL_FILE_PARSED'
    | 'VITE_GOOGLE_ADS_LABEL_PAGE_VIEW',
): string | undefined {
  const v = import.meta.env[name] as string | undefined;
  if (typeof v !== 'string') return undefined;
  const trimmed = v.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

let bootstrapped = false;

// file_parsed represents one genuine parse-success per page session. The
// success codepath can run more than once (e.g. a remount re-invoking it), so
// we fire this event at most once per loaded page to avoid double-counting the
// Google Ads conversion. A full reload starts a fresh session and resets this.
let fileParsedFired = false;

export function initTracking(): void {
  if (bootstrapped) return;
  bootstrapped = true;
  try {
    captureGclidFromUrl();
    getOrCreateSessionId();
    loadGtag();
    track({ event: 'page_view' });
  } catch {
    // bootstrap must never throw
  }
}

function loadGtag(): void {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  const adsId = getEnv('VITE_GOOGLE_ADS_ID');
  if (!adsId) return; // no env → no gtag (the track POST still works)
  if (window.gtag) return; // already loaded

  window.dataLayer = window.dataLayer || [];
  // Matches Google's official gtag stub verbatim (developers.google.com/tag-platform/gtagjs/install).
  // Must push the `arguments` object, not a rest-params array — rest params were the suspected cause
  // of conversion pings never firing (gtag.js did not recognize the pushed commands).
  const gtag = function gtag(): void {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments);
  } as unknown as GtagFn;
  window.gtag = gtag;

  gtag('js', new Date());
  gtag('config', adsId);

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(adsId)}`;
  document.head.appendChild(script);
}

function fireGoogleAdsConversion(event: TrackEvent): void {
  const adsId = getEnv('VITE_GOOGLE_ADS_ID');
  const label =
    event === 'affiliate_click'
      ? getEnv('VITE_GOOGLE_ADS_LABEL_AFFILIATE_CLICK')
      : event === 'file_parsed'
        ? getEnv('VITE_GOOGLE_ADS_LABEL_FILE_PARSED')
        : event === 'page_view'
          ? getEnv('VITE_GOOGLE_ADS_LABEL_PAGE_VIEW')
          : undefined;
  if (!adsId || !label) return;
  if (typeof window === 'undefined' || !window.gtag) return;
  try {
    window.gtag('event', 'conversion', {
      send_to: `${adsId}/${label}`,
    });
  } catch {
    // ignore — gtag must never block navigation
  }
}

export function track(payload: TrackPayload): void {
  try {
    if (payload.event === 'file_parsed') {
      if (fileParsedFired) return;
      fileParsedFired = true;
    }

    const sessionId = getOrCreateSessionId();
    const body = {
      event: payload.event,
      partner: payload.partner,
      supplementId: payload.supplementId,
      sessionId,
      gclid: getGclid(),
      timestamp: new Date().toISOString(),
      page: typeof window !== 'undefined' ? window.location.pathname : undefined,
    };

    // Fire-and-forget — do NOT await. Errors are swallowed.
    if (typeof fetch !== 'undefined') {
      void fetch('/api/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        keepalive: true,
      }).catch(() => {
        // intentionally ignored
      });
    }

    fireGoogleAdsConversion(payload.event);
  } catch {
    // tracking must never throw
  }
}
