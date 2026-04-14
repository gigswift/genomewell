import { useState } from 'react';
import type { SNPResult } from '../types';

const CATEGORY_COLORS: Record<string, string> = {
  'Blood Disorders': 'bg-red-100 text-red-800',
  'Kidney Health': 'bg-amber-100 text-amber-800',
  Cardiovascular: 'bg-rose-100 text-rose-800',
  Metabolic: 'bg-orange-100 text-orange-800',
  'Nutrition & Vitamins': 'bg-green-100 text-green-800',
  'Drug Metabolism': 'bg-purple-100 text-purple-800',
  'Cancer Risk': 'bg-red-100 text-red-700',
  'Cognitive Health': 'bg-blue-100 text-blue-800',
  Inflammation: 'bg-amber-100 text-amber-700',
};

const RISK_STYLES = {
  normal: {
    dot: 'bg-green-500',
    label: 'Normal',
    badge: 'bg-green-50 text-green-700 ring-1 ring-green-200',
  },
  moderate: {
    dot: 'bg-yellow-500',
    label: 'Moderate',
    badge: 'bg-yellow-50 text-yellow-700 ring-1 ring-yellow-200',
  },
  elevated: {
    dot: 'bg-red-500',
    label: 'Elevated',
    badge: 'bg-red-50 text-red-700 ring-1 ring-red-200',
  },
};

interface SNPCardProps {
  result: SNPResult;
}

export function SNPCard({ result }: SNPCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const risk = RISK_STYLES[result.riskLevel];
  const categoryColor =
    CATEGORY_COLORS[result.category] ?? 'bg-stone-100 text-stone-700';

  return (
    <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
      {/* Collapsed header — always visible */}
      <button
        className="w-full flex items-center gap-3 p-4 text-left hover:bg-stone-50 transition-colors"
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
      >
        {/* Risk indicator dot */}
        <span
          className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${risk.dot}`}
          aria-hidden="true"
        />

        {/* Gene name */}
        <span className="font-semibold text-stone-900 text-sm">
          {result.gene}
        </span>

        {/* Topic (hidden on small screens) */}
        <span className="text-stone-500 text-xs flex-1 truncate hidden sm:block">
          {result.topic}
        </span>

        {/* Risk badge */}
        <span
          className={`text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${risk.badge}`}
        >
          {risk.label}
        </span>

        {/* Info icon with tooltip */}
        <div
          className="relative flex-shrink-0"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          onClick={(e) => e.stopPropagation()}
          onKeyDown={(e) => e.stopPropagation()}
          role="presentation"
        >
          <span
            className="text-stone-400 hover:text-stone-600 p-0.5 inline-flex"
            aria-label={`Info about ${result.topic}`}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </span>
          {showTooltip && (
            <div className="absolute z-20 right-0 bottom-7 w-56 bg-stone-800 text-white text-xs rounded-lg p-2.5 shadow-xl pointer-events-none">
              <p className="font-semibold mb-1">{result.rsid}</p>
              <p className="text-stone-300">
                Chr {result.chromosome} &middot; Genotype: {result.genotype}
              </p>
              <p className="text-stone-300 mt-1">{result.topic}</p>
            </div>
          )}
        </div>

        {/* Expand/collapse chevron */}
        <svg
          className={`w-4 h-4 text-stone-400 flex-shrink-0 transition-transform ${expanded ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Expanded detail */}
      {expanded && (
        <div className="px-4 pb-4 border-t border-stone-100 pt-3 space-y-3">
          {/* Meta row */}
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded-full ${categoryColor}`}
            >
              {result.category}
            </span>
            <span className="text-xs text-stone-500 font-mono">
              {result.rsid}
            </span>
            <span className="text-xs text-stone-500">
              Genotype:{' '}
              <strong className="text-stone-700 font-mono">
                {result.genotype}
              </strong>
            </span>
          </div>

          {/* Insight */}
          <div>
            <p className="text-xs font-semibold text-stone-600 uppercase tracking-wide mb-1">
              Insight
            </p>
            <p className="text-sm text-stone-700 leading-relaxed">
              {result.insight}
            </p>
          </div>

          {/* Recommendation */}
          <div className="bg-emerald-50 rounded-lg p-3">
            <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wide mb-1">
              Recommendation
            </p>
            <p className="text-sm text-emerald-900 leading-relaxed">
              {result.recommendation}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
