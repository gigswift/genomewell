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

---

## Chat with GenomeWell about your results
**Parked:** 2026-04-16

**Context:** After DNA analysis, let users have a conversation with Claude about their results — ask follow-up questions, get clarification on specific SNPs, understand how recommendations interact, explore "what if" scenarios (e.g., "what if I'm already taking magnesium?"), and get guidance in plain language tailored to their goals.

**How it could work:**
- After results are generated, a chat interface appears alongside the results dashboard
- Claude receives the user's structured SNPResult data + supplement stack + goals as context (never the raw DNA file)
- Users ask questions like "Why is Vitamin D so important for me?", "Can I take these together?", "I'm already on metformin — does that change anything?", "Explain my APOE result like I'm not a scientist"
- Maintains the warm, culturally aware tone established in the system prompt
- Privacy-preserving: only structured results are sent to Claude, same as the narrative summary architecture

**Value proposition:**
- Transforms a static report into an interactive experience — dramatically increases engagement and time-on-site
- Builds trust through dialogue (users can pressure-test recommendations)
- Natural upsell surface ("To unlock unlimited chat, create an account")
- Differentiator vs competitors who give you a PDF and walk away

**Implementation considerations:**
- Requires Anthropic API key (or proxy through serverless function for production)
- Token cost per conversation: ~2000–5000 tokens per exchange, ~$0.01–0.05 per conversation at Sonnet pricing
- Could gate behind account signup (v1) or offer limited free exchanges (3–5 questions) before requiring signup
- Practitioner disclaimer needed: "This is AI-generated wellness guidance, not medical advice"

**Open questions:**
- Free tier: how many chat exchanges before gating?
- Should chat context persist across sessions (requires account + storage)?
- Can the chat proactively suggest Thorne products during conversation (monetization) or does that erode trust?
- Drug interaction questions (like metformin example) — should Claude answer these or defer to "consult your pharmacist"? PharmD aunt could help define the boundary.

**Next action when unparked:** Prototype the chat interface, define the system prompt, set up the structured-context handoff from results to chat, test with sample SNP profiles.

**Dependencies:** v0 results dashboard must be functional. Anthropic API key or proxy required. Practitioner sign-off on the chat disclaimer language (could be part of task `3450a`).
