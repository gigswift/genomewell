# Build & Deployment Notes

## Stack
- **Frontend:** React + TypeScript (Vite)
- **Styling:** Tailwind CSS
- **File parsing:** JSZip (zip files) + browser File API (text)
- **AI narrative (optional):** Anthropic Claude API
- **Hosting:** Vercel
- **Repo:** https://github.com/gigswift/genomewell

## Live URL
https://genomewell-fdz56m2rv-rashadbartholomew-5285s-projects.vercel.app

## Local development
```bash
cd ~/genomewell
npm install
npm run dev      # http://localhost:5173
npm run build
```

## Deployment
```bash
vercel --prod --yes
```

## Known build constraints
- `.npmrc` contains `legacy-peer-deps=true` to resolve ESLint 9 vs `eslint-plugin-react-dom` peer conflict on Vercel builds.
- Two parallel type files exist (`src/types.ts` is active; `src/types/index.ts` is orphan from parallel agent build — see below).

## Parallel Kanban task drift (incident, 2026-04-13)
During initial scaffold, parallel Kanban tasks each invented their own type schemas and SNP catalogs:

- **Active path** — `src/types.ts` (`riskLevel`, `fitnessProtocols`), `src/snpCatalog.ts` (31 SNPs), `src/services/*`
- **Orphan path** — `src/types/index.ts` (`risk`, `fitnessProtocol`), `src/engine/snpRules.ts` (17 SNPs), `src/engine/*`, `src/api/claude.ts`

No cleanup urgency while prototyping. At productionization, pick one world and delete the other.

**Lesson captured in Claude memory:** parallel Kanban tasks require a final reconciliation task; type contracts alone don't prevent drift.

## Vercel project
- Account: `rashadbartholomew-5285`
- Env var to set when activating Claude narrative: `VITE_ANTHROPIC_API_KEY`
- Currently unset — app uses deterministic fallback narrative, which is the preferred default (see `product-strategy.md`)
