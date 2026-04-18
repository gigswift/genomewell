# Science & SNP Catalog

## What 23andMe/AncestryDNA chip data can actually tell you

### Strong signal (build rules here)
- **Pharmacogenomics:** CYP2C19, CYP2D6, VKORC1, DPYD — drug metabolism; clinically validated
- **High-effect variants:** APOE4, HFE, LRRK2/GBA, F5 Leiden — reliable chip coverage
- **Polygenic risk scores:** T2D, CAD, obesity, Alzheimer's — good populational signal, probabilistic individually

### Limited or unreliable
- **BRCA1/2:** 23andMe covers only 3 Ashkenazi founder variants — clinically insufficient. **Do not make cancer claims.**
- **Longevity:** weak signal; ~25% of lifespan variance is genetic; no meaningful individual prediction
- **Rare variants:** chips miss them by design; only WGS/WES catches them

### Critical caveat: ancestry bias
Most PRS models were trained on European-ancestry cohorts. They are **meaningfully less accurate for people of African descent** — sometimes so much less that the score is misleading. Any disease-risk feature for the target audience needs either:
- (a) models specifically validated on African-ancestry populations, or
- (b) explicit messaging about the limitation.

This is an ethical line, not a disclaimer formality.

## Current catalog state (prototype)
- `src/engine/snpRules.ts` — 17 brief-curated SNPs (orphan code from parallel build)
- `src/snpCatalog.ts` — 31 SNPs (active in app)
- Both need to be replaced with the v0 supplement catalog defined below

## Categories (decided 2026-04-16)

| Category | Description | Expected supplement density |
|---|---|---|
| **Daily Wellness** | Methylation, vitamins, minerals, metabolic health, antioxidant defense, inflammation | Highest — most recommendations land here |
| **Healthy Aging** | Cellular aging, mitochondrial function, brain aging, longevity-associated biology | Moderate — fewer but high-value recommendations |
| **Body Optimization** | Exercise physiology, muscle fiber, fat oxidation, recovery, injury risk. Supplement context only — no fitness programming | Moderate — supplement-informed, not workout-informed |
| **Food Sensitivity** | Lactose, caffeine, histamine, alcohol, bitter taste, gluten-related | Limited — more informational than supplement-driven |

## Supplement Catalog (v0)

Every row passes the supplement inclusion checklist in `CLAUDE.md`: explicit evidence tier, at least one primary SNP with published evidence, honest labeling, partner disclosed (or gap noted), not contradicted by a prior decision. Count is driven by the evidence bar — no target. Within each category, rows are ordered by evidence strength: SNP-driven (strong primary) first, SNP-informed (partial hooks) second.

Partner convention: `Thorne: <slug>` for the 8 supplements confirmed in `commerce-practitioner.md` (methylfolate, methyl-B12, D3+K2, omega-3, CoQ10, magnesium, NAC, berberine). All other rows use `Thorne: <slug-tbd>` — slug verification is deferred to the affiliate-integration task. `gap — no v0 partner` when no partner is evident. `n/a (avoidance, no commerce)` for skip-priority cards. BioTrust and Organifi don't overlap this catalog and aren't speculated into any row.

### Daily Wellness

| Supplement | Primary SNPs | Supporting SNPs | Default Dose | Partner Options | Evidence Tier |
|---|---|---|---|---|---|
| **Methylfolate (L-5-MTHF)** | rs1801133 MTHFR C677T; rs1801131 MTHFR A1298C; rs2236225 MTHFD1 | rs1805087 MTR; rs1801394 MTRR; rs4680 COMT; rs234706 CBS; rs3733890 BHMT; rs601338 FUT2 | 400–1000 mcg daily | Thorne: 5-mthf | SNP-driven |
| **Methyl-B12 (methylcobalamin)** | rs601338 FUT2; rs1805087 MTR; rs1801394 MTRR | rs1801133 MTHFR; rs234706 CBS; rs1801198 TCN2 | 1000 mcg daily | Thorne: methyl-b12 | SNP-driven |
| **Vitamin D3 + K2** | rs1544410 VDR BsmI; rs2282679 GC; rs10741657 CYP2R1 | rs12785878 DHCR7; rs4988235 LCT; rs1800795 IL6; rs7903146 TCF7L2 | 2000–5000 IU D3 + 100 mcg MK-7 daily, with fat (GC minor allele → 5000 IU) | Thorne: d3-k2 | SNP-driven |
| **Omega-3 (EPA/DHA, marine)** | rs174537 FADS1; rs1535 FADS2; rs953413 ELOVL2 | rs429358 + rs7412 APOE; rs7903146 TCF7L2; rs1801282 PPARG; rs1800795 IL6; rs1800629 TNFA; rs17238540 HMGCR; rs708272 CETP; rs1042713 ADRB2; rs8192678 PPARGC1A | 2 g combined EPA/DHA daily, with food | Thorne: omega-3 | SNP-driven |
| **NAC (N-acetyl cysteine)** | rs1695 GSTP1 | GSTM1-null; GSTT1-null; rs4880 SOD2; rs1050450 GPX1; rs1799930 NAT2 | 600 mg twice daily | Thorne: nac | SNP-driven |
| **Berberine** | rs7903146 TCF7L2; rs1801282 PPARG | rs9939609 FTO; rs1801278 IRS1; rs5400 SLC2A2 | 500 mg 2–3× daily with meals | Thorne: berberine | SNP-driven |
| **Magnesium (glycinate)** | rs11144134 TRPM6 | rs4680 COMT; rs1801133 MTHFR; rs1544410 VDR | 200–400 mg elemental daily | Thorne: magnesium-bisglycinate | SNP-informed |
| **Sulforaphane (broccoli sprout)** | rs1695 GSTP1 | GSTM1-null; GSTT1-null; rs6721961 NFE2L2 | 10–30 mg SGS daily | Thorne: \<slug-tbd\> | SNP-informed |

### Healthy Aging

| Supplement | Primary SNPs | Supporting SNPs | Default Dose | Partner Options | Evidence Tier |
|---|---|---|---|---|---|
| **CoQ10 (ubiquinol)** | rs1800566 NQO1; rs4880 SOD2 | rs17238540 HMGCR; rs4693570 COQ2; rs8192678 PPARGC1A | 100–200 mg ubiquinol daily with fat | Thorne: coq10 | SNP-driven |
| **Phosphatidylserine (PS)** | rs429358 + rs7412 APOE (E4 carriers only) | rs6265 BDNF; rs1800795 IL6 | 100 mg 3× daily (E4 carriers) | Thorne: \<slug-tbd\> | SNP-driven (E4-gated) |
| **NMN / NR (NAD⁺ precursor)** | rs1800566 NQO1 | rs4880 SOD2; rs2802292 FOXO3; rs3758391 SIRT1 | 300 mg NR or 500 mg NMN daily | Thorne: \<slug-tbd\> | SNP-informed |

### Body Optimization

| Supplement | Primary SNPs | Supporting SNPs | Default Dose | Partner Options | Evidence Tier |
|---|---|---|---|---|---|
| **Creatine monohydrate** | rs1815739 ACTN3 | rs4343 ACE; rs8192678 PPARGC1A | 3–5 g daily | Thorne: creatine | SNP-driven (ACTN3 XX genotype benefits most; dose not genotype-titrated) |
| **L-carnitine (tartrate)** | rs1042713 ADRB2 | rs8192678 PPARGC1A; rs4343 ACE; rs762551 CYP1A2 | 1–2 g daily | Thorne: \<slug-tbd\> | SNP-driven |
| **PQQ** | rs8192678 PPARGC1A | rs4880 SOD2 | 10–20 mg daily | Thorne: \<slug-tbd\> | SNP-informed |

### Food Sensitivity

| Supplement | Primary SNPs | Supporting SNPs | Default Dose | Partner Options | Evidence Tier |
|---|---|---|---|---|---|
| **Lactase enzyme** | rs4988235 LCT | — | 3000–9000 FCC units with dairy meals | Thorne: \<slug-tbd\> | SNP-driven |
| **Non-dairy calcium (citrate)** | rs4988235 LCT | rs1544410 VDR; rs2282679 GC | 500–1000 mg daily | Thorne: \<slug-tbd\> | SNP-driven |
| **DAO enzyme (histamine intolerance)** | rs10156191 AOC1; rs1049742 AOC1 | rs1800629 TNFA | 10,000 HDU before histamine-rich meals | gap — no v0 partner | SNP-driven |
| **Iron — SKIP if HFE carrier** | rs1799945 HFE H63D; rs1800562 HFE C282Y | — | Skip priority; no supplementation recommended | n/a (avoidance, no commerce) | SNP-driven |

## SNP Reference (v0 ceiling: 60)

v0 catalog uses 60 SNPs — the union of all primary and supporting SNPs referenced in the supplement catalog above. SNPs beyond 60 are out-of-scope for v0.

**Current catalog references 51 unique variants** (49 rsids + GSTM1-null and GSTT1-null CNVs). Padding toward 60 is explicitly disallowed — additional SNPs must come from new evidence-gated supplement rules, not from bolting more supporting SNPs onto existing rules.

Each SNP is listed once, under the category where its primary role sits (or, for supporting-only SNPs, under the category of the supplement they most prominently inform).

### Daily Wellness (33 variants)

| rsid | Gene | Role | Informs |
|---|---|---|---|
| rs1801133 | MTHFR C677T | primary | Methylfolate (supporting: Methyl-B12, Magnesium) |
| rs1801131 | MTHFR A1298C | primary | Methylfolate |
| rs2236225 | MTHFD1 | primary | Methylfolate |
| rs601338 | FUT2 | primary | Methyl-B12 (supporting: Methylfolate) |
| rs1805087 | MTR | primary | Methyl-B12 (supporting: Methylfolate) |
| rs1801394 | MTRR | primary | Methyl-B12 (supporting: Methylfolate) |
| rs1544410 | VDR BsmI | primary | D3+K2 (supporting: Magnesium, Non-dairy calcium) |
| rs2282679 | GC | primary | D3+K2 (supporting: Non-dairy calcium) |
| rs10741657 | CYP2R1 | primary | D3+K2 |
| rs174537 | FADS1 | primary | Omega-3 |
| rs1535 | FADS2 | primary | Omega-3 |
| rs953413 | ELOVL2 | primary | Omega-3 |
| rs1695 | GSTP1 | primary | NAC, Sulforaphane |
| rs7903146 | TCF7L2 | primary | Berberine (supporting: D3+K2, Omega-3) |
| rs1801282 | PPARG | primary | Berberine (supporting: Omega-3) |
| rs11144134 | TRPM6 | primary | Magnesium |
| rs4680 | COMT | supporting | Methylfolate, Magnesium |
| rs234706 | CBS | supporting | Methylfolate, Methyl-B12 |
| rs3733890 | BHMT | supporting | Methylfolate |
| rs1801198 | TCN2 | supporting | Methyl-B12 |
| rs12785878 | DHCR7 | supporting | D3+K2 |
| rs1800795 | IL6 | supporting | D3+K2, Omega-3, Phosphatidylserine |
| rs1800629 | TNFA | supporting | Omega-3, DAO enzyme |
| rs17238540 | HMGCR | supporting | Omega-3, CoQ10 |
| rs708272 | CETP | supporting | Omega-3 |
| rs1050450 | GPX1 | supporting | NAC |
| rs1799930 | NAT2 | supporting | NAC |
| rs9939609 | FTO | supporting | Berberine |
| rs1801278 | IRS1 | supporting | Berberine |
| rs5400 | SLC2A2 | supporting | Berberine |
| rs6721961 | NFE2L2 | supporting | Sulforaphane |
| GSTM1-null¹ | GSTM1 | supporting | NAC, Sulforaphane |
| GSTT1-null¹ | GSTT1 | supporting | NAC, Sulforaphane |

### Healthy Aging (8 variants)

| rsid | Gene | Role | Informs |
|---|---|---|---|
| rs429358 | APOE (ε4 tag) | primary | Phosphatidylserine (supporting: Omega-3) |
| rs7412 | APOE (ε2 tag) | primary | Phosphatidylserine (supporting: Omega-3) |
| rs1800566 | NQO1 | primary | CoQ10, NMN/NR |
| rs4880 | SOD2 | primary | CoQ10 (supporting: NAC, NMN/NR, PQQ) |
| rs4693570 | COQ2 | supporting | CoQ10 |
| rs6265 | BDNF | supporting | Phosphatidylserine |
| rs2802292 | FOXO3 | supporting | NMN/NR |
| rs3758391 | SIRT1 | supporting | NMN/NR |

### Body Optimization (5 variants)

| rsid | Gene | Role | Informs |
|---|---|---|---|
| rs1815739 | ACTN3 | primary | Creatine |
| rs1042713 | ADRB2 | primary | L-carnitine (supporting: Omega-3) |
| rs8192678 | PPARGC1A | primary | PQQ (supporting: Omega-3, CoQ10, Creatine, L-carnitine) |
| rs4343 | ACE | supporting | Creatine, L-carnitine |
| rs762551 | CYP1A2 | supporting | L-carnitine (exercise context) |

### Food Sensitivity (5 variants)

| rsid | Gene | Role | Informs |
|---|---|---|---|
| rs4988235 | LCT | primary | Lactase enzyme, Non-dairy calcium (supporting: D3+K2) |
| rs10156191 | AOC1 | primary | DAO enzyme |
| rs1049742 | AOC1 | primary | DAO enzyme |
| rs1799945 | HFE H63D | primary | Iron (skip if carrier) |
| rs1800562 | HFE C282Y | primary | Iron (skip if carrier) |

¹ GSTM1-null and GSTT1-null are copy-number variants (full gene deletions), not SNPs. 23andMe and AncestryDNA chip coverage of these CNVs is inconsistent; when genotype data is unavailable, the engine should fall back to neutral reasoning rather than assume one call or the other. Treat chip coverage as a verification task, not an assumed given.

### Excluded for v0

The following SNPs from earlier drafts do not appear in any v0 catalog row and are out-of-scope:

- **Rich-tier draft additions** (PEMT, TMPRSS6, KLOTHO, MSTN, COL1A1, UCP2, ADORA2A, TAS2R38) — no v0 supplement rule references them.
- **CYP1A2 caffeine-timing** — caffeine timing guidance is not a supplement purchase; CYP1A2 is retained as supporting-only for L-carnitine (exercise context).
- **ACE I/D indel (rs1799752)** — the SNP-form tag (rs4343) is used instead; rs1799752 is an insertion/deletion polymorphism with inconsistent chip coverage.

## Supplement evidence tiers (for non-SNP-driven supplements)

### Tier 2 — Mechanistic rationale (not prescription)
- **Ashwagandha / adaptogens:** FKBP5, NR3C1 (cortisol pathway) — plausible, not proven; excluded from v0
- **Curcumin:** IL6, TNFA, CRP as inflammation hooks — mechanistic, not prescription; excluded from v0
- **Chromium:** TCF7L2, PPARG overlap with berberine but clinical effect is weaker; excluded from v0 to avoid double-counting the glycemic signal

Note: Creatine has CKM/CKMT2 dose-titration variants that are not validated, but ACTN3 R577X (rs1815739) has published evidence that XX-genotype carriers benefit most. Creatine is therefore included in the v0 catalog as SNP-driven for inclusion-gating only, with a fixed 3–5 g daily dose rather than a genotype-titrated one.

### Tier 3 — NOT SNP-guided (be honest)
- **Urolithin A:** gut microbiome-dependent, not genetic (~40% are "producers"). Requires stool test, not DNA.
- **Astaxanthin:** general antioxidant; no SNP-guided protocol
- **Tongkat Ali:** no pharmacogenomic data
- **Peptides (BPC-157, TB-500, GHK-Cu):** not SNP-guided
- **Apple cider vinegar, cinnamon:** glycemic modulators; existing TCF7L2/PPARG/FTO rationale gives general direction, but no SNP tells you they'll work for you specifically

### Selling trendy supplements honestly
Tier 3 supplements can still be in the stack — tied to user **goals**, not DNA. Example: "For your Energy goal, consider Urolithin A for mitochondrial function" (general recommendation, not personalized). This distinction is a trust-builder, not a limitation.

---

## ✅ DECIDED 2026-04-17: Supplement-centric architecture

The recommender engine is supplement-centric. Each `SupplementRule` owns a set of primary drivers (1–3 SNPs) and supporting modulators (3–10 SNPs) and evaluates them against the user's genotype map. One rule produces one card.

### Rationale

- **Commerce alignment.** v0 revenue is Thorne affiliate. Supplement-centric produces one card per supplement → one affiliate link per card. SNP-centric produces N cards that must be deduped into supplements anyway, losing reasoning along the way.
- **Collapses the multi-SNP-one-supplement problem.** Omega-3 is informed by ~12 SNPs. Iterating SNPs produces conflicting, repetitive output. Iterating supplements produces one card that synthesizes primary drivers + supporting context.
- **Richer reasoning = higher purchase confidence.** "Your FADS1 + APOE + IL6 profile together suggest X" converts better than three separate SNP cards pointing at the same bottle.
- **Escape hatch for conflicts.** Conflicting primary drivers → flag for practitioner discussion (v1 Fullscript / family-practitioner path). SNP-centric has nowhere to surface "these signals disagree."
- **Editorial moat.** Curating supplement rules — which SNPs drive, which modulate, how — is the editorial moat called out in `product-strategy.md`. The parsing engine is not a moat; the rule authorship is.
- **Keeps Tier 2/3 supplements addressable.** Goal-driven supplements (Urolithin A, adaptogens) slot in as rules with no primary SNPs and surface via goals, not DNA, without forcing a second code path.

### TypeScript interface sketch (doc artifact — not yet in `src/`)

```ts
// Shape reference for the engine rebuild. src/ is rewritten against this shape
// in a separate task; this block is documentation, not authoritative code.

type Genotype = string;                    // e.g. "CT", "GG", "--" for no-call
type Priority = 'essential' | 'recommended' | 'consider' | 'skip';
type Confidence = 'high' | 'medium' | 'flagged-conflict' | 'insufficient-data';
type Category =
  | 'daily-wellness'
  | 'healthy-aging'
  | 'body-optimization'
  | 'food-sensitivity';

interface SNPReference {
  rsid: string;
  gene: string;
  role: 'primary' | 'supporting';
  effect: string;                           // human-readable; shown in reasoning
}

interface SupplementEvaluation {
  recommend: boolean;
  priority: Priority;
  dosage: string;                           // e.g. "2g combined EPA/DHA daily"
  reasoning: string[];                      // user-facing sentences
  firedPrimary: string[];                   // rsids of primaries that contributed
  firedSupporting: string[];                // rsids of supporting SNPs that modulated
  confidence: Confidence;
}

interface SupplementRule {
  supplement: string;                       // display name
  category: Category;
  defaultDosage: string;
  primarySNPs: SNPReference[];              // 1–3 drivers
  supportingSNPs: SNPReference[];           // 3–10 modulators
  evaluate(snpMap: Map<string, Genotype>): SupplementEvaluation;
}

// Engine shape: iterate SupplementRule[], not SNPRule[].
// const stack = SUPPLEMENT_RULES
//   .map(rule => ({ rule, result: rule.evaluate(snpMap) }))
//   .filter(({ result }) => result.recommend);
```

### Worked example 1: Omega-3 (EPA/DHA)

**Primary drivers (3 SNPs):**

| rsid | Gene | Signal |
|---|---|---|
| rs174537 | FADS1 | ALA→EPA conversion — GG = poor converter, must supplement |
| rs1535 | FADS2 | Same desaturase pathway, reinforces FADS1 |
| rs953413 | ELOVL2 | EPA→DHA elongation step |

**Supporting context (8–9 SNPs):**

| rsid | Gene | How it modulates |
|---|---|---|
| rs429358 + rs7412 | APOE | E4 carriers benefit more (neuro + lipid) → increases priority |
| rs7903146 | TCF7L2 | T2D risk → omega-3 improves insulin sensitivity → increases priority |
| rs1801282 | PPARG | Insulin sensitivity → modulates dosage |
| rs1800795 | IL6 | Pro-inflammatory genotype → increases priority |
| rs1800629 | TNFA | Same as IL6 → increases priority |
| rs17238540 | HMGCR | Cholesterol → omega-3 lowers triglycerides → contextual |
| rs708272 | CETP | HDL metabolism → contextual |
| rs1042713 | ADRB2 | Reduced fat oxidation → omega-3 supports fat metabolism |
| rs8192678 | PPARGC1A | Mitochondrial biogenesis → omega-3 supports membranes |

**User sees one card:**
> **Omega-3 (EPA/DHA)** — Essential
>
> Your FADS1 gene shows reduced ability to convert plant-based omega-3 into EPA/DHA. Plant sources like flaxseed aren't enough — you'd benefit from a marine-sourced omega-3.
>
> Your APOE profile and inflammation markers suggest this is especially important for cardiovascular and cognitive health.
>
> **Suggested:** 2g combined EPA/DHA daily
> *Based on: FADS1, FADS2, ELOVL2 (primary) + APOE, IL6, PPARG (supporting)*

### Worked example 2: Vitamin D3 + K2

Chosen as the second worked example for African-ancestry relevance: rs2282679 (GC) has a strong effect and the target audience is meaningfully impacted.

**Primary drivers (3 SNPs):**

| rsid | Gene | Signal |
|---|---|---|
| rs1544410 | VDR | Receptor efficiency — AA/GA reduces vitamin D utilization at the cellular level |
| rs2282679 | GC | Vitamin D binding protein — minor allele reduces circulating 25(OH)D; effect size is elevated in African-ancestry populations |
| rs10741657 | CYP2R1 | 25-hydroxylase — variants reduce conversion of D3 to active 25(OH)D |

**Supporting context (4 SNPs):**

| rsid | Gene | How it modulates |
|---|---|---|
| rs12785878 | DHCR7 | 7-dehydrocholesterol reductase — affects cutaneous D3 synthesis; reinforces supplementation case |
| rs4988235 | LCT | Lactase persistence — lactose non-persistence implies reduced dairy/calcium intake → K2 co-factor matters more |
| rs1800795 | IL6 | Pro-inflammatory genotype → vitamin D's immunomodulatory effect becomes higher-value → increases priority |
| rs7903146 | TCF7L2 | T2D risk → vitamin D's insulin-sensitivity contribution becomes higher-value → increases priority |

**Evaluation logic:**
1. Any primary firing → `recommend: true`, `priority: recommended`.
2. Two or more primaries firing → `priority: essential`.
3. GC minor allele carried (African-ancestry context) → dosage bumped from baseline (e.g. 2000 IU → 4000–5000 IU D3), K2 MK-7 paired by default.
4. Supporting SNPs do not change `recommend`, only priority / dosage / reasoning text.
5. All three primaries wild-type and no supporting SNPs firing → `recommend: false`, `confidence: insufficient-data`. Winter / latitude guidance still lives at the product layer; the engine stays silent.

**User sees one card:**
> **Vitamin D3 + K2** — Essential
>
> Your GC and VDR profile indicates both lower circulating vitamin D and reduced receptor efficiency. The GC variant you carry has a stronger effect in people of African ancestry, so standard-dose D3 is unlikely to get you into the optimal range.
>
> Your inflammation and metabolic profile (IL6, TCF7L2) make vitamin D's anti-inflammatory and insulin-sensitizing effects especially relevant for you.
>
> **Suggested:** 5000 IU D3 + 100 mcg MK-7 (K2) daily, with fat
> *Based on: VDR, GC, CYP2R1 (primary) + IL6, TCF7L2 (supporting)*

### Multi-SNP supplement map (draft — top supplements)

| Supplement | Primary SNPs | Supporting SNPs | Total SNPs |
|---|---|---|---|
| Omega-3 (EPA/DHA) | FADS1, FADS2, ELOVL2 | APOE, TCF7L2, PPARG, IL6, TNFA, HMGCR, CETP, ADRB2, PPARGC1A | ~12–15 |
| Vitamin D3 + K2 | VDR, GC, CYP2R1 | DHCR7, LCT (calcium), IL6, TCF7L2 | ~8–10 |
| Methylfolate | MTHFR, MTHFD1 | MTR, MTRR, CBS, COMT, BHMT, FUT2 | ~8–10 |
| Methyl-B12 | FUT2, MTR, MTRR | MTHFR, TCN2, CBS | ~6–8 |
| CoQ10 | NQO1, SOD2 | HMGCR, COQ2, PPARGC1A | ~6–8 |
| NAC / Glutathione | GSTP1, GSTM1, GSTT1 | NAT2, SOD2, GPX1 | ~6–8 |
| Magnesium | TRPM6 | COMT, MTHFR, VDR | ~5–6 |
| Phosphatidylserine | APOE (E4 specific) | BDNF, IL6 | ~3–4 |
| NMN / NR (NAD precursor) | NQO1 | SOD2, FOXO3, SIRT1 | ~4–5 |
| L-carnitine | ADRB2 | PPARGC1A, ACE, CPT1A | ~4–5 |
| Berberine | TCF7L2, PPARG | FTO, IRS1, SLC2A2 | ~4–6 |

### Edge cases

**(a) One SNP informs multiple supplements.** APOE (rs429358 + rs7412) is a *supporting* SNP for Omega-3 (E4 carriers → increased priority via neuro + lipid benefit) and a *primary* SNP for Phosphatidylserine (E4-specific driver). This is expected, not a conflict. Each `SupplementRule.evaluate()` consumes the shared `snpMap` independently; the same genotype legitimately carries different weight in different supplement contexts. The dedupe problem from SNP-centric disappears because iteration is over supplements, so APOE never produces two separate cards.

**(b) Conflicting primary drivers.** Example shape: one primary says "poor converter, supplement" and another primary in the same rule implies "elevated baseline, supplementation unnecessary." Resolution: return `confidence: 'flagged-conflict'`, downgrade `priority` to `consider`, and include both sides in `reasoning`. In v0 (no practitioner) this surfaces as a "discuss with a clinician before supplementing" note on the card; in v1 it routes into the Fullscript / practitioner flow. The engine never silently picks a winner between conflicting primaries.

**(c) Supplements with only supporting SNPs firing (no primaries).** If `firedPrimary` is empty but `firedSupporting` is non-empty, return `recommend: false`. The engine does not promote Tier 2/3 supplements on supporting signal alone — those remain goal-driven per the existing Tier 2/3 framing. This preserves the "tied to goals, not DNA" honesty line from the *Selling trendy supplements honestly* section above.

### Migration note

`src/engine/snpRules.ts` (17 SNPs, orphan) and `src/snpCatalog.ts` (31 SNPs, active) both iterate SNPs and dedupe supplements downstream. Both are replaced by a new module (e.g. `src/engine/supplementRules.ts`) that exports a `SupplementRule[]` populated from the Supplement Catalog (v0) section above. `snpCatalog.ts` demotes to a reference dataset — rsid → gene → description — used by `SupplementRule.evaluate()` implementations for genotype lookup and reasoning strings, but no longer the iteration driver. The results page renders `supplementRules.map(r => r.evaluate(userSnpMap)).filter(x => x.recommend)` as one card per supplement, matching the commerce surface one-to-one. Engine rebuild is a separate task; this section records the decision and the shape the rebuild must hit.

---

## Scope decisions
- **Stay focused on supplements** (not disease risk, cancer, or longevity predictions)
- **Add pharmacogenomics as v2 feature** — high trust, high value, low regulatory risk
- **Skip or heavily caveat cancer/longevity** until a clinical advisor is in place
- **Categories are final:** Daily Wellness, Healthy Aging, Body Optimization, Food Sensitivity
- **v0 SNP set** = the union of primary + supporting SNPs referenced by the supplement catalog (see Supplement Catalog (v0) section). Current count: 51 variants. Ceiling: 60.
