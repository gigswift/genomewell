# Chronic Wellness — Design handoff

**Locked selections (your choices, April 2026):**

| Token | Value |
|---|---|
| Palette | **Cocoa** (dark) |
| Typography | **Modernist** (Instrument Serif + Figtree + JetBrains Mono) |
| Landing hero | **C — Split** (headline + supportive columns) |
| Results nav | **Segmented** |
| Supplement card | **Stacked** layout |
| Density | **Comfortable** |

---

## Design tokens (Cocoa palette)

```css
:root {
  /* Surfaces */
  --cw-bg:          #201813;   /* page */
  --cw-surface:     #2A2019;   /* card */
  --cw-surfaceAlt:  #34281F;   /* inset / muted surface */
  --cw-line:        #3E3024;   /* hairline */

  /* Ink */
  --cw-ink:         #F5EBD8;   /* primary text */
  --cw-inkMuted:    #C8B99E;   /* body */
  --cw-inkSoft:     #8E806B;   /* meta / mono labels */

  /* Accents */
  --cw-accent:      #E6A04A;   /* amber — priority, links */
  --cw-accentSoft:  #4A3520;
  --cw-secondary:   #9CAE88;   /* sage — success */
  --cw-secondarySoft:#2E3527;

  /* Semantic */
  --cw-essential:   var(--cw-accent);
  --cw-recommended: var(--cw-inkMuted);
  --cw-optional:    var(--cw-inkSoft);
  --cw-gap:         var(--cw-inkSoft);
  --cw-success:     var(--cw-secondary);
}
```

## Typography

```css
:root {
  --cw-font-display: "Instrument Serif", "EB Garamond", Georgia, serif;
  --cw-font-body:    "Figtree", "Inter", system-ui, sans-serif;
  --cw-font-mono:    "JetBrains Mono", ui-monospace, monospace;
  --cw-display-weight: 400;
  --cw-display-letter: -0.01em;
}
```

**Google Fonts import:**
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Figtree:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
```

## Type scale (suggested)

| Role | Size / line | Font |
|---|---|---|
| Display XL (hero) | 72/1.0 · letter -0.01em | display |
| Display L (archetype) | 56/1.02 | display |
| Display M (card name) | 26–28/1.05 | display |
| Body L | 17/1.55 | body |
| Body M | 14.5/1.55 | body |
| Body S | 13/1.5 | body |
| Mono label | 10–11/1.3 · letter 0.1em · uppercase | mono |

## Radius, spacing, shadow

```css
--cw-r-sm:  10px;
--cw-r-md:  14px;
--cw-r-lg:  20px;   /* cards */
--cw-r-xl:  24px;   /* hero surfaces */
--cw-r-pill: 999px;

/* 4pt grid — use 4, 8, 12, 16, 20, 24, 32, 48, 64 */

--cw-shadow-sm: 0 1px 2px rgba(0,0,0,0.18);
--cw-shadow-md: 0 2px 8px rgba(0,0,0,0.22);
--cw-shadow-lg: 0 12px 40px rgba(0,0,0,0.3);
```

---

## Hero C — Split (landing)

Two-column desktop (1.3fr / 1fr), stacked on mobile. Headline uses italicized emphasis on the final phrase (`<em>actual genome.</em>`). Supporting text is two short paragraphs, left-ruled on desktop.

**Copy:**
> Supplements, picked by your *actual genome.*
>
> Drop in your raw file from 23andMe or Ancestry. In about fifteen seconds you'll get a priority-ranked list of supplements — each tied to a specific variant in your file.
>
> The file is parsed in your browser. It isn't uploaded anywhere. It can't be — we don't have a place to put it.

## Results — segmented nav

Four tabs inside a pill-shaped container: Daily Wellness · Healthy Aging · Body Optimization · Food Sensitivity. Active tab uses `--cw-surface` with subtle shadow; inactive is transparent over `--cw-surfaceAlt`.

## Supplement card — stacked layout

Two-zone card with a muted header strip (surfaceAlt) and a body section:

```
┌─────────────────────────────────────────┐
│ [TAG]              [PRIORITY CHIP]      │  header, surfaceAlt
│ Card Name (display 26)                  │
├─────────────────────────────────────────┤
│ DOSE        YOUR VARIANTS               │  body, surface
│ 800 mcg…    MTHFR C677T · MTRR A66G     │
│                                          │
│ Reason paragraph in body-M…              │
│                                          │
│ [Shop Thorne] [Shop BioTrust] [Shop Org] │  1–3 partners
└─────────────────────────────────────────┘
```

## Priority taxonomy

| State | Chip | Color |
|---|---|---|
| Essential | filled pill, amber bg | `--cw-accent` on `--cw-surface` text |
| Recommended | filled pill, neutral | `--cw-surfaceAlt` bg, `--cw-ink` text |
| Optional | filled pill, muted | `--cw-surfaceAlt` bg, `--cw-inkMuted` text |
| Gap | outlined pill + dashed note | `--cw-line` border, `--cw-inkSoft` text |

**Gap state:** replace partner buttons with a dashed-border note: *"No shop yet — we'll email when a partner we trust carries a third-party-tested version."*

## Privacy lockup (three variants)

- **Inline:** mono caps "100% ON-DEVICE" + lock glyph — page headers
- **Badge:** pill border, "PROCESSED LOCALLY" — dashboards
- **Rule:** horizontal divider with lockup centered — long pages

---

## Voice notes

- Tone dial at ~65: knowledgeable friend who reads papers, not a clinician.
- Name the variant. Explain what it does in plain English. Say what to try and roughly how long before they'll notice.
- Never "may wish to consider." Never "based on genetic predispositions."
- Be honest about gaps — if no partner we trust carries it, say so.

## Microcopy library

| Context | Copy |
|---|---|
| Privacy promise | "Your DNA never leaves your device." |
| Upload CTA | "Drop your raw DNA file" |
| Parse status | "Reading on this device…" → "Parsing 637,294 SNPs" → "Matching your variants" → "Ranking recommendations" |
| Done state | "Done. Nothing was transmitted." |
| Shop CTA | "Shop at [Partner]" (not "Buy now") |
| Gap state | "No shop yet — we'll email when a partner we trust carries one." |
| Re-analyze | "Re-analyze" (not "Upload new file") |

---

## File inventory

- `ChronicWellness.html` — entry point
- `components/tokens.jsx` — palettes + font registries, `applyPalette` / `applyFont`
- `components/data.jsx` — archetype + supplement fixture data
- `components/ui.jsx` — logo, privacy lockups, buttons, partner button, priority chip
- `components/landing.jsx` — landing + upload + lock-ring parse animation
- `components/dashboard.jsx` — archetype hero + tab nav + card list
- `components/supplement-card.jsx` — three card layouts
- `components/tweaks.jsx` — live design-token controls
- `components/app.jsx` — shell, persistence, edit-mode protocol
- `components/ios-frame.jsx` / `browser-window.jsx` / `design-canvas.jsx` — chrome

All defaults in `app.jsx` are now set to your locked selections.
