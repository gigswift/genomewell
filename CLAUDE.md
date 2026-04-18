# GenomeWell — Project Rules

## What this project is
Privacy-first genetic wellness app for the Black American community. Users upload 23andMe/AncestryDNA files → browser-side parsing → personalized supplement recommendations → Thorne affiliate commerce.

## Source of truth
Read `docs/` before making claims or decisions. These are living strategy docs maintained across sessions:
- `docs/science-snp-catalog.md` — SNP catalog, categories, supplement-centric architecture
- `docs/commerce-practitioner.md` — affiliate strategy, practitioner model, launch sequencing
- `docs/product-strategy.md` — positioning, funnel, competitive landscape
- `docs/build-deployment.md` — stack, deployment, known issues
- `docs/parking-lot.md` — parked threads (say "unpark [title]" to resume)

If a doc contradicts something from conversation memory, the doc is authoritative.

## Evidence discipline

### Supplement inclusion checklist
Before adding any supplement to the catalog, verify ALL of the following:
- [ ] Evidence tier explicitly stated: SNP-driven (strong primary) or SNP-informed (partial hooks)
- [ ] At least one primary SNP identified with published evidence
- [ ] Evidence strength labeled honestly — if previously labeled "weak," it cannot be included
- [ ] Thorne or a named partner carries it (or gap explicitly noted)
- [ ] Not contradicted by an earlier decision in docs

### Citation rules
- NEVER cite a PMID from memory. PMIDs can be hallucinated.
- Only cite PMIDs verified via WebSearch in the current session.
- If unverified, write: "published evidence exists (citation not yet verified)" instead.

### Verify once, record in docs
- When verifying a SNP-supplement link against PharmGKB, SNPedia, or PubMed, record the verification status directly in `docs/science-snp-catalog.md`.
- Future sessions read the doc instead of re-verifying. Do not re-search what has already been verified and recorded.

### Databases for verification
- **PharmGKB** (pharmgkb.org) — gene-drug/supplement relationships. Gold standard.
- **SNPedia** (snpedia.com) — genotype-phenotype associations. Good consumer SNP coverage.
- **PubMed** — primary literature. Use WebSearch to find studies.
- **CPIC** (cpicpgx.org) — clinical pharmacogenomics guidelines.

## Catalog constraints
- **4 categories:** Daily Wellness, Healthy Aging, Body Optimization, Food Sensitivity
- **Supplement count = whatever the evidence supports**; no padding to a target. Each included supplement must pass the supplement inclusion checklist (above).
- **60 unique SNPs total for v0**, referenced by the supplement catalog
- Supplements with "weak" or no SNP evidence are explicitly excluded. See `docs/science-snp-catalog.md` Tier 3 section for the full exclusion list. Do not re-add them.

## Architecture
- Supplement-centric model (OPEN DECISION — check docs for current status before implementing)
- All DNA parsing in-browser. Never send raw genotypes to any server.
- Only structured SNPResult data may be sent to external APIs.

## Business model
- v0: Thorne affiliate (10–20%) + DTC fills (BioTrust 40%, Organifi 30%). No practitioner required.
- v1: Fullscript dispensary (up to 35% margin) + family practitioners (PharmD aunt as CPO, MD aunt as CMO).
- v2: White-label own brand at scale.

## Working style
- Update `docs/` as decisions are made. Minor updates without asking; ask before creating new docs or reversing decisions.
- Park exploratory threads in `docs/parking-lot.md` with enough context to resume.
- When decomposing into parallel Kanban tasks, always include a final reconciliation task.
- Kanban tasks for this project: `--project-path /Users/rashadbartholomew/genomewell`
