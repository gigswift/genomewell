import { Fragment, type ReactNode } from 'react';
import { CWTooltip } from '../components/ui';

export const GLOSSARY: Record<string, string> = {
  'genotype': 'The pair of letters representing the two copies of a gene you inherited — one from each parent.',
  'methylation': 'A behind-the-scenes chemistry your body uses to switch genes on and off and convert certain nutrients into the active form it can use.',
  'antioxidant': 'A molecule that protects your cells from everyday wear and stress, before damage can build up.',
  'homocysteine': 'A by-product your body makes when processing protein. Folate and B12 help recycle it back into useful forms; high levels are linked to heart and brain aging.',
  'nad': 'A molecule your cells use to make energy and repair DNA. Levels naturally drop with age.',
  'apoe ε4': 'A version of the APOE gene linked to faster cognitive aging — knowing you carry it is useful early, since brain-supportive nutrients can be timed against it.',
  'apoe ε2': 'A protective version of the APOE gene linked to slower cognitive aging — the opposite end of the APOE spectrum from ε4.',
  'ε2': 'A protective version of the APOE gene linked to slower cognitive aging.',
  'hemochromatosis': 'A condition where the body absorbs and stores too much iron over time, slowly damaging organs. HFE gene variants raise this risk.',
  'dominant': 'A version of a variant that shows its effect even when you only inherit one copy.',
  'recessive': 'A version of a variant that only shows its full effect when you inherit two copies (one from each parent).',
};

const TERMS_BY_LENGTH = Object.keys(GLOSSARY).sort((a, b) => b.length - a.length);

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const PATTERN = new RegExp(
  '(' +
    TERMS_BY_LENGTH.map((t) => {
      const escaped = escapeRegex(t);
      if (t === 'nad') return `\\b${escaped}[⁺+]?\\b`;
      return `\\b${escaped}\\b`;
    }).join('|') +
    ')',
  'gi',
);

export function wrapGlossary(text: string): ReactNode {
  if (!text) return text;
  const seen = new Set<string>();
  const parts = text.split(PATTERN);
  return parts.map((part, i) => {
    if (!part) return null;
    const key = part.toLowerCase().replace(/[⁺+]$/, '');
    const def = GLOSSARY[key];
    if (def && !seen.has(key)) {
      seen.add(key);
      // Capture-phase preventDefault cancels anchor navigation when this
      // tooltip is rendered inside a variant row's <a> wrapper.
      return (
        <span key={i} onClickCapture={(e) => e.preventDefault()}>
          <CWTooltip content={def}>{part}</CWTooltip>
        </span>
      );
    }
    return <Fragment key={i}>{part}</Fragment>;
  });
}
