# Commerce & Practitioner Model

## Partner landscape (with verified commission rates)

### Affiliate programs (no practitioner required)

| Partner | Commission | Cookie | Min payout | Notes |
|---|---|---|---|---|
| **Thorne** | **10–20%** tiered (Bronze/Silver/Gold) | 30 days | $100 | **v0 primary.** Premium brand, covers most of the core stack. Gold tier at 20% is strong. |
| **iHerb** | 10% first 3 months, **5%** ongoing | 7 days | ~$10 | Huge catalog but short cookie hurts conversion. Secondary option. |
| **Life Extension** | **6–8%** | 30 days | Varies | Longevity-focused, audience-aligned. Supplemental. |
| **Amazon Associates** | **1–3%** | 24 hours | $10 | **Not recommended.** Terrible rates, terrible cookie. Not worth integrating. |
| **Nordic Naturals** | No affiliate program | — | — | Premium omega-3 brand but no referral path. |

### DTC supplement brands (higher commission, narrower catalog)

| Partner | Commission | Cookie | Notes |
|---|---|---|---|
| **BioTrust** | Up to **40%** | 60 days | Weight loss, immune, keto. Highest rate in supplement space. |
| **Vitauthority** | **25–35%** | 30 days | Collagen, women's wellness. |
| **Organifi** | **30%** | 30 days | Superfoods, detox, green juices. |
| **1st Phorm** | **30%** | 14 days | Fitness-oriented. Short cookie. |
| **Onnit** | **15%** | 45 days | Nootropics, fitness. Longest cookie in the DTC set. |

### Dispensary models (practitioner required)

| Partner | Margin | Model | Notes |
|---|---|---|---|
| **Fullscript** | Up to **35%** (US) / 25% (CA) | Practitioner sets markup; you become seller of record | **v1 target.** Documented API, multi-brand catalog. |
| **Wholescripts (Xymogen)** | ~20–30% | Single-brand practitioner dispensary | Too narrow vs Fullscript. |

## v0 commerce strategy (decided 2026-04-16)

### Thorne affiliate as primary revenue
Thorne covers most of the GenomeWell supplement stack: methylfolate, methyl-B12, D3+K2, omega-3, CoQ10, magnesium, NAC, berberine. One affiliate relationship covers the majority of recommendations.

**Unit economics at Thorne Gold tier (20%):**
- Average recommended stack: ~$80/month
- Commission per order: ~$16
- Annual value per subscribing user: ~$192

### DTC brands for specialty fills
Stack 1–2 DTC brands where Thorne has gaps or lower-margin products:
- BioTrust (40%) for protein / specialty formulas
- Organifi (30%) for greens / superfood blends

**Blended effective rate: ~15–25%** depending on product mix.

### What this means for the app
- Each supplement recommendation card → affiliate link to Thorne (or DTC brand)
- "Shop this stack" CTA on results page
- No practitioner needed for v0
- No Fullscript integration needed for v0
- Measure: click-through rate, completed purchases, conversion from results → purchase

## Launch sequencing (updated 2026-04-16)

### v0 — Thorne affiliate + DTC brands (now)
- Thorne as primary affiliate partner (~20% at Gold tier)
- 1–2 DTC brands for specialty products (BioTrust at 40%, Organifi at 30%)
- Affiliate links on supplement recommendation cards
- No practitioner required, zero infrastructure beyond the app
- Goal: prove the funnel converts before adding complexity

### v1 — Fullscript dispensary + family practitioners (after v0 validates)
- Onboard family practitioners (see task `3450a`)
- Integrate Fullscript API (up to 35% margin)
- Build membership/signup flow with gated results
- Launch subscription-based supplement protocols
- Timeline: 6–10 weeks after v0 validation

### v2 — White-label / own brand (12–24 months, if unit economics justify)
- Commission own SKUs via contract manufacturer
- Better margins (60–70% gross), your brand on bottle
- Only makes sense at scale (≥ ~5k subscribers)

## Practitioner requirements (for v1+)

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

Detailed planning deliverable: Kanban task `3450a` (practitioner engagement framework) — held in backlog in genomewell workspace.

## Open questions to resolve
- Thorne affiliate application and tier qualification timeline
- Which DTC brands to stack alongside Thorne (BioTrust + Organifi vs alternatives)
- Vitamin Labs API status (re-verify if strategy shifts toward white-label)
- State coverage map for family practitioners (v1)
- Malpractice / E&O insurance (~$3–10k/year for company-held policy, v1)
- Practitioner equity / retainer structure (v1)
