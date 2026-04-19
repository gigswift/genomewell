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

## Affiliate env vars

`src/lib/affiliateLinks.ts` is the single source of truth for all outbound supplement links. It reads one env var per partner. Set whichever programs have approved the account; the rest fall back to a placeholder ID that will not attribute commission (a dev-mode console warning is emitted once per unset partner).

| Partner | Env var | Commission | Live value (Vercel production) | Notes |
|---|---|---|---|---|
| Thorne | `VITE_THORNE_AFFILIATE_ID` | 10–20% tiered | `PENDING_THORNE_APPROVAL` | Primary v0 partner (see `commerce-practitioner.md`) |
| BioTrust | `VITE_BIOTRUST_AFFILIATE_ID` | up to 40% | `PENDING_BIOTRUST_APPROVAL` | Specialty / protein fills |
| Organifi | `VITE_ORGANIFI_AFFILIATE_ID` | 30% | `PENDING_ORGANIFI_APPROVAL` | Greens / superfoods |

All three vars are seeded with `PENDING_<PARTNER>_APPROVAL` placeholders as of 2026-04-18 — none of the affiliate programs have approved yet. Clicks attribute zero commission until a real ID is swapped in.

Because approval timing is unpredictable, no code path hardcodes a single partner — whichever partner ID is populated starts paying commission immediately. Adding a new partner is an enum entry + env var: no component or engine edits required.

### Approval-swap workflow (no code deploy)
When a partner approves the account:

1. Update only that partner's env var on Vercel:
   ```bash
   vercel env rm VITE_<PARTNER>_AFFILIATE_ID production --yes
   printf '<real-id-from-partner>' | vercel env add VITE_<PARTNER>_AFFILIATE_ID production
   ```
2. Trigger a fresh production deploy so the new value is baked into the bundle. **No git push or code change is required** — `VITE_*` vars are read at build time, not at runtime, so a redeploy is mandatory but a code change is not:
   ```bash
   cd ~/genomewell && vercel --prod --yes --force
   ```
3. Update the table above: change the live value cell from `PENDING_<PARTNER>_APPROVAL` to "approved (real ID redacted)" and note the swap date in the prose.

The other two partners' env vars are untouched — their placeholders keep working until each program approves in turn.

### Dev preview
Run `npm run dev` and visit `http://localhost:5173/?preview=supplement-cards` to render the SupplementCard fixture across all three partners plus a gap and a skip case. The preview route is stripped from production builds (`import.meta.env.DEV` gate in `src/main.tsx`).
