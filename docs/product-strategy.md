# Product Strategy

## Core positioning
**Chronic Wellness** is a privacy-first genetic wellness app for the Black American community. Users upload raw DNA files from 23andMe/AncestryDNA; parsing happens in the browser; results generate personalized supplement and fitness recommendations.

## Business model
The DNA analysis is the **lead magnet**, not the product. The monetization funnel:

```
Upload raw DNA file
    ↓
Get instant feedback with top insights
    ↓
Sign up for account (gated features)
    ↓
Purchase supplements (commerce)
    ↓
Recurring subscription + retention
```

## UX decisions

### Prescriptive with empathetic copy (not conversational narrative)
- Initial spec used Claude API for narrative summaries — determined to be optional, not required
- Deterministic recommendations from the SNP rules engine are the core product
- Well-designed prescriptive UI with warm microcopy captures ~90% of narrative value, at zero API cost and full privacy
- Keep Claude as an optional "enhance" button if needed later

### Gated results as signup driver
- Show top 3–5 SNPs in full detail on first page load
- Gate remaining insights behind free account signup
- Supplement stack is the primary commerce surface — every card is a potential "shop this" CTA

### Privacy architecture as brand promise
- All DNA parsing in-browser (no file transmission)
- Only structured `SNPResult` data would leave the device if Claude is activated (never raw genotypes)
- "Your DNA never leaves your device" is a durable, prominent message

## Competitive landscape

| Competitor | Position | Differentiation |
|---|---|---|
| GenoPalate | All-in-one testing → supplements | High fixed cost (runs own lab); Chronic Wellness inherits 30M+ existing raw files |
| Viome | Microbiome-based wellness | Different substrate (stool), different vertical |
| Rootine | DNA + blood + lifestyle → custom pills | Struggled with multi-modal friction; high fixed cost per user |
| Care/of | Quiz-based personalized packs | Shut down by Bayer (2024); gap in the market |

## Real competitive risk
Not the existing DNA companies. The bigger threat is a **health-data aggregator with distribution** (Function Health, Levels, Whoop, Eight Sleep, Oura) adding a DNA upload feature. Window to establish brand + community is now.

## Moat sources (in order of durability)
1. **Editorial curation** — which SNPs, which recommendations, what you refuse to include
2. **Cultural specificity** — Black American wellness positioning; unrepresented in the market
3. **Trust architecture** — privacy posture as brand promise
4. **UX and narrative voice** — how results land in the first 30 seconds
5. **Commerce integration** — supplement partner relationships, LTV/CAC
6. **Community and content** — ongoing reason to stay subscribed
7. **Proprietary aggregate data** — anonymized outcomes; compounds over time

The parsing engine itself is **not** a moat. Don't over-invest engineering there.
