import { useState } from 'react';
import type {
  GroupedRecommendations,
  SupplementCategory,
} from '../types';
import { CATEGORY_LABELS, CATEGORY_ORDER } from '../lib/supplementLabels';
import { RecommendationPanel } from './RecommendationPanel';
import { SupplementCard } from './SupplementCard';

interface SupplementDashboardProps {
  grouped: GroupedRecommendations;
  narrativeSummary: string;
  isNarrativeLoading: boolean;
}

function PrivacyBadge() {
  return (
    <div className="flex items-start gap-3">
      <svg
        className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
        />
      </svg>
      <p className="text-sm text-emerald-800">
        <strong>This analysis ran entirely on your device.</strong> No genetic
        data was transmitted. Only structured marker results were sent to Claude
        for your narrative.
      </p>
    </div>
  );
}

export function SupplementDashboard({
  grouped,
  narrativeSummary,
  isNarrativeLoading,
}: SupplementDashboardProps) {
  const [activeCategory, setActiveCategory] =
    useState<SupplementCategory>('daily-wellness');

  const activeRecs = grouped[activeCategory];
  const totalRecs = CATEGORY_ORDER.reduce(
    (n, cat) => n + grouped[cat].length,
    0,
  );

  return (
    <div className="w-full max-w-4xl mx-auto space-y-10">
      {/* AI narrative — supplement-centric wellness summary */}
      <section>
        <h2 className="text-lg font-bold text-stone-800 mb-3">
          Your Wellness Narrative
        </h2>
        <RecommendationPanel
          narrativeSummary={narrativeSummary}
          isLoading={isNarrativeLoading}
        />
      </section>

      {/* v1: a unified "Shop this stack" CTA could land here once Task 8
          click-tracking proves users want cross-partner consolidated checkout.
          v0 is per-card only — multi-partner makes a single checkout impossible. */}

      {/* Category tabs */}
      <section>
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="text-lg font-bold text-stone-800">
            Your Supplement Stack
          </h2>
          <span className="text-sm text-stone-500">
            {totalRecs} recommendation{totalRecs === 1 ? '' : 's'}
          </span>
        </div>

        <div
          role="tablist"
          aria-label="Supplement categories"
          className="flex gap-2 flex-wrap mb-6"
        >
          {CATEGORY_ORDER.map((cat) => {
            const count = grouped[cat].length;
            const isActive = cat === activeCategory;
            return (
              <button
                key={cat}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveCategory(cat)}
                className={[
                  'text-sm font-medium px-4 py-2 rounded-full transition-colors',
                  isActive
                    ? 'bg-emerald-700 text-white'
                    : 'bg-stone-100 text-stone-700 hover:bg-stone-200',
                ].join(' ')}
              >
                {CATEGORY_LABELS[cat]}
                <span
                  className={[
                    'ml-2 text-xs',
                    isActive ? 'opacity-80' : 'text-stone-500',
                  ].join(' ')}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active tab content */}
        <div role="tabpanel" aria-label={CATEGORY_LABELS[activeCategory]}>
          {activeRecs.length === 0 ? (
            <div className="bg-stone-50 border border-stone-200 rounded-xl p-6 text-center text-sm text-stone-600">
              No recommendations in this category based on your markers.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* v1: gate cards beyond index 4 behind account signup —
                  see docs/product-strategy.md lines 29-32. v0 has no account
                  system so the full list is always visible. */}
              {activeRecs.map((rec) => (
                <SupplementCard
                  key={rec.supplement.name}
                  recommendation={rec}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Privacy footer banner */}
      <footer className="bg-emerald-50 border border-emerald-200 rounded-xl p-5">
        <PrivacyBadge />
      </footer>
    </div>
  );
}
