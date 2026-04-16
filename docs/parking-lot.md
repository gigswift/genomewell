# Parking Lot

Exploratory threads parked for later. Each entry has enough context to resume without re-reading the original conversation.

To resume: tell Claude "unpark [title]" or "resume the [title] thread."

---

## Multi-agent / ongoing automation
**Parked:** 2026-04-16

**Context:** Discussed standing up multiple agents with ongoing/scheduled work to augment the GenomeWell build. Three mechanisms were identified:
- **Kanban tasks** — one-shot parallel work in worktrees (already in use)
- **Scheduled remote agents (`/schedule` skill)** — cron-based, run remotely without machine being on
- **Dynamic `/loop`** — in-session recurring only

**Proposed setup (not yet built):**

| Cadence | Agent | Purpose |
|---|---|---|
| Weekly | Research agent | Scan PubMed / Google Scholar for new studies on the Tier 1 SNP catalog; propose additions to `docs/science-snp-catalog.md` |
| Weekly | Competitive monitor | Track GenoPalate, Viome, Rootine, Function Health for pricing/feature/press changes; maintain `docs/competitive-landscape.md` (new doc) |
| Daily | Ops snapshot | Vercel deploy health, GitHub issues/PRs, Kanban board state → daily digest |
| Ad-hoc | Kanban tasks | Feature builds, doc drafting, content — as needed |

**Next action when unparked:** Stand up the weekly research agent as a proof of concept. If valuable, add the others.

**Open question:** Whether to run these as scheduled remote agents (machine-independent) or in-session loops (cheaper but requires Claude Code session open).
