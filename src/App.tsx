import { useState } from 'react';
import { FileUpload } from './components/FileUpload';
import { WellnessReport } from './components/WellnessReport';
import { parseDNAFile } from './dnaParser';
import { generateWellnessNarrative } from './claudeClient';
import type { AppState, SNPResult } from './types';
import './App.css';

export default function App() {
  const [state, setState] = useState<AppState>('upload');
  const [snps, setSnps] = useState<SNPResult[]>([]);
  const [narrative, setNarrative] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  async function handleFile(file: File) {
    setErrorMsg('');
    setState('parsing');
    try {
      const parsed = await parseDNAFile(file);
      setSnps(parsed);
      setState('generating');
      const text = await generateWellnessNarrative(parsed);
      setNarrative(text);
      setState('results');
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : String(err));
      setState('error');
    }
  }

  function reset() {
    setState('upload');
    setSnps([]);
    setNarrative('');
    setErrorMsg('');
  }

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col">
      {/* Header */}
      <header className="bg-emerald-900 text-white">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-3">
          <svg className="w-8 h-8 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" />
          </svg>
          <div>
            <span className="text-xl font-bold tracking-tight">GenomeWell</span>
            <span className="text-emerald-300 text-sm ml-2 hidden sm:inline">Privacy-First Genetic Wellness</span>
          </div>
        </div>
      </header>

      {/* Hero — only shown on upload screen */}
      {state === 'upload' && (
        <section className="bg-emerald-900 text-white pb-16 pt-10">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <h1 className="text-3xl sm:text-4xl font-bold leading-tight">
              Know your genes.<br />
              <span className="text-emerald-300">Own your wellness.</span>
            </h1>
            <p className="mt-4 text-emerald-100 text-lg max-w-xl mx-auto">
              GenomeWell analyzes your raw DNA file entirely in your browser and uses AI to generate
              a personalized wellness narrative — with special attention to the health landscape of the
              Black American community.
            </p>
          </div>
        </section>
      )}

      {/* Main content */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-10">
        {state === 'upload' && (
          <FileUpload onFile={handleFile} />
        )}

        {state === 'parsing' && (
          <div className="flex flex-col items-center gap-6 py-20 text-center">
            <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-700 rounded-full animate-spin" aria-label="Loading" />
            <div>
              <p className="text-lg font-semibold text-stone-800">Reading your DNA file…</p>
              <p className="text-sm text-stone-500 mt-1">Parsing is happening locally in your browser</p>
            </div>
          </div>
        )}

        {state === 'generating' && (
          <div className="flex flex-col items-center gap-6 py-20 text-center">
            <div className="w-16 h-16 border-4 border-amber-200 border-t-amber-500 rounded-full animate-spin" aria-label="Loading" />
            <div>
              <p className="text-lg font-semibold text-stone-800">Generating your wellness report…</p>
              <p className="text-sm text-stone-500 mt-1">
                Found {snps.length} genetic markers — Claude is crafting your personalized narrative
              </p>
            </div>
          </div>
        )}

        {state === 'results' && (
          <WellnessReport narrative={narrative} snps={snps} onReset={reset} />
        )}

        {state === 'error' && (
          <div className="max-w-2xl mx-auto py-20">
            <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
              <svg className="w-12 h-12 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <h2 className="text-xl font-bold text-red-800 mb-2">Something went wrong</h2>
              <p className="text-sm text-red-700 mb-6 font-mono bg-red-100 rounded-lg p-3 text-left break-words">
                {errorMsg}
              </p>
              <button
                onClick={reset}
                className="px-6 py-2.5 bg-emerald-700 text-white rounded-lg font-medium hover:bg-emerald-800 transition-colors"
              >
                Try again
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-200 bg-white py-6 mt-auto">
        <div className="max-w-5xl mx-auto px-4 text-center text-xs text-stone-400 space-y-1">
          <p>GenomeWell is for informational and wellness purposes only. It is not a medical device and does not provide medical advice.</p>
          <p>Always consult a qualified healthcare professional before making health decisions based on genetic information.</p>
        </div>
      </footer>
    </div>
  );
}
