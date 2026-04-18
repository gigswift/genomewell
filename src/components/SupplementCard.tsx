import type {
  SupplementCategory,
  SupplementPriorityTier,
  SupplementRecommendation,
} from '../types';
import { buildAffiliateUrl, getPartnerDisplayName } from '../lib/affiliateLinks';

const CATEGORY_LABELS: Record<SupplementCategory, string> = {
  'daily-wellness': 'Daily Wellness',
  'healthy-aging': 'Healthy Aging',
  'body-optimization': 'Body Optimization',
  'food-sensitivity': 'Food Sensitivity',
};

const PRIORITY_STYLES: Record<
  SupplementPriorityTier,
  { label: string; badge: string; dot: string }
> = {
  essential: {
    label: 'Essential',
    badge: 'bg-emerald-50 text-emerald-800 ring-1 ring-emerald-200',
    dot: 'bg-emerald-500',
  },
  recommended: {
    label: 'Recommended',
    badge: 'bg-amber-50 text-amber-800 ring-1 ring-amber-200',
    dot: 'bg-amber-500',
  },
  consider: {
    label: 'Consider',
    badge: 'bg-stone-100 text-stone-700 ring-1 ring-stone-200',
    dot: 'bg-stone-400',
  },
  skip: {
    label: 'Skip',
    badge: 'bg-red-50 text-red-800 ring-1 ring-red-200',
    dot: 'bg-red-500',
  },
};

interface SupplementCardProps {
  recommendation: SupplementRecommendation;
}

export function SupplementCard({ recommendation }: SupplementCardProps) {
  const { supplement, priority, dosage, reasoning, partnerOptions } =
    recommendation;
  const priorityStyle = PRIORITY_STYLES[priority];
  const preferred = partnerOptions[0];
  const showShopCta = preferred !== undefined && priority !== 'skip';

  return (
    <article className="bg-white border border-stone-200 rounded-xl p-5 flex flex-col gap-4">
      {/* Header: name, category, priority */}
      <header className="flex items-start gap-3">
        <span
          className={`w-2.5 h-2.5 rounded-full mt-2 flex-shrink-0 ${priorityStyle.dot}`}
          aria-hidden="true"
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-stone-900 text-base leading-snug">
            {supplement.name}
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            {CATEGORY_LABELS[supplement.category]}
          </p>
        </div>
        <span
          className={`text-xs font-medium px-2.5 py-0.5 rounded-full flex-shrink-0 ${priorityStyle.badge}`}
        >
          {priorityStyle.label}
        </span>
      </header>

      {/* Dose */}
      <div className="bg-stone-50 rounded-lg px-3 py-2">
        <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide">
          {priority === 'skip' ? 'What to do' : 'Suggested dose'}
        </p>
        <p className="text-sm text-stone-800 mt-0.5">{dosage}</p>
      </div>

      {/* Reasoning */}
      {reasoning.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-1.5">
            Why this is in your stack
          </p>
          <ul className="space-y-1.5">
            {reasoning.map((line, i) => (
              <li
                key={i}
                className="text-sm text-stone-700 leading-relaxed flex gap-2"
              >
                <span
                  className="text-emerald-600 mt-1 flex-shrink-0"
                  aria-hidden="true"
                >
                  &bull;
                </span>
                <span>
                  <span className="text-stone-500">Your</span> {line}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Shop CTA or gap disclosure */}
      {showShopCta ? (
        <a
          href={buildAffiliateUrl(preferred.partner, preferred.productSlug)}
          target="_blank"
          rel="noopener noreferrer sponsored"
          className="inline-flex items-center justify-center gap-2 w-full bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
        >
          Shop at {getPartnerDisplayName(preferred.partner)}
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
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
        </a>
      ) : priority === 'skip' ? null : (
        <p className="text-xs text-stone-500 italic bg-stone-50 rounded-lg px-3 py-2">
          We don&apos;t currently have a trusted partner for this one. The dose
          and reasoning are yours to take to your practitioner or preferred
          retailer.
        </p>
      )}
    </article>
  );
}
