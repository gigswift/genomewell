# Commerce & Practitioner Model

## v0 commerce strategy (updated 2026-05-01)

The earlier plan to stack three direct affiliate programs (one premium catalog brand + two DTC fills) was abandoned after none of those programs confirmed. The replacement is a single Rakuten LinkShare relationship through merchant **HerbsPro**, which carries many brands. We curate the brand list rather than the program — the user-facing label on every product is the brand, not the network. (Historical detail on the abandoned programs is in `docs/parking-lot.md`.)

### Curated brand list (9, as of 2026-05-01)
Source Naturals · Solgar · NOW Foods · Life Extension · Solaray · Jarrow Formulas · Bucked Up · PrimaForce · Nutricost.

Selection criteria: third-party-tested where possible, audience-recognizable names, broad coverage of the core SNP-driven stack, no proprietary blends in the products we surface.

### Coverage
16 of 18 catalog supplements have at least one curated-brand product mapped via `docs/catalogue/herbspro_products.csv`:

- **Mapped (16):** Methylfolate, Methyl-B12, Vitamin D3+K2, Omega-3, NAC, Berberine, Magnesium glycinate, Sulforaphane, CoQ10, Phosphatidylserine, NMN/NR (NR side only), Creatine monohydrate, L-carnitine, Lactase enzyme, Non-dairy calcium citrate, DAO enzyme.
- **Gap (2):** PQQ (no curated product yet) and Iron (avoidance rule — never gets supplemented). Both render as gap-state cards.

### Commission
**TBD pending partner confirmation.** Rakuten LinkShare commission rates vary by merchant program and aren't yet locked for HerbsPro. Update this section once confirmed.

### What this means for the app
- Each supplement recommendation card → 1–4 "Shop at \<Brand\>" buttons, each linking to a pre-tagged Rakuten deeplink (no runtime appending; URLs are committed verbatim).
- Gap state ("No shop yet") for PQQ and any future uncovered supplement.
- No practitioner needed for v0.
- No Fullscript integration needed for v0.
- Measure: click-through rate per brand, completed purchases, conversion from results → purchase.

## Reference: programs evaluated but not pursued

### Direct affiliate programs (declined / never confirmed)
The original v0 plan stacked three direct programs (a premium-catalog brand, a high-commission DTC weight-loss brand, and a greens/superfoods DTC brand). All three applications went unconfirmed and the plan was retired in favor of the Rakuten/HerbsPro feed. Specific brand names and prior commission rates are recorded in `docs/parking-lot.md` for posterity.

Other programs that were considered and not pursued: large-catalog general retailers (rates too low or cookies too short to be worth integrating).

### Dispensary models (deferred to v1)
| Program | Margin | Model | Notes |
|---|---|---|---|
| **Fullscript** | Up to **35%** (US) / 25% (CA) | Practitioner sets markup; you become seller of record | **v1 target.** Documented API, multi-brand catalog. |
| **Wholescripts (Xymogen)** | ~20–30% | Single-brand practitioner dispensary | Too narrow vs Fullscript. |

## Launch sequencing (updated 2026-05-01)

### v0 — Rakuten LinkShare via HerbsPro (now)
- Single affiliate relationship, 9 curated brands
- Commission TBD pending partner confirmation
- Brand-labeled product buttons on supplement recommendation cards
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

Detailed planning deliverable: Kanban task `3450a` (practitioner engagement framework) — held in backlog in the genomewell workspace (workspace path rename handled separately; see `build-deployment.md`).

## Open questions to resolve
- Rakuten LinkShare / HerbsPro commission confirmation
- Whether to expand the curated brand list (9 today; candidates if gaps appear: PQQ-carrying brand, NMN-side products for the NR/NMN supplement)
- Vitamin Labs API status (re-verify if strategy shifts toward white-label)
- State coverage map for family practitioners (v1)
- Malpractice / E&O insurance (~$3–10k/year for company-held policy, v1)
- Practitioner equity / retainer structure (v1)
