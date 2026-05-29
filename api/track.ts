/// <reference types="node" />
// Vercel serverless function — POST /api/track
// Logs first-party affiliate-click and other behavioral events to stdout so they
// land in the Vercel runtime logs (queryable via the Vercel dashboard).
//
// Hard privacy invariant: this endpoint accepts ONLY the structured fields
// listed in TrackBody. DNA genotypes, rsids, SNPResult arrays, file contents,
// and any free-form user text are out of scope by construction — the client
// builder (src/lib/tracking.ts) does not put them in the payload, and unknown
// fields are dropped here.

interface TrackBody {
  event?: unknown;
  partner?: unknown;
  supplementId?: unknown;
  sessionId?: unknown;
  gclid?: unknown;
  timestamp?: unknown;
  page?: unknown;
}

interface VercelRequest {
  method?: string;
  body?: unknown;
  headers?: Record<string, string | string[] | undefined>;
}

interface VercelResponse {
  status: (code: number) => VercelResponse;
  json: (body: unknown) => VercelResponse;
}

const ALLOWED_EVENTS = new Set([
  'affiliate_click',
  'file_parsed',
  'page_view',
]);

const MAX_STR = 256;

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const raw = parseBody(req.body);

  const event = sanitizeStr(raw.event);
  const sessionId = sanitizeStr(raw.sessionId);
  const timestamp = sanitizeStr(raw.timestamp);
  const page = sanitizeStr(raw.page);
  const partner = sanitizeStr(raw.partner);
  const supplementId = sanitizeStr(raw.supplementId);
  const gclid = sanitizeStr(raw.gclid);

  if (!event || !ALLOWED_EVENTS.has(event)) {
    return res.status(400).json({ error: 'Invalid event' });
  }
  if (!sessionId || !timestamp) {
    return res.status(400).json({ error: 'Missing session or timestamp' });
  }

  const record = {
    type: 'track',
    event,
    sessionId,
    timestamp,
    page: page || null,
    partner: partner || null,
    supplementId: supplementId || null,
    gclid: gclid || null,
    ua: sanitizeStr(req.headers?.['user-agent']) || null,
    referer: sanitizeStr(req.headers?.referer) || null,
  };

  console.log(JSON.stringify(record));
  return res.status(200).json({ ok: true });
}

function sanitizeStr(v: unknown): string {
  if (typeof v === 'string') return v.slice(0, MAX_STR);
  if (Array.isArray(v) && typeof v[0] === 'string') return v[0].slice(0, MAX_STR);
  return '';
}

function parseBody(body: unknown): TrackBody {
  if (body && typeof body === 'object') return body as TrackBody;
  if (typeof body === 'string') {
    try {
      const parsed: unknown = JSON.parse(body);
      if (parsed && typeof parsed === 'object') return parsed as TrackBody;
    } catch {
      // fall through
    }
  }
  return {};
}
