# Commerce & Practitioner Model

## Partner landscape

| Partner | Model | API | Practitioner required | Fit |
|---|---|---|---|---|
| **Fullscript** | Multi-brand dispensary | Yes (documented) | Yes | **v1 recommendation** |
| **Vitamin Labs** | White-label personalized packs | No (per latest info) | Yes | Future (v2) if API matures |
| **Thorne** | Single-brand (affiliate + practitioner programs) | Partial | Yes for dispensary | Secondary affiliate layer |
| **Wholescripts (Xymogen)** | Single-brand practitioner dispensary | Partial | Yes | Too narrow vs Fullscript |
| **iHerb** | Affiliate (multi-brand) | No | No | v0 validation layer |
| **Amazon Associates** | Affiliate | No | No | Not recommended — low trust, low margin |

### Why Fullscript as v1
- Documented public API
- Multi-brand catalog (Thorne, Pure Encapsulations, Designs for Health, etc.)
- Fast to launch (weeks, not months)
- No inventory or formulation capital required
- Users recognize the supplement brands → higher trust
- Practitioner requirement is universal anyway

## Practitioner requirements

### Qualifying credentials
- **MD / DO** — Medical doctors / osteopaths
- **NP / PA** — Nurse practitioners / physician assistants
- **DC** — Chiropractors
- **ND** — Naturopathic doctors (~25 US states only)
- **LAc** — Licensed acupuncturists
- **RD / RDN** — Registered dietitians
- **CNS / CCN** — Certified nutrition specialists
- **PharmD** — Pharmacists (strong fit for supplement oversight)
- **DPT** — Physical therapists

### Jurisdictional considerations
- Practitioner must be licensed in the **user's state**, not just their own
- Multi-state compacts: IMLC (MDs, ~40 states), NLC (NPs/RNs, ~40 states), APRN Compact (rolling out)
- No compact for NDs, RDs, CNSes — state-by-state licensing required
- Strictest states for nutrition/supplement advice: CA, TX, FL, NY
- Health-freedom states with broader latitude: AZ, OK, several others

### Legal framing (applies everywhere, regardless of state)
- No disease claims — "supports metabolic health" ✓ / "treats diabetes" ✗
- Frame as wellness, educational, supportive
- Include "not medical advice" disclaimers
- Supplement Facts compliance (DSHEA)

## Family practitioner advantage

Available practitioners:
- **Aunt (PharmD)** — strong fit for pharmacy oversight, drug-supplement interactions
- **Aunt (MD)** — medical credibility, disease-claim language oversight
- **Doctor friends (2+)** — widen state coverage, diversify specialties

### Proposed structure
- **Chief Pharmacy Officer** — PharmD aunt (named publicly, equity, primary protocol reviewer)
- **Chief Medical Officer** — MD aunt (named publicly, equity, claim-language oversight)
- **Medical Advisory Board** — doctor friends (informal or small retainer, widen coverage)

### Family dynamics note
Formalize **more** with family, not less. Written agreements, fair compensation (discount OK; "free" is bad), malpractice coverage confirmation, clear scope of practice. Protecting their licenses and reputations is a founder-level responsibility.

Detailed planning deliverable: Kanban task `9c7d4` (practitioner engagement framework) — held in backlog.

## Launch sequencing

### v0 — Affiliate validation (weekend of work)
- Add iHerb + Thorne affiliate deep-links on results page
- Measure: click-through rate, completed purchases, conversion from results → purchase
- No practitioner required, zero infrastructure
- Goal: prove the funnel works before committing

### v1 — Fullscript + family practitioners (6–10 weeks out)
- Onboard practitioners (see task `9c7d4`)
- Integrate Fullscript API
- Build membership/signup flow with gated results
- Launch subscription-based supplement protocols

### v2 — White-label / own brand (12–24 months, if unit economics justify)
- Commission own SKUs via Vitamin Labs-style partner or direct contract manufacturer
- Better margins, your brand on bottle
- Only makes sense at scale (≥ ~5k subscribers)

## Open questions to resolve
- Vitamin Labs API status (re-verify if strategy shifts)
- State coverage map for family practitioners
- Malpractice / E&O insurance (~$3–10k/year for company-held policy)
- Practitioner equity / retainer structure
