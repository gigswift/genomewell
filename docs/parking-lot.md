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

---

## Tier 2 supplement expansion
**Parked:** 2026-04-18

**Context:** During the supplement-engine port (v0 catalog = 18 supplements), the question surfaced whether Tier 2 supplements (Ashwagandha, Curcumin, Chromium — and possibly Resveratrol) should be included with a UI-surfaced confidence label. The architecture already supports this: `SupplementRecommendation.confidence` has a `'medium'` tier, and `SupplementRule.evidenceTier` distinguishes `SNP-driven` from `SNP-informed`. No code changes needed to surface them.

**What blocks inclusion today:** `CLAUDE.md` evidence-discipline rule: *"Evidence strength labeled honestly — if previously labeled 'weak,' it cannot be included."* All three current Tier 2 entries are labeled weak in `docs/science-snp-catalog.md:171-174` ("plausible, not proven" / "mechanistic, not prescription" / "weaker clinical effect").

**Three resolution paths considered:**
1. **Amend the CLAUDE.md rule** — replace "weak evidence excluded" with "weak evidence allowed if `confidence='medium'` and UI labels it." User leaning toward this; wants to review evidence per supplement first before deciding.
2. **Case-by-case promotion** — individually re-evaluate each Tier 2 candidate against the inclusion checklist via PharmGKB / PubMed WebSearch. Chromium likely still fails (redundancy with berberine, not evidence).
3. **Tier 2 as goal-driven only** — rules with empty `primarySNPs`, surfaced only when user selects matching goal (Inflammation → Curcumin, Energy → Ashwagandha). Mirrors the Tier 3 pattern.

**Research needed before decision:**
- WebSearch-verified evidence summary for each Tier 2 candidate, following the CLAUDE.md citation rule (never cite PMIDs from memory).
- User noted Resveratrol stood out as weaker than other Tier 2 options — Resveratrol is **not currently in any tier** in `docs/science-snp-catalog.md`. If it's being considered it needs to be added to the evaluation set.
- Open-ended question: scan for other SNP-hooked supplements not yet tiered (quercetin, milk thistle / CYP metabolism, etc.).

**Rough cost estimate for evidence research:** ~6-9 WebSearches + 2-4 WebFetches on PharmGKB/PubMed. Single-digit dollars at most.

**Next action when unparked:** Run the targeted WebSearch pass, record verified findings in `docs/science-snp-catalog.md` (per "verify once, record in docs" rule), then choose path 1/2/3 with user.

**Architecture headroom confirmed:** No code changes required — `SupplementRule` already accepts empty `primarySNPs`, `SupplementConfidence` already includes `'medium'`, and the rules array is the only file that grows.
