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

## ⚠ OPEN DECISION: Supplement-centric architecture

**Status: Under discussion — not yet decided. Review before implementation.**

### The problem with SNP-centric recommendations

The current prototype iterates SNPs → each produces a recommendation → deduplicates supplements at the end. This breaks down when 12 SNPs all say something about Omega-3 with varying confidence and direction.

### The proposed alternative: supplement-centric evaluation

Instead of `SNPRule → interpret(genotype) → recommendation`, flip it:

```
SupplementRule {
  supplement: name, default dosage, category
  primarySNPs: [rsid, gene, how it affects this supplement]
  supportingSNPs: [rsid, gene, how it modulates]
  evaluate(snpMap) → { recommend, priority, dosage, reasoning }
}
```

For each supplement in the catalog:
1. **Primary drivers** (1–3 SNPs) set the base recommendation
2. **Supporting SNPs** (3–10) modulate priority and dosage
3. If primaries agree → clear recommendation with confidence
4. If supporting SNPs reinforce → increase priority/dosage
5. If primaries conflict (rare) → flag as "discuss with practitioner"
6. Output one unified card per supplement, not one card per SNP

### Example: Omega-3 supplement rule

**Primary drivers (3 SNPs):**
| rsid | Gene | Signal |
|---|---|---|
| rs174537 | FADS1 | ALA→EPA conversion — GG = poor converter, must supplement |
| rs1535 | FADS2 | Same desaturase pathway, reinforces FADS1 |
| rs953413 | ELOVL2 | EPA→DHA elongation step |

**Supporting context (8–12 SNPs):**
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

### Why this matters for the business model

The supplement-centric model aligns directly with the affiliate commerce model:
- Each supplement card IS a product recommendation → affiliate link
- One card per supplement → one buy button per recommendation
- Richer reasoning → higher purchase confidence → higher conversion
- The "12 SNPs all mention omega-3 in different ways" problem goes away

### Decision needed
Should the recommender engine be rebuilt as supplement-centric before implementation? Or should the MVP ship with the current SNP-centric model and refactor later?

---

## Scope decisions
- **Stay focused on supplements** (not disease risk, cancer, or longevity predictions)
- **Add pharmacogenomics as v2 feature** — high trust, high value, low regulatory risk
- **Skip or heavily caveat cancer/longevity** until a clinical advisor is in place
- **Categories are final:** Daily Wellness, Healthy Aging, Body Optimization, Food Sensitivity
- **MVP = 20 SNPs** across 4 categories; Rich = ~40; Exhaustive = ~150
