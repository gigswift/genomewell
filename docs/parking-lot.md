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

---

## v1 account features & monetization
**Parked:** 2026-04-16

**Context:** After v0 launches (Thorne affiliate, free DNA analysis → supplement recommendations), v1 introduces user accounts. Four value propositions for account creation were identified:

1. **Drill-down results** — gated deeper SNP detail behind account signup (free tier showed top-level; account unlocks full analysis, supporting SNP context, cross-category insights)
2. **Cashback / discounts** — share affiliate margin back with users as a loyalty incentive. Funded from GenomeWell's affiliate commission, not from supplement pricing. Could be percentage-back, credits toward future purchases, or tiered rewards.
3. **GLP-1 access** — future offering tying into the metabolic health positioning. Significant regulatory and practitioner requirements (GLP-1s are prescription medications). Would leverage the family practitioner network (PharmD aunt, MD aunt) established for Fullscript.
4. **DNA-based content library** — fitness programs informed by Body Optimization SNPs, podcasts, curated health content. Subscription or membership-gated. Aligns with the "community and content" moat identified in product strategy.

**Timing:** After v0 launch and bug stabilization. Do not build account infrastructure before proving the free funnel converts.

**Next action when unparked:** Scope the account system (auth, gating logic, cashback tracking), prioritize which of the 4 features ships first, estimate implementation effort.

**Dependencies:** v0 must be live with measurable conversion data. GLP-1 access requires practitioner onboarding (task `3450a`) to be completed first.
