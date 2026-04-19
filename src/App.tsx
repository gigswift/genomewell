import { useState } from 'react';
import { FileUpload } from './components/FileUpload';
import { SupplementDashboard } from './components/SupplementDashboard';
import { ErrorBoundary } from './components/ErrorBoundary';
import { parseRawDNA } from './services/parseRawDNA';
import { recommendSupplements } from './services/recommendSupplements';
import { generateNarrativeSummary } from './services/generateNarrativeSummary';
import { NARRATIVE_FALLBACK } from './types';
import type {
  AppStep,
  RecommendationReport,
  SNPResult,
} from './types';
import './App.css';

const WELLNESS_GOALS = [
  'Heart Health',
  'Energy & Metabolism',
  'Brain & Cognitive',
  'Inflammation & Recovery',
] as const;

export default function App() {
  const [step, setStep] = useState<AppStep>('upload');
  const [goals, setGoals] = useState<string[]>([]);
  const [parsedDNA, setParsedDNA] = useState<SNPResult[]>([]);
  const [report, setReport] = useState<RecommendationReport | null>(null);
  const [narrativeLoading, setNarrativeLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  async function handleFile(file: File) {
    setErrorMsg('');
    setStep('parsing');
    try {
      // 1. Parse DNA file locally (SNPResult[] feeds the narrative; engineSnpMap feeds the recommender)
      const { results: snps, engineSnpMap } = await parseRawDNA(file);
      setParsedDNA(snps);

      // 2. Build recommendations synchronously via supplement-centric engine
      const { grouped } = recommendSupplements(engineSnpMap);

      // 3. Set partial report (with fallback narrative) and go to results
      const partialReport: RecommendationReport = {
        grouped,
        narrativeSummary: NARRATIVE_FALLBACK,
      };
      setReport(partialReport);
      setStep('results');

      // 4. Generate AI narrative in background
      setNarrativeLoading(true);
      generateNarrativeSummary(snps, goals)
        .then((narrative) => {
          setReport((prev) =>
            prev ? { ...prev, narrativeSummary: narrative } : prev,
          );
          setNarrativeLoading(false);
        })
        .catch(() => {
          setNarrativeLoading(false);
        });
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : String(err));
      setStep('upload');
    }
  }

  function toggleGoal(goal: string) {
    setGoals((prev) =>
      prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal],
    );
  }

  function reset() {
    setStep('upload');
    setParsedDNA([]);
    setReport(null);
    setNarrativeLoading(false);
    setErrorMsg('');
  }

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      {/* Header */}
      <header className="bg-emerald-900 text-white">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-3">
          <svg
            className="w-8 h-8 text-emerald-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18"
            />
          </svg>
          <div>
            <span className="text-xl font-bold tracking-tight">
              GenomeWell
            </span>
            <span className="text-emerald-300 text-sm ml-2 hidden sm:inline">
              Privacy-First Genetic Wellness
            </span>
          </div>
          {step === 'results' && (
            <button
              onClick={reset}
              className="ml-auto text-xs text-emerald-300 hover:text-white flex items-center gap-1 transition-colors"
            >
              &larr; Start over
            </button>
          )}
        </div>
      </header>

      {/* Hero — upload & landing screens */}
      {(step === 'upload' || step === 'landing') && (
        <section className="bg-emerald-900 text-white pb-16 pt-10">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <h1 className="text-3xl sm:text-4xl font-bold leading-tight">
              Know your genes.
              <br />
              <span className="text-emerald-300">Own your wellness.</span>
            </h1>
            <p className="mt-4 text-emerald-100 text-lg max-w-xl mx-auto">
              GenomeWell analyzes your raw DNA file entirely in your browser and
              uses AI to generate a personalized wellness narrative — with
              special attention to the health landscape of the Black American
              community.
            </p>

            {/* Goal pills */}
            <div className="mt-6 flex gap-2 flex-wrap justify-center">
              {WELLNESS_GOALS.map((goal) => (
                <button
                  key={goal}
                  onClick={() => toggleGoal(goal)}
                  className={[
                    'text-xs px-3 py-1.5 rounded-full border transition-colors',
                    goals.includes(goal)
                      ? 'bg-emerald-300 text-emerald-900 border-emerald-300 font-semibold'
                      : 'border-emerald-500 text-emerald-200 hover:border-emerald-300 hover:text-white',
                  ].join(' ')}
                >
                  {goal}
                </button>
              ))}
            </div>
            {goals.length > 0 && (
              <p className="mt-2 text-emerald-300 text-xs">
                Your narrative will emphasize{' '}
                {goals.join(', ').replace(/, ([^,]*)$/, ' & $1')}
              </p>
            )}
          </div>
        </section>
      )}

      {/* Main content */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-10">
        {(step === 'upload' || step === 'landing') && (
          <>
            {errorMsg && (
              <div className="max-w-2xl mx-auto mb-6 bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-800">
                <strong>Error:</strong> {errorMsg}
              </div>
            )}
            <ErrorBoundary>
              <FileUpload onFile={handleFile} />
            </ErrorBoundary>
          </>
        )}

        {step === 'parsing' && (
          <div className="flex flex-col items-center gap-6 py-20 text-center">
            <div
              className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-700 rounded-full animate-spin"
              aria-label="Loading"
            />
            <div>
              <p className="text-lg font-semibold text-stone-800">
                Analyzing your DNA file...
              </p>
              <p className="text-sm text-stone-500 mt-1">
                Parsing and matching genetic markers locally in your browser
              </p>
            </div>
          </div>
        )}

        {step === 'results' && report && parsedDNA.length > 0 && (
          <ErrorBoundary>
            <SupplementDashboard
              grouped={report.grouped}
              narrativeSummary={report.narrativeSummary}
              isNarrativeLoading={narrativeLoading}
            />
          </ErrorBoundary>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-200 bg-white py-6 mt-auto">
        <div className="max-w-5xl mx-auto px-4 text-center text-xs text-stone-400 space-y-1">
          <p>
            GenomeWell is for informational and wellness purposes only. It is
            not a medical device and does not provide medical advice.
          </p>
          <p>
            Always consult a qualified healthcare professional before making
            health decisions based on genetic information.
          </p>
        </div>
      </footer>
    </div>
  );
}
