import { useState } from 'react';
import type { RecommendationReport, SNPResult } from '../types';
import { RecommendationPanel } from './RecommendationPanel';
import { SNPCard } from './SNPCard';

const PRIORITY_STYLES: Record<string, string> = {
  essential: 'bg-green-100 text-green-800',
  beneficial: 'bg-blue-100 text-blue-800',
  optional: 'bg-stone-100 text-stone-600',
};

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

interface ResultsDashboardProps {
  report: RecommendationReport;
  isNarrativeLoading: boolean;
}

export function ResultsDashboard({
  report,
  isNarrativeLoading,
}: ResultsDashboardProps) {
  const { snpResults, supplementStack, fitnessProtocols, narrativeSummary } =
    report;

  // Group SNPs by category for tabbed view
  const byCategory = snpResults.reduce<Record<string, SNPResult[]>>(
    (acc, snp) => {
      (acc[snp.category] ??= []).push(snp);
      return acc;
    },
    {},
  );

  const categories = Object.keys(byCategory);
  const [activeCategory, setActiveCategory] = useState<string>(
    categories[0] ?? '',
  );

  return (
    <div className="w-full max-w-4xl mx-auto space-y-10">
      {/* ── AI Narrative ──────────────────────────────────────────── */}
      <section>
        <h2 className="text-lg font-bold text-stone-800 mb-3">
          Your Wellness Narrative
        </h2>
        <RecommendationPanel
          narrativeSummary={narrativeSummary}
          isLoading={isNarrativeLoading}
        />
      </section>

      {/* ── Supplement Stack ──────────────────────────────────────── */}
      {supplementStack.length > 0 && (
        <section>
          <h2 className="text-lg font-bold text-stone-800 mb-4">
            Supplement Stack
            <span className="ml-2 text-sm font-normal text-stone-500">
              {supplementStack.length} recommendations
            </span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {supplementStack.map((supp) => (
              <div
                key={supp.name}
                className="bg-white border border-stone-200 rounded-xl p-4 flex flex-col gap-2"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="font-semibold text-stone-900 text-sm leading-tight">
                    {supp.name}
                  </p>
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${PRIORITY_STYLES[supp.priority] ?? ''}`}
                  >
                    {supp.priority}
                  </span>
                </div>
                <p className="text-sm text-stone-700 font-medium">
                  {supp.dosage}
                </p>
                <p className="text-xs text-stone-500">{supp.timing}</p>
                <p className="text-xs text-stone-600 leading-relaxed mt-1 border-t border-stone-100 pt-2">
                  {supp.reason}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Fitness Protocol ──────────────────────────────────────── */}
      {fitnessProtocols.length > 0 && (
        <section>
          <h2 className="text-lg font-bold text-stone-800 mb-4">
            Fitness Protocol
            <span className="ml-2 text-sm font-normal text-stone-500">
              {fitnessProtocols.length} areas
            </span>
          </h2>
          <div className="space-y-3">
            {fitnessProtocols.map((protocol) => (
              <div
                key={protocol.area}
                className="bg-white border border-stone-200 rounded-xl p-4"
              >
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-semibold text-stone-900">
                    {protocol.area}
                  </h3>
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-full ${PRIORITY_STYLES[protocol.priority] ?? ''}`}
                  >
                    {protocol.priority}
                  </span>
                </div>
                <p className="text-sm text-stone-700 leading-relaxed">
                  {protocol.guidance}
                </p>
                <p className="text-xs text-stone-500 mt-2 italic">
                  {protocol.reason}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── SNP Explorer (tabbed by category) ─────────────────────── */}
      {snpResults.length > 0 && (
        <section>
          <h2 className="text-lg font-bold text-stone-800 mb-4">
            SNP Explorer
            <span className="ml-2 text-sm font-normal text-stone-500">
              {snpResults.length} markers analyzed
            </span>
          </h2>

          {/* Category tabs */}
          <div className="flex gap-2 flex-wrap mb-4">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={[
                  'text-xs font-medium px-3 py-1.5 rounded-full transition-colors',
                  activeCategory === cat
                    ? 'bg-emerald-700 text-white'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200',
                ].join(' ')}
              >
                {cat}
                <span className="ml-1.5 opacity-70">
                  ({byCategory[cat]?.length ?? 0})
                </span>
              </button>
            ))}
          </div>

          {/* Active category SNP cards */}
          <div className="space-y-2">
            {(byCategory[activeCategory] ?? []).map((snp) => (
              <SNPCard key={snp.rsid} result={snp} />
            ))}
          </div>
        </section>
      )}

      {/* ── Privacy footer banner ─────────────────────────────────── */}
      <footer className="bg-emerald-50 border border-emerald-200 rounded-xl p-5">
        <PrivacyBadge />
      </footer>
    </div>
  );
}
