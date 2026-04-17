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
- Both need to be replaced with the MVP catalog defined below

## Categories (decided 2026-04-16)

| Category | Description | Expected supplement density |
|---|---|---|
| **Daily Wellness** | Methylation, vitamins, minerals, metabolic health, antioxidant defense, inflammation | Highest — most recommendations land here |
| **Healthy Aging** | Cellular aging, mitochondrial function, brain aging, longevity-associated biology | Moderate — fewer but high-value recommendations |
| **Body Optimization** | Exercise physiology, muscle fiber, fat oxidation, recovery, injury risk. Supplement context only — no fitness programming | Moderate — supplement-informed, not workout-informed |
| **Food Sensitivity** | Lactose, caffeine, histamine, alcohol, bitter taste, gluten-related | Limited — more informational than supplement-driven |

## SNP tiers

| Tier | Target count | Principle |
|---|---|---|
| **MVP (lean)** | ~20 | Highest-confidence, every SNP ties to a concrete supplement action |
| **Rich (recommended v1)** | ~40 | Adds second-tier SNPs that genuinely change recommendations beyond MVP |
| **Exhaustive** | ~95–150 | Academic completeness; includes weaker/specialized effects |

### Per-category breakdown

| Category | MVP | Rich | Exhaustive |
|---|---|---|---|
| Daily Wellness | 10 | 20 | 50–80 |
| Healthy Aging | 3 | 6 | 15–25 |
| Body Optimization | 4 | 8 | 20–30 |
| Food Sensitivity | 3 | 6 | 10–15 |

### MVP SNP set (decided)

**Daily Wellness (10):**

| rsid | Gene | What it tells you | Supplement tie |
|---|---|---|---|
| rs1801133 | MTHFR | Folate metabolism efficiency | Methylfolate vs folic acid |
| rs1805087 | MTR | B12 utilization | Methylcobalamin |
| rs1801394 | MTRR | B12 recycling | Methyl-B12 dosing |
| rs4680 | COMT | Methylation + stress response | Magnesium, SAMe caution |
| rs1544410 | VDR | Vitamin D receptor efficiency | Higher D3 dose |
| rs2282679 | GC | Vitamin D binding protein (**strong African ancestry effect**) | Significantly higher D3 + K2 |
| rs174537 | FADS1 | Omega-3 ALA→EPA conversion | Preformed marine omega-3 |
| rs7903146 | TCF7L2 | T2D risk (**T allele more common in African ancestry**) | Berberine, chromium |
| rs1801282 | PPARG | Insulin sensitivity | Omega-3, lower carb response |
| rs1695 | GSTP1 | Glutathione / detox capacity | NAC, sulforaphane |

**Healthy Aging (3):**

| rsid | Gene | What it tells you | Supplement tie |
|---|---|---|---|
| rs429358 + rs7412 | APOE | Lipid metabolism / APOE genotype | Low sat fat, phosphatidylserine if E4 |
| rs4880 | SOD2 | Mitochondrial antioxidant defense | CoQ10, MitoQ |
| rs1800566 | NQO1 | CoQ10 / NAD pathway | CoQ10, NMN / NR |

**Body Optimization (4):**

| rsid | Gene | What it tells you | Supplement tie |
|---|---|---|---|
| rs1815739 | ACTN3 | Muscle fiber composition | Creatine, recovery protocol |
| rs1799752 | ACE | Cardiovascular / endurance efficiency | L-carnitine, electrolytes |
| rs8192678 | PPARGC1A | Mitochondrial biogenesis | CoQ10, PQQ |
| rs1042713 | ADRB2 | Fat oxidation during exercise | L-carnitine, fasted cardio protocol |

**Food Sensitivity (3):**

| rsid | Gene | What it tells you | Supplement tie |
|---|---|---|---|
| rs4988235 | LCT | Lactose persistence | Non-dairy calcium sources |
| rs1799945 | HFE | Iron absorption | **Avoid** iron supplementation |
| rs762551 | CYP1A2 | Caffeine metabolism speed | Caffeine timing guidance |

### Rich tier additions (draft — pending full 150-SNP catalog review)

**Daily Wellness (+10):** MTHFD1, CBS, BHMT, FUT2, PEMT, CYP2R1, DHCR7, TMPRSS6, IL6, TNFA
**Healthy Aging (+3):** FOXO3, KLOTHO, BDNF
**Body Optimization (+4):** MSTN, CYP1A2 (exercise context), COL1A1, UCP2
**Food Sensitivity (+3):** ADORA2A, TAS2R38, DAO/AOC1

### Exhaustive tier
Full ~150-SNP reference catalog being compiled separately via Claude. Will be integrated after review.

## Supplement evidence tiers (for non-SNP-driven supplements)

### Tier 2 — Mechanistic rationale (not prescription)
- **Creatine:** CKM / CKMT2 variants exist; no SNP-guided dosing validated
- **Ashwagandha / adaptogens:** FKBP5, NR3C1 (cortisol pathway) — plausible, not proven
- **Curcumin:** IL6, TNFA, CRP as inflammation hooks

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
| Berberine / chromium | TCF7L2, PPARG | FTO, IRS1, SLC2A2 | ~4–6 |

### Edge cases

**(a) One SNP informs multiple supplements.** APOE (rs429358 + rs7412) is a *supporting* SNP for Omega-3 (E4 carriers → increased priority via neuro + lipid benefit) and a *primary* SNP for Phosphatidylserine (E4-specific driver). This is expected, not a conflict. Each `SupplementRule.evaluate()` consumes the shared `snpMap` independently; the same genotype legitimately carries different weight in different supplement contexts. The dedupe problem from SNP-centric disappears because iteration is over supplements, so APOE never produces two separate cards.

**(b) Conflicting primary drivers.** Example shape: one primary says "poor converter, supplement" and another primary in the same rule implies "elevated baseline, supplementation unnecessary." Resolution: return `confidence: 'flagged-conflict'`, downgrade `priority` to `consider`, and include both sides in `reasoning`. In v0 (no practitioner) this surfaces as a "discuss with a clinician before supplementing" note on the card; in v1 it routes into the Fullscript / practitioner flow. The engine never silently picks a winner between conflicting primaries.

**(c) Supplements with only supporting SNPs firing (no primaries).** If `firedPrimary` is empty but `firedSupporting` is non-empty, return `recommend: false`. The engine does not promote Tier 2/3 supplements on supporting signal alone — those remain goal-driven per the existing Tier 2/3 framing. This preserves the "tied to goals, not DNA" honesty line from the *Selling trendy supplements honestly* section above.

### Migration note

`src/engine/snpRules.ts` (17 SNPs, orphan) and `src/snpCatalog.ts` (31 SNPs, active) both iterate SNPs and dedupe supplements downstream. Both are replaced by a new module (e.g. `src/engine/supplementRules.ts`) that exports a `SupplementRule[]` keyed on the multi-SNP map above, growing toward the 42-supplement catalog. `snpCatalog.ts` demotes to a reference dataset — rsid → gene → description — used by `SupplementRule.evaluate()` implementations for genotype lookup and reasoning strings, but no longer the iteration driver. The results page renders `supplementRules.map(r => r.evaluate(userSnpMap)).filter(x => x.recommend)` as one card per supplement, matching the commerce surface one-to-one. Engine rebuild is a separate task; this section records the decision and the shape the rebuild must hit.

---

## Scope decisions
- **Stay focused on supplements** (not disease risk, cancer, or longevity predictions)
- **Add pharmacogenomics as v2 feature** — high trust, high value, low regulatory risk
- **Skip or heavily caveat cancer/longevity** until a clinical advisor is in place
- **Categories are final:** Daily Wellness, Healthy Aging, Body Optimization, Food Sensitivity
- **MVP = 20 SNPs** across 4 categories; Rich = ~40; Exhaustive = ~150
