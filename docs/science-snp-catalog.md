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

## Current catalog state
- `src/engine/snpRules.ts` — 17 brief-curated SNPs (orphan code from parallel build)
- `src/snpCatalog.ts` — 31 SNPs (active in app)
- **Target post-expansion:** ~30 well-evidenced Tier 1 SNPs covering the core supplement rules

## Supplement evidence tiers

### Tier 1 — Strong SNP-supplement evidence (build rules)
~30–40 SNPs with defensible mappings:

- **Methylation / B-vitamins:** MTHFR, MTR, MTRR, CBS, BHMT, MTHFD1, COMT, FUT2, TCN2
- **Choline:** PEMT, CHDH
- **Vitamin A:** BCMO1 (×2)
- **Iron:** HFE, TMPRSS6
- **Selenium:** GPX1, SEPP1
- **Zinc:** SLC30A8
- **Magnesium:** TRPM6
- **CoQ10 / NAD:** NQO1, COQ2
- **Glutathione / detox:** GSTM1 null, GSTT1 null, NAT2, GSTP1
- **Statin-related:** HMGCR
- **Vitamin C:** SLC23A1
- **Inflammation:** IL6, TNFA
- Plus existing catalog: VDR, GC, FADS1, FADS2, SOD2, TCF7L2, APOE, PPARG, FTO, ACTN3, ACE, PPARGC1A, ADRB2

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
Tier 3 supplements can still be in the stack — but tied to user **goals**, not DNA. Example: "For your Energy goal, consider Urolithin A for mitochondrial function" (general recommendation, not personalized).

This distinction is a trust-builder, not a limitation.

## Scope decisions for v1
- **Stay focused on supplements** (not disease risk, cancer, or longevity predictions)
- **Add pharmacogenomics as v2 feature** — high trust, high value, low regulatory risk
- **Skip or heavily caveat cancer/longevity** until a clinical advisor is in place
