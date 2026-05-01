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

Every row passes the supplement inclusion checklist in `CLAUDE.md`: explicit evidence tier, at least one primary SNP with published evidence, honest labeling, brand disclosed (or gap noted), not contradicted by a prior decision. Count is driven by the evidence bar — no target. Within each category, rows are ordered by evidence strength: SNP-driven (strong primary) first, SNP-informed (partial hooks) second.

Brand convention: comma-separated list of brand display names per row. The full set of curated brands lives in `docs/catalogue/herbspro_products.csv` (70 rows, all from the Rakuten LinkShare / HerbsPro feed). One product per `(supplement, brand)` pair (first CSV row wins). `gap — no v0 brand` when no curated brand carries a matching product. `n/a (avoidance, no commerce)` for skip-priority cards. URLs in the CSV are pre-tagged Rakuten deeplinks — no env-var affiliate IDs in code.

### Daily Wellness

| Supplement | Primary SNPs | Supporting SNPs | Default Dose | Brand Options | Evidence Tier |
|---|---|---|---|---|---|
| **Methylfolate (L-5-MTHF)** | rs1801133 MTHFR C677T; rs1801131 MTHFR A1298C; rs2236225 MTHFD1 | rs1805087 MTR; rs1801394 MTRR; rs4680 COMT; rs234706 CBS; rs3733890 BHMT; rs601338 FUT2 | 400–1000 mcg daily | Source Naturals, Solgar, NOW Foods, Life Extension | SNP-driven |
| **Methyl-B12 (methylcobalamin)** | rs601338 FUT2; rs1805087 MTR; rs1801394 MTRR | rs1801133 MTHFR; rs234706 CBS; rs1801198 TCN2 | 1000 mcg daily | NOW Foods, Solaray, Jarrow Formulas | SNP-driven |
| **Vitamin D3 + K2** | rs1544410 VDR BsmI; rs2282679 GC; rs10741657 CYP2R1 | rs12785878 DHCR7; rs4988235 LCT; rs1800795 IL6; rs7903146 TCF7L2 | 2000–5000 IU D3 + 100 mcg MK-7 daily, with fat (GC minor allele → 5000 IU) | Solaray, NOW Foods, Source Naturals | SNP-driven |
| **Omega-3 (EPA/DHA, marine)** | rs174537 FADS1; rs1535 FADS2; rs953413 ELOVL2 | rs429358 + rs7412 APOE; rs7903146 TCF7L2; rs1801282 PPARG; rs1800795 IL6; rs1800629 TNFA; rs17238540 HMGCR; rs708272 CETP; rs1042713 ADRB2; rs8192678 PPARGC1A | 2 g combined EPA/DHA daily, with food | Solaray, NOW Foods | SNP-driven |
| **NAC (N-acetyl cysteine)** | rs1695 GSTP1 | GSTM1-null; GSTT1-null; rs4880 SOD2; rs1050450 GPX1; rs1799930 NAT2 | 600 mg twice daily | NOW Foods, Solaray | SNP-driven |
| **Berberine** | rs7903146 TCF7L2; rs1801282 PPARG | rs9939609 FTO; rs1801278 IRS1; rs5400 SLC2A2 | 500 mg 2–3× daily with meals | Source Naturals, Solaray, NOW Foods | SNP-driven |
| **Magnesium (glycinate)** | rs11144134 TRPM6 | rs4680 COMT; rs1801133 MTHFR; rs1544410 VDR | 200–400 mg elemental daily | NOW Foods, Solaray, Source Naturals | SNP-informed |
| **Sulforaphane (broccoli sprout)** | rs1695 GSTP1 | GSTM1-null; GSTT1-null; rs6721961 NFE2L2 | 10–30 mg SGS daily | Solaray, Source Naturals | SNP-informed |

**Copy — felt effects & context**

- **Methylfolate (L-5-MTHF)**
  - *Feels like:* When methylation runs slow, it usually shows up as mood dips you can't pin to anything, stress that lingers longer than the trigger, and a foggy kind of tired that coffee doesn't fix.
  - **Primary SNP details (per-genotype):** Reference allele shown as "Normal" on the rendered card.
    - **MTHFR C677T (CT)** — One slower copy of the folate-converting variant — your body uses folate at about two-thirds the usual pace, so taking the already-active form (methylfolate) skips the slow step. Normal: CC. Source: PharmGKB clinical annotation — https://www.pharmgkb.org/clinicalAnnotation/1450814430
    - **MTHFR C677T (TT)** — Two slower copies of the folate-converting variant — your body uses folate at about a third of the usual pace, the strongest signal in this lane. Methylfolate gives you the form your body is slow to make on its own. Normal: CC. Source: same.
    - **MTHFR A1298C (AC)** — One copy of a regulatory MTHFR variant — modestly reduced ability to process folate, so the pre-active form (methylfolate) makes the conversion easier. If you also carry the main MTHFR (C677T) variant, the two stack and the combined effect is bigger than either alone. Normal: AA. Source: PharmGKB clinical annotation — https://www.pharmgkb.org/clinicalAnnotation/1450814424
    - **MTHFR A1298C (CC)** — Two copies of a regulatory MTHFR variant — fuller drop in your ability to process folate, and methylfolate is the form your body can use directly without the slow step. If you also carry the main MTHFR (C677T) variant, the two stack and the combined effect is meaningfully larger. Normal: AA. Source: same.
    - **MTHFD1 G1958A (AG)** — One copy of a variant that makes the upstream folate-handling protein (MTHFD1) less stable — a small extra drag on the system that uses folate. Normal: GG. Source: SNPedia — https://www.snpedia.com/index.php/Rs2236225
    - **MTHFD1 G1958A (AA)** — Two copies of a variant that makes the upstream folate-handling protein (MTHFD1) less stable — a bigger drag on the system, which is why the pre-converted form (methylfolate) is the cleaner fit. Normal: GG. Source: same.
- **Methyl-B12 (methylcobalamin)**
  - *Feels like:* Low-functioning B12 tends to read as a slow mental engine — harder to find the right word mid-sentence, heavier fatigue by late afternoon, and over time, occasional numbness or tingling in the hands and feet.
  - **Primary SNP details (per-genotype):**
    - **FUT2 W143X (AA)** — Non-secretor — your gut lining handles B12 differently and burns through stored B12 faster than usual, so a daily dose of the active form (methylcobalamin) keeps levels steady. (This one only fires when both copies match — one copy isn't enough.) Normal: GG. Source: PubMed (PMC seminal paper) — https://pmc.ncbi.nlm.nih.gov/articles/PMC2673801/
    - **MTR A2756G (AG)** — One copy of a faster-burning B12 variant — your body uses B12 a bit quicker than typical at the step that recycles homocysteine. Normal: AA. Source: PubMed (meta-analysis) — https://pmc.ncbi.nlm.nih.gov/articles/PMC3990204/
    - **MTR A2756G (GG)** — Two copies of a faster-burning B12 variant — your body uses B12 noticeably quicker, so daily methylcobalamin keeps the supply ahead of the demand. Normal: AA. Source: same.
    - **MTRR A66G (AG)** — One copy of a variant that slows down B12 recycling — your body refreshes used-up B12 a bit slower than typical. Normal: AA. Source: PubMed — https://pubmed.ncbi.nlm.nih.gov/24261678/
    - **MTRR A66G (GG)** — Two copies of a variant that slows down B12 recycling — your reserves drain faster, so a steady daily dose takes the pressure off the recycling system. Normal: AA. Source: same.
- **Vitamin D3 + K2**
  - *Feels like:* Running low often feels like low-grade immune sluggishness, colds that keep circling back, aches that don't tie to a workout, and the flatter mood that creeps in through winter.
  - *Context:* Most people with more melanin run below optimal vitamin D year-round, not just in winter — and the GC variant many in this audience carry stacks on top of that, so standard-dose recommendations usually undershoot.
  - **Primary SNP details (per-genotype):** VDR BsmI uses dual-strand handling — parser may report A/G or T/C; reference picked dynamically.
    - **VDR BsmI (het)** — One copy of a less-stable vitamin D receptor variant (BsmI) — your body's vitamin D signal runs a bit weaker than typical. Trigger: AG/GA/TC/CT. Normal: GG (or CC on the reverse-complement strand). Source: PubMed (meta-analysis, 26 studies) — https://pubmed.ncbi.nlm.nih.gov/23134477/
    - **VDR BsmI (hom)** — Two copies of a less-stable vitamin D receptor variant (BsmI) — your body needs higher blood levels of vitamin D to get the same effect, which usually means a higher daily dose. Trigger: AA/TT. Normal: GG/CC. Source: same.
    - **GC DBP (AC)** — One copy of a variant that lowers how much vitamin D travels in your blood — standard daily doses tend to under-deliver. This often runs more pronounced with African ancestry, though admixture varies person to person. Normal: CC. Source: PubMed (supplementation response) — https://pubmed.ncbi.nlm.nih.gov/30661702/
    - **GC DBP (AA)** — Two copies of a variant that lowers how much vitamin D travels in your blood — the strongest reduction this gene produces. Often runs more pronounced with African ancestry, though admixture varies person to person. Normal: CC. Source: same.
    - **CYP2R1 rs10741657 (AG)** — One copy of a less-efficient vitamin D activator variant (CYP2R1) — your liver turns D3 into the active form modestly less efficiently than typical. Normal: GG. Source: PubMed (systematic review + meta-analysis) — https://pubmed.ncbi.nlm.nih.gov/30120973/
    - **CYP2R1 rs10741657 (AA)** — Two copies of a less-efficient vitamin D activator variant (CYP2R1) — your liver is the least efficient at turning D3 into the active form, so standard daily doses don't move blood levels as much. Normal: GG. Source: same.
- **Omega-3 (EPA/DHA, marine)**
  - *Feels like:* Slow conversion tends to show up as joint stiffness, sluggish post-workout recovery, drier skin, and the kind of mid-afternoon mental fog that sneaks up on you.
  - **Primary SNP details (per-genotype):**
    - **FADS1 rs174537 (GT)** — One copy of a less-efficient fat-conversion variant (FADS1) — your body converts roughly 30% less plant-based omega-3 (ALA) into the active form (EPA) than typical, not just more slowly but less in total. Normal: GG. Source: PubMed (intervention RCT) — https://www.mdpi.com/2072-6643/9/3/240
    - **FADS1 rs174537 (TT)** — Two copies of a less-efficient fat-conversion variant (FADS1) — your body turns about half as much plant omega-3 (ALA) into EPA as typical, again not just slower but less overall, which is why fish-sourced EPA/DHA is the practical fix. Normal: GG. Source: same.
    - **FADS2 rs1535 (AG)** — One copy of a less-efficient variant at the upstream omega-3 step (FADS2) — your body builds modestly less long-chain omega-3 from plant sources than typical. Normal: AA. Source: PubMed (OMEGA-REMODEL pharmacogenomic post-hoc) — https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0222061
    - **FADS2 rs1535 (GG)** — Two copies of a less-efficient variant at the upstream omega-3 step (FADS2) — your body builds noticeably less long-chain omega-3 from plant sources, so EPA/DHA you take directly works best. Normal: AA. Source: same.
    - **ELOVL2 rs953413 (AG)** — One copy of a less-efficient omega-3 finishing variant (ELOVL2) — your body builds modestly less DHA from EPA, so direct EPA/DHA supplementation makes up the difference. Normal: GG. *Strand convention verified 2026-04-29 via WebSearch (Pan et al. 2019 iScience): G is the major/reference allele, A is the minor variant linked to lower DHA. Trigger fires on A carriers — this corrects an earlier inversion.* Source: PubMed (Pan et al. 2019 mechanism paper) — https://pmc.ncbi.nlm.nih.gov/articles/PMC7033636/
    - **ELOVL2 rs953413 (AA)** — Two copies of a less-efficient omega-3 finishing variant (ELOVL2) — the biggest drop in turning EPA into DHA, so noticeably less DHA gets built from what you eat. Normal: GG. Source: same.
- **NAC (N-acetyl cysteine)**
  - *Feels like:* Sluggish detox often shows up as hangovers that feel disproportionate to what you drank, feeling wiped out after smoke or fume exposure, and skin that takes longer to bounce back from stress.
  - **Primary SNP details (per-genotype):**
    - **GSTP1 Ile105Val (AG)** — One copy of a slower detox variant (GSTP1) — your body's main detox helper (glutathione) works a bit less efficiently. NAC supplies the building block (cysteine) your body uses to make more. Normal: AA. Source: PharmGKB Very Important Pharmacogene (gene-level) — https://www.pharmgkb.org/vip/PA166169438
    - **GSTP1 Ile105Val (GG)** — Two copies of a slower detox variant (GSTP1) — fuller drop in glutathione function, which slows clearing toxins. NAC keeps glutathione stocked by feeding it the building block (cysteine) it relies on. Normal: AA. *PharmGKB's rs1695 clinical annotations cover platinum chemo and cyclophosphamide, not NAC — citation is the gene-level VIP page; the NAC-GSTP1 link is mechanistic via shared glutathione substrate.* Source: same.
- **Berberine**
  - *Feels like:* These variants tend to show up as afternoon energy crashes after carb-heavy meals, sweet cravings that aren't really hunger, and weight that holds on around the midsection even when the rest is moving.
  - **Primary SNP details (per-genotype):**
    - **TCF7L2 rs7903146 (CT)** — One copy of a blood-sugar-risk variant (TCF7L2) — your insulin response after meals runs a bit weaker, raising type 2 diabetes risk. Berberine works on the same blood-sugar pathway. Normal: CC. Source: PubMed (TCF7L2 mechanism paper, not berberine-specific) — https://pmc.ncbi.nlm.nih.gov/articles/PMC2809956/
    - **TCF7L2 rs7903146 (TT)** — Two copies of the strongest blood-sugar-risk variant in our catalog (TCF7L2) — your insulin response after meals runs noticeably weaker. Berberine works on the same blood-sugar pathway and matters most here. Normal: CC. *No berberine-specific pharmacogenomic study exists — mechanism-only rationale, citation is the canonical TCF7L2/T2D mechanism paper.* Source: same.
    - **PPARG Pro12Ala (CG)** — One risk copy plus one protective copy of an insulin-sensitivity variant (PPARG) — partial benefit from berberine's effect on the same insulin-sensitivity pathway. Normal: GG. *Inverted pattern — Pro12 (C) is the canonical major allele globally and is the risk allele; Ala12 (G) is minor and protective. Trigger does NOT fire on GG.* Source: PubMed (PPARG/T2D meta-analysis, not berberine-specific) — https://pmc.ncbi.nlm.nih.gov/articles/PMC7391673/
    - **PPARG Pro12Ala (CC)** — Two risk copies of an insulin-sensitivity variant (PPARG), no protective copy — berberine's effect on the insulin-sensitivity pathway carries the most weight here. Normal: GG. Source: same.
- **Magnesium (glycinate)**
  - *Feels like:* Low magnesium tends to show up as trouble falling asleep, muscle tightness or calf cramps at night, and a nervous system that takes longer than it should to come down after stress.
  - **Primary SNP details (per-genotype):** TRPM6 uses dual-strand handling — parser may report T/C or A/G; reference picked dynamically.
    - **TRPM6 rs11144134 (het)** — One copy of a magnesium-handling variant (TRPM6) — your gut and kidneys hold onto magnesium a bit less efficiently than typical. Trigger: CT/TC/AG/GA. Normal: TT (or AA on opposite strand). Source: PubMed (ARIC GWAS) — https://pmc.ncbi.nlm.nih.gov/articles/PMC4462077/
    - **TRPM6 rs11144134 (hom)** — Two copies of a magnesium-handling variant (TRPM6) — fuller drop in how well your body keeps magnesium, with real risk of running quietly low. Daily supplementation closes the gap. Trigger: CC/GG. Normal: TT/AA. Source: same.
- **Sulforaphane (broccoli sprout)**
  - *Feels like:* This one's more preventative than felt in the moment — steadier recovery from environmental exposures, and a body that handles everyday oxidative load without you having to think about it.
  - **Primary SNP details (per-genotype):**
    - **GSTP1 Ile105Val (AG)** — One copy of a slower detox variant (GSTP1) — your built-in antioxidant defense runs a bit weaker. Sulforaphane turns up production of these defenses, including the slower one, partly making up the difference. Normal: AA. Source: PubMed (Phase II induction RCT) — https://pubmed.ncbi.nlm.nih.gov/19028145/
    - **GSTP1 Ile105Val (GG)** — Two copies of a slower detox variant (GSTP1) — fuller drop in your built-in antioxidant defense. Sulforaphane boosts production of those defenses, including the slower variant itself, helping make up the gap. Normal: AA. Source: same.

### Healthy Aging

| Supplement | Primary SNPs | Supporting SNPs | Default Dose | Brand Options | Evidence Tier |
|---|---|---|---|---|---|
| **CoQ10 (ubiquinol)** | rs1800566 NQO1; rs4880 SOD2 | rs17238540 HMGCR; rs4693570 COQ2; rs8192678 PPARGC1A | 100–200 mg ubiquinol daily with fat | Solaray, NOW Foods | SNP-driven |
| **Phosphatidylserine (PS)** | rs429358 + rs7412 APOE (E4 carriers only) | rs6265 BDNF; rs1800795 IL6 | 100 mg 3× daily (E4 carriers) | Solgar, Jarrow Formulas | SNP-driven (E4-gated) |
| **NMN / NR (NAD⁺ precursor)** | rs1800566 NQO1 | rs4880 SOD2; rs2802292 FOXO3; rs3758391 SIRT1 | 300 mg NR or 500 mg NMN daily | Source Naturals (NR only; NMN side uncovered) | SNP-informed |

**Copy — felt effects & context**

- **CoQ10 (ubiquinol)**
  - *Feels like:* Low CoQ10 usually reads as low-octane energy — workouts that feel harder than they should, recovery that drags, and a heart that works noticeably more on stairs or inclines.
  - **Primary SNP details (per-genotype):**
    - **NQO1 C609T (CT)** — One copy of a less-efficient variant (NQO1) at the step that converts CoQ10 into its active form (ubiquinol) — modestly less efficient than typical. Normal: CC. Source: PubMed (Frontiers review on NQO1 + CoQ10) — https://www.frontiersin.org/journals/physiology/articles/10.3389/fphys.2017.00595/full
    - **NQO1 C609T (TT)** — Two copies of a less-efficient variant (NQO1) — the strongest drop in efficiency at converting CoQ10 into its active form. Taking ubiquinol directly skips the conversion entirely. Normal: CC. Source: same.
    - **SOD2 Ala16Val (CT)** — One copy of a variant (SOD2) that delivers a key antioxidant into your cellular power plants (mitochondria) less efficiently than typical. Normal: TT. Source: PubMed (structural/import study) — https://pubmed.ncbi.nlm.nih.gov/36552556/
    - **SOD2 Ala16Val (CC)** — Two copies of a variant (SOD2) that delivers a key antioxidant into your cellular power plants less efficiently — the strongest case for CoQ10, which protects the same system. Normal: TT. Source: same.
- **Phosphatidylserine (PS)**
  - *Feels like:* When the brain needs more structural support, it tends to show up as names and words slipping mid-conversation, harder-to-hold focus when you're juggling things, and more mental friction late in the day.
  - **Primary SNP details (per-genotype):** Rule is gated by `isApoeE4Carrier` — fires only when rs429358 has at least one C AND rs7412 is CC.
    - **APOE ε4 (one copy)** — One copy of the APOE ε4 variant — your brain handles its building-block fats a bit differently, and cognitive aging tends to move a step faster. Read together with the rs7412 row below, which confirms this is the ε4 type and not the protective ε2 type. PS plus omega-3 has shown memory benefit in this group. Normal: TT. Source: PubMed (Vakhapova RCT) — https://pubmed.ncbi.nlm.nih.gov/20523044/
    - **APOE ε4 (two copies)** — Two copies of the APOE ε4 variant — the strongest cognitive-aging risk profile in our catalog. Read together with the rs7412 row below, which confirms the APOE type alongside this one. PS plus omega-3 matters most here. Normal: TT. Source: same.
    - **APOE ε2 absence (CC)** — Confirms your APOE type by ruling out the protective ε2 variant. The APOE letter (ε2 / ε3 / ε4) is read from rs429358 and rs7412 together — this CC excludes any ε2 and locks in the ε4 reading from the row above. Normal: CC. Source: same.
- **NMN / NR (NAD⁺ precursor)**
  - *Feels like:* Aging mitochondria tend to read as a slower metabolic engine overall — workouts that take longer to recover from, energy that doesn't return to baseline the way it used to, and sleep that feels less restorative.
  - **Primary SNP details (per-genotype):**
    - **NQO1 C609T (CT)** — One copy of a less-efficient variant (NQO1) at the step that recycles NAD — your cellular energy currency cycles modestly less efficiently than typical. Normal: CC. Source: PubMed (Frontiers review on NQO1 redox role) — https://www.frontiersin.org/journals/physiology/articles/10.3389/fphys.2017.00595/full
    - **NQO1 C609T (TT)** — Two copies of a less-efficient variant (NQO1) at the NAD-recycling step — the strongest drop in this gene, which makes the case for NMN/NR to top up your cellular energy supply. Normal: CC. Source: same.

### Body Optimization

| Supplement | Primary SNPs | Supporting SNPs | Default Dose | Brand Options | Evidence Tier |
|---|---|---|---|---|---|
| **Creatine monohydrate** | rs1815739 ACTN3 | rs4343 ACE; rs8192678 PPARGC1A | 3–5 g daily | Bucked Up, PrimaForce, Nutricost | SNP-driven (ACTN3 XX genotype benefits most; dose not genotype-titrated) |
| **L-carnitine (tartrate)** | rs1042713 ADRB2 | rs8192678 PPARGC1A; rs4343 ACE; rs762551 CYP1A2 | 1–2 g daily | Solaray, NOW Foods, Solgar | SNP-driven |
| **PQQ** | rs8192678 PPARGC1A | rs4880 SOD2 | 10–20 mg daily | gap — no v0 brand | SNP-informed |

**Copy — felt effects & context**

- **Creatine monohydrate**
  - *Feels like:* If you carry the XX genotype, creatine tends to show up as a real lift — more reps left in the tank, faster between-set recovery, and strength that builds sooner than you'd expect for the effort you're putting in.
  - **Primary SNP details (per-genotype):**
    - **ACTN3 R577X (CT)** — One inactive copy of a power-muscle protein (α-actinin-3) — creatine helps everyone build power and strength, but research suggests the relative gain may run a bit larger here, since your power muscles get a small extra fuel boost from supplementation. Normal: CC. Source: PubMed (meta-analysis, elite power sports) — https://pubmed.ncbi.nlm.nih.gov/31145768/
    - **ACTN3 R577X (TT — XX genotype)** — Both copies of a power-muscle protein (α-actinin-3) are inactive in your file (the "XX" genotype). Creatine works regardless of genotype, but research suggests the relative gain runs largest in this group, since your power muscles fully lean on the extra fuel support creatine provides. Normal: CC. Source: same.
- **L-carnitine (tartrate)**
  - *Feels like:* Slower fat oxidation often shows up as exercise that feels like it's running on sugar before fat — energy that crashes sooner than expected, and weight that's harder to shift even with consistent cardio.
  - **Primary SNP details (per-genotype):**
    - **ADRB2 Arg16Gly (AG)** — One copy of a variant (ADRB2) that softens your body's signal to break down stored fat — modestly slower fat-burning response than typical. Normal: AA. Source: PubMed (ADRB2/lipolysis meta-analysis, not carnitine-specific) — https://pubmed.ncbi.nlm.nih.gov/24960039/
    - **ADRB2 Arg16Gly (GG)** — Two copies of a variant (ADRB2) that softens the signal to break down stored fat — fat is harder to mobilize during exercise. L-carnitine helps shuttle fat into your cellular power plants where it gets burned. Normal: AA. *No direct ADRB2-carnitine pharmacogenomic study exists — mechanism-only rationale, citation is the canonical ADRB2 lipolysis meta-analysis.* Source: same.
- **PQQ**
  - *Feels like:* The payoff here is subtle and slow — more stamina across long days, better-quality sleep, and a brain that doesn't hit its afternoon wall as hard.
  - **Primary SNP details (per-genotype):**
    - **PPARGC1A Gly482Ser (AG)** — One copy of a variant that softens the master switch (PGC-1α) for building new cellular power plants — runs a bit weaker than typical. Normal: GG. Source: PubMed (PPARGC1A narrative review, not PQQ-specific) — https://pubmed.ncbi.nlm.nih.gov/39766897/
    - **PPARGC1A Gly482Ser (AA)** — Two copies of a variant that softens the master switch (PGC-1α) for building new cellular power plants — fuller drop. PQQ pushes on the same switch. Normal: GG. *No PQQ-specific pharmacogenomic study exists — mechanism-only rationale.* Source: same.

### Food Sensitivity

| Supplement | Primary SNPs | Supporting SNPs | Default Dose | Brand Options | Evidence Tier |
|---|---|---|---|---|---|
| **Lactase enzyme** | rs4988235 LCT | — | 3000–9000 FCC units with dairy meals | Solaray, Source Naturals | SNP-driven |
| **Non-dairy calcium (citrate)** | rs4988235 LCT | rs1544410 VDR; rs2282679 GC | 500–1000 mg daily | NOW Foods, Solgar, Solaray, Source Naturals | SNP-driven |
| **DAO enzyme (histamine intolerance)** | rs10156191 AOC1; rs1049742 AOC1 | rs1800629 TNFA | 10,000 HDU before histamine-rich meals | Solaray | SNP-driven |
| **Iron — SKIP if HFE carrier** | rs1799945 HFE H63D; rs1800562 HFE C282Y | — | Skip priority; no supplementation recommended | n/a (avoidance, no commerce) | SNP-driven |

**Copy — felt effects & context**

- **Lactase enzyme**
  - *Feels like:* If dairy reliably gives you bloating, cramping, or looser stools within an hour or two of the meal, that's exactly the pattern this targets.
  - *Context:* The LCT persistence genotype — being able to digest dairy into adulthood — is uncommon outside Northern European ancestry, which is why lactose issues are the norm rather than the exception for most of us.
  - **Primary SNP details (per-genotype):** `variantLabel` and reference use parser strand (A/G), not dbSNP forward (C/T) — what the user actually sees in their genotype.
    - **LCT/MCM6 rs4988235 (GG)** — Lactase non-persistent — your body stopped making lactase (the enzyme that digests milk sugar) sometime after childhood, which is the typical pattern for most non-Northern-European ancestry. Supplemental lactase fills in for what your gut no longer makes. *Recessive — heterozygotes are still persistent.* Normal: AA. Source: PubMed (lactase persistence + dairy intake) — https://pubmed.ncbi.nlm.nih.gov/31405126/
- **Non-dairy calcium (citrate)**
  - *Feels like:* If you've cut or reduced dairy, the gap usually isn't felt day to day — it shows up long-term in bone density, and near-term you might notice more nighttime muscle cramping.
  - *Context:* Because lactose non-persistence is the default for most non-Northern-European populations, many people in this audience have been quietly running below the calcium-intake assumptions that most nutrition guidance is built on.
  - **Primary SNP details (per-genotype):**
    - **LCT/MCM6 rs4988235 (GG)** — Lactase non-persistent — most adults with this pattern eat less dairy because of how it sits, which can leave daily calcium intake below the recommended range for some people. Non-dairy calcium covers any gap this dietary pattern creates. (Worth knowing: outright calcium deficiency is uncommon in adults — this is about hitting daily intake targets, not treating a deficit.) Normal: AA. Source: PubMed (lactase persistence + dairy intake) — https://pubmed.ncbi.nlm.nih.gov/31405126/
- **DAO enzyme (histamine intolerance)**
  - *Feels like:* Low DAO tends to show up as flushing after wine or aged cheese, unexplained headaches, hives, or a runny nose that kicks in after meals — histamine building up faster than your body can clear it.
  - **Primary SNP details (per-genotype):**
    - **AOC1 Thr16Met (CT)** — One copy of a slower histamine-clearing variant (AOC1) — your body breaks down dietary histamine a bit slower than typical. Normal: CC. Source: PubMed (DAO variants in HIT pilot) — https://pmc.ncbi.nlm.nih.gov/articles/PMC11054051/
    - **AOC1 Thr16Met (TT)** — Two copies of a slower histamine-clearing variant (AOC1) — your body is noticeably slower to clear histamine after meals high in it (aged cheese, wine, fermented foods). Normal: CC. Source: same.
    - **AOC1 Ser332Phe (CT)** — One copy of a variant (AOC1) that lowers how much histamine-clearing enzyme (DAO) your body produces. Normal: CC. Source: same.
    - **AOC1 Ser332Phe (TT)** — Two copies of a variant (AOC1) that lowers how much histamine-clearing enzyme your body makes — compounds when paired with the other AOC1 variant. Supplemental DAO before histamine-rich meals fills the gap. Normal: CC. Source: same.
- **Iron — SKIP if HFE carrier**
  - *Feels like:* If you're a carrier, extra iron doesn't make you feel anything different in the moment — it quietly accumulates over years. Skipping iron in multis and not "just topping up" is the move.
  - *Context:* HFE hemochromatosis is largely a Northern European founder variant and is much less common in people of African descent, so this card fires for fewer users in our audience than the general population rate would suggest.
  - **Primary SNP details (per-genotype):** Single-allele HFE carriers fire the iron-skip card with milder copy per the standing v0 policy (precautionary clinical interpretation).
    - **HFE H63D (CG)** — One copy of an iron-loading variant (HFE H63D) — your gut may absorb slightly more iron than typical. Worth a conversation with your doctor before starting iron supplementation, especially given other factors like a vegetarian diet or menstruation that can pull iron the other way. Normal: CC. Source: PubMed (NEJM iron-overload study) — https://www.nejm.org/doi/full/10.1056/NEJMoa073286
    - **HFE H63D (GG)** — Two copies of an iron-loading variant (HFE H63D) — your gut may absorb more iron than typical, with risk of buildup over time. Talk to your doctor before taking supplemental iron, especially if you've been told you need it for another reason (low iron from periods, vegetarian or vegan diet). Normal: CC. Source: same.
    - **HFE C282Y (AG)** — One copy of an iron-loading variant (HFE C282Y) — your gut may absorb slightly more iron than typical. Worth a conversation with your doctor before starting iron supplementation, especially given other factors like a vegetarian diet or menstruation that can pull iron the other way. Normal: GG. Source: same.
    - **HFE C282Y (AA)** — Two copies of an iron-loading variant (HFE C282Y) — clear hereditary hemochromatosis risk (iron buildup that can damage organs over time). This needs medical input. Talk to your doctor before taking any iron supplement, even if you've been told you need it for another reason. Normal: GG. Source: same.

## Rule-logic corrections (verified 2026-04-29)

Trigger arrays in `src/engine/supplementRules.ts` were corrected for four primary SNPs (and their supporting-role twins) where they fired on the wrong genotype. Verifications below are good for future sessions — do not re-search what's already recorded here.

| rsid | Gene | Where used | Old trigger (wrong) | New trigger | Why |
|---|---|---|---|---|---|
| rs1801282 | PPARG Pro12Ala | Berberine (primary), Omega-3 (supporting) | `[CG, GC, GG]` (G/Ala carriers) | `[CC, CG, GC]` (C/Pro carriers) | Pro12 (C allele) is the canonical T2D-risk allele in major meta-analyses; Ala12 (G) is protective. The previous trigger fired on the protective genotype. Sources verified 2026-04-29: [Nature Sci Rep meta-analysis](https://www.nature.com/articles/s41598-020-69363-7) (OR 0.86 for G allele = protective), [PMC8630345 review](https://pmc.ncbi.nlm.nih.gov/articles/PMC8630345/), [PMC2834889 HuGE meta-analysis](https://pmc.ncbi.nlm.nih.gov/articles/PMC2834889/). Population caveat: a few studies (Russian, South Asian, mixed African) have shown opposite associations — directional consensus across the largest meta-analyses is Pro = risk. |
| rs601338 | FUT2 W143X | Methyl-B12 (primary), Methylfolate (supporting) | `[AA, AG, GA]` (any A carrier) | `[AA]` only | W143X is recessive; only AA homozygotes are non-secretors. Heterozygotes (AG/GA) still secrete histo-blood-group antigens. Previous trigger over-fired on heterozygous secretors. Sources verified 2026-04-29: [PMC6171556 ALSPAC cohort](https://pmc.ncbi.nlm.nih.gov/articles/PMC6171556/), [PMC3198057 T1D + infection paper](https://pmc.ncbi.nlm.nih.gov/articles/PMC3198057/), [OMIM 182100](https://omim.org/entry/182100). |
| rs4988235 | LCT/MCM6 | Lactase (primary), Calcium (primary), D3+K2 (supporting) | `[AG, GA, GG]` (any G carrier) | `[GG]` only | A allele = lactase persistent, **dominant**; one A copy is sufficient for adult lactase activity. Only GG homozygotes are lactase non-persistent (lactose intolerant). 23andMe and Ancestry both report this SNP with A/G alleles (the existing variantLabel `(CC ...)` uses plus-strand C/T convention; the trigger must match what the parser sees, which is verbatim chip data). Previous trigger over-fired on AG/GA heterozygotes who are still persistent. Sources verified 2026-04-29: [MDPI 2019 (PMC6723957)](https://pmc.ncbi.nlm.nih.gov/articles/PMC6723957/), [Wikipedia: Lactase persistence](https://en.wikipedia.org/wiki/Lactase_persistence), [Genetic Genie LCT/MCM6 article](https://geneticgenie.org/article/lactose-intolerance-genetics-the-lct-mcm6-gene/). |
| rs11144134 | TRPM6 | Magnesium (primary) | `[AC, CA, CC]` (mixed-strand letters) | `[CC, CT, TC, GG, AG, GA]` (covers both strand orientations) | Old trigger letters mixed alleles from both strand orientations (A from one strand, C from the other) — would never have matched real chip-reported genotypes. dbSNP records this as a biallelic SNP that can be reported as T/C (plus strand) or A/G (opposite strand). Per ARIC GWAS (PMC4462077), the **minor** allele decreases serum magnesium (negative beta = -0.013 in EU-Americans). New trigger fires on minor-allele carriers in either strand convention. Sources verified 2026-04-29: [ARIC GWAS PMC4462077](https://pmc.ncbi.nlm.nih.gov/articles/PMC4462077/), [Gene Food TRPM6 page](https://www.mygenefood.com/genes/gastrointestinal-genes/trpm6/). **Population note:** rs11144134 had MAF = 2% in ARIC African-Americans — this primary SNP is mostly relevant to European-ancestry users; consider whether Magnesium should remain primary-gated by this rsid for the target audience. Parked as a follow-up. |

### Resolved 2026-04-29: per-genotype split + label rewrites

The "label vs trigger" mismatches previously flagged here (rs10741657, rs2282679, rs4880) are resolved by the per-genotype split — each multi-trigger primary SNP is now stored as separate `PrimarySNPReference` entries (one per genotype outcome) with genotype-specific variantLabels and severity-specific descriptions. The card renders each row as `GENE rsid (Normal: X · Yours: Y): {description}` with the wild-type allele shown explicitly.

**Additional correction in the same pass:** rs953413 ELOVL2 trigger array was previously `[AG, GA, GG]` (firing on G carriers). WebSearch verification of [Pan et al. 2019 (PMC7033636)](https://pmc.ncbi.nlm.nih.gov/articles/PMC7033636/) confirms G is the major/reference allele and the A allele is the minor variant linked to lower DHA — so the array is now flipped to `[AG, GA]` (het) and `[AA]` (hom). Reference: GG. Strand convention is recorded as a code comment in `src/engine/supplementRules.ts` above the rs953413 entries.

**Standing v0 policy applied (per user, 2026-04-29):** heterozygous entries default to fire with intermediate-severity copy (use "partial," "intermediate," "modest," "one copy"); homozygous reserves stronger language ("strongest signal," "full," "complete"). Exception: when biology is genuinely homozygous-only (recessive variants — FUT2 W143X, LCT/MCM6), only the homozygous entry exists. HFE H63D and C282Y heterozygotes both fire the iron-skip card with milder copy under the precautionary clinical interpretation.

### Resolved 2026-04-29: ACTN3 het firing

The previous "open clinical-judgment question" on rs1815739 ACTN3 R577X for Creatine is resolved. Both CT (heterozygous, one nonfunctional α-actinin-3 copy) and TT (XX genotype, both copies nonfunctional) fire the Creatine card. CT receives "modest additional creatine benefit" copy; TT receives "strongest creatine benefit in our catalog" copy. The gradient is real (CT carriers have partial phosphocreatine-buffering demand) and the framing is honest.

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

- **Commerce alignment.** v0 revenue is the Rakuten LinkShare / HerbsPro feed. Supplement-centric produces one card per supplement, with 1–4 brand buttons per card. SNP-centric would produce N cards that must be deduped into supplements anyway, losing reasoning along the way.
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
