// Vercel serverless function — POST /api/feedback
// Forwards feedback submissions to hello@chronicwellness.ai via Resend HTTP API.
// Honeypot ('website' field) silently succeeds to avoid signaling bots.
// No PII is logged.

interface FeedbackBody {
  email?: unknown;
  comment?: unknown;
  topic?: unknown;
  website?: unknown;
}

interface VercelRequest {
  method?: string;
  body?: unknown;
}

interface VercelResponse {
  status: (code: number) => VercelResponse;
  json: (body: unknown) => VercelResponse;
}

const ALLOWED_TOPICS = [
  'General feedback',
  'A specific recommendation',
  'Bug report',
  'Partnership inquiry',
  'Privacy or security',
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const raw = parseBody(req.body);
  const { email, comment, topic, website } = raw;

  // Honeypot — silent 200 (don't tip off bots)
  if (typeof website === 'string' && website.length > 0) {
    return res.status(200).json({ ok: true });
  }

  const emailValid =
    typeof email === 'string' &&
    email.length <= 320 &&
    EMAIL_RE.test(email);
  const commentValid =
    typeof comment === 'string' &&
    comment.trim().length >= 10 &&
    comment.length <= 5000;
  if (!emailValid || !commentValid) {
    return res.status(400).json({ error: 'Invalid submission' });
  }

  const topicNorm =
    typeof topic === 'string' && ALLOWED_TOPICS.includes(topic)
      ? topic
      : 'General feedback';

  // TODO(v0+): rate-limit by IP via Vercel KV (1/min). Honeypot covers most spam for now.

  const resendKey = process.env.RESEND_API_KEY;
  if (!resendKey) {
    return res.status(500).json({ error: 'Email service not configured' });
  }

  const timestamp = new Date().toISOString();
  const text = [
    `Topic: ${topicNorm}`,
    `From: ${email}`,
    `Received: ${timestamp}`,
    '',
    String(comment),
  ].join('\n');

  const resendRes = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${resendKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Chronic Wellness <hello@chronicwellness.ai>',
      to: 'hello@chronicwellness.ai',
      reply_to: email,
      subject: `New feedback: ${topicNorm}`,
      text,
    }),
  });

  if (!resendRes.ok) {
    return res.status(500).json({ error: 'Email send failed' });
  }
  return res.status(200).json({ ok: true });
}

function parseBody(body: unknown): FeedbackBody {
  if (body && typeof body === 'object') return body as FeedbackBody;
  if (typeof body === 'string') {
    try {
      const parsed = JSON.parse(body);
      if (parsed && typeof parsed === 'object') return parsed as FeedbackBody;
    } catch {
      // fall through
    }
  }
  return {};
}
