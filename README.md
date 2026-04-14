# GenomeWell

**Privacy-First Genetic Wellness App for the Black American Community**

GenomeWell lets you upload your raw DNA file from 23andMe or AncestryDNA and receive a personalized, AI-powered wellness narrative — with a focus on the health landscape of the Black American community. All DNA parsing happens locally in your browser; only structured genetic marker results are ever sent to Claude.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + TypeScript |
| Build tool | Vite 8 |
| Styling | Tailwind CSS 3 |
| AI narrative | Claude Opus 4.6 via Anthropic API |
| ZIP parsing | JSZip |
| Testing | Vitest + Testing Library |
| Deployment | Vercel |

---

## Setup

```bash
git clone https://github.com/gigswift/genomewell.git
cd genomewell
npm install
cp .env.example .env
# → add your VITE_ANTHROPIC_API_KEY to .env
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

---

## Getting Your Raw DNA File

### From 23andMe

1. Log in to [23andMe](https://www.23andme.com)
2. Go to **Settings → 23andMe Data**
3. Click **Download Raw Data**
4. Download as `.zip` or `.txt` and upload to GenomeWell

### From AncestryDNA

1. Log in to [AncestryDNA](https://www.ancestry.com/dna/)
2. Go to **Settings → Privacy**
3. Click **Download Your Data**
4. Download the `.zip` or `.txt` file and upload to GenomeWell

---

## Privacy Architecture

GenomeWell is built privacy-first:

1. **Browser-only parsing** — your raw DNA file is read using the browser's [File API](https://developer.mozilla.org/en-US/docs/Web/API/File_API). For `.zip` files, JSZip extracts the inner `.txt` in memory. The file never leaves your device.

2. **Structured extraction only** — the parser scans for ~30 curated SNPs (single nucleotide polymorphisms) relevant to Black American health. Only the matched `SNPResult[]` array — containing rsIDs, gene names, traits, and genotypes — is passed to the Claude API. No raw file bytes are transmitted.

3. **No storage** — GenomeWell has no database and no backend server. Nothing is persisted between sessions. Closing the tab erases everything.

```
Raw DNA file (.txt / .zip)
        │
        ▼  [Browser File API + JSZip]
  Local parser (src/dnaParser.ts)
        │
        ▼  SNPResult[] (rsid, gene, trait, genotype)
  Claude API (src/claudeClient.ts)
        │
        ▼
  Wellness narrative (text only)
        │
        ▼
  WellnessReport component
```

---

## Production Note

For production, **proxy the Claude API call through a serverless function** (e.g. a [Vercel Edge Function](https://vercel.com/docs/functions/edge-functions)) so the API key is never exposed in client-side JavaScript. The MVP calls the Anthropic API directly from the browser using the `anthropic-dangerous-allow-browser: true` header for simplicity.

Example Vercel Edge Function:

```ts
// api/generate.ts
import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(req: Request) {
  const body = await req.json();
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY!,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  return NextResponse.json(data);
}
```

---

## Persistent Storage (Future)

If response persistence is needed in a future version (e.g. saving past wellness reports), recommend:

- **[Vercel KV](https://vercel.com/docs/storage/vercel-kv)** — zero-config Redis, works seamlessly with Vercel deployments
- **[Supabase](https://supabase.com/)** — open-source Postgres with a generous free tier and row-level security for per-user data isolation

Both are HIPAA-capable with appropriate configuration and business associate agreements.

---

## Disclaimer

GenomeWell is for informational and wellness purposes only. It is not a medical device and does not provide medical advice, diagnosis, or treatment. Always consult a qualified healthcare professional before making any health decisions based on genetic information.
