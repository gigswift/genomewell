import { useEffect, useRef, useState } from 'react';
import { Landing, type ParseState } from './components/Landing';
import { Dashboard } from './components/Dashboard';
import { ErrorBoundary } from './components/ErrorBoundary';
import { parseRawDNA } from './services/parseRawDNA';
import { recommendSupplements } from './services/recommendSupplements';
import type {
  Genotype,
  GroupedRecommendations,
} from './types';

const PROGRESS_DURATION_MS = 1800;
const PROGRESS_CAP_BEFORE_READY = 90;
const DONE_HOLD_MS = 650;

export default function App() {
  const [parseState, setParseState] = useState<ParseState>('idle');
  const [progress, setProgress] = useState(0);
  const [snpMap, setSnpMap] = useState<Map<string, Genotype> | null>(null);
  const [grouped, setGrouped] = useState<GroupedRecommendations | null>(null);
  const [totalRowsParsed, setTotalRowsParsed] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [showResults, setShowResults] = useState(false);

  const rafRef = useRef<number | null>(null);
  const parseStartRef = useRef<number>(0);
  const parseReadyRef = useRef<boolean>(false);

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  function startProgressAnimation() {
    parseStartRef.current = performance.now();
    parseReadyRef.current = false;

    const tick = () => {
      const elapsed = performance.now() - parseStartRef.current;
      const t = Math.min(1, elapsed / PROGRESS_DURATION_MS);
      // Ease-out cubic: decelerates into 90%
      const eased = 1 - Math.pow(1 - t, 3);
      const nextProgress = parseReadyRef.current
        ? 100
        : PROGRESS_CAP_BEFORE_READY * eased;

      setProgress((prev) => (nextProgress > prev ? nextProgress : prev));

      if (parseReadyRef.current && nextProgress >= 100) {
        rafRef.current = null;
        return;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }

  function stopProgressAndFinalize() {
    parseReadyRef.current = true;
    // rAF loop will snap to 100 on next frame. Force immediate snap too.
    setProgress(100);
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
  }

  async function handleFile(file: File) {
    setErrorMsg('');
    setShowResults(false);
    setProgress(0);
    setParseState('parsing');
    startProgressAnimation();

    try {
      const { engineSnpMap, totalRowsParsed: total } = await parseRawDNA(file);
      const { grouped: g } = recommendSupplements(engineSnpMap);

      setSnpMap(engineSnpMap);
      setGrouped(g);
      setTotalRowsParsed(total);

      stopProgressAndFinalize();
      setParseState('done');

      setTimeout(() => setShowResults(true), DONE_HOLD_MS);
    } catch (err) {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      setErrorMsg(err instanceof Error ? err.message : String(err));
      setParseState('idle');
      setProgress(0);
    }
  }

  function reset() {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    setParseState('idle');
    setProgress(0);
    setSnpMap(null);
    setGrouped(null);
    setTotalRowsParsed(0);
    setShowResults(false);
    setErrorMsg('');
  }

  const variantsMatched = grouped
    ? new Set(
        Object.values(grouped)
          .flat()
          .flatMap((r) => r.firedPrimary),
      ).size
    : 0;

  if (showResults && grouped && snpMap) {
    return (
      <ErrorBoundary>
        <Dashboard
          grouped={grouped}
          snpMap={snpMap}
          totalRowsParsed={totalRowsParsed}
          onReset={reset}
        />
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <Landing
        parseState={parseState}
        progress={progress}
        variantsMatched={variantsMatched}
        errorMsg={errorMsg}
        onFile={handleFile}
      />
    </ErrorBoundary>
  );
}
