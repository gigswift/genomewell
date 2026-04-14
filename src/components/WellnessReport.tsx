import type { SNPResult, HealthCategory } from '../types';

interface WellnessReportProps {
  narrative: string;
  snps: SNPResult[];
  onReset: () => void;
}

const CATEGORY_ICONS: Record<HealthCategory, string> = {
  'Blood Disorders': '🩸',
  'Kidney Health': '🫘',
  'Cardiovascular': '❤️',
  'Metabolic': '⚡',
  'Nutrition & Vitamins': '🌿',
  'Drug Metabolism': '💊',
  'Cancer Risk': '🔬',
  'Cognitive Health': '🧠',
  'Inflammation': '🔥',
};

// Very lightweight markdown renderer — handles ## headings, **bold**, and - bullet points
function renderMarkdown(text: string): string {
  const lines = text.split('\n');
  const html: string[] = [];
  let inList = false;

  for (const raw of lines) {
    const line = raw
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.+?)\*/g, '<em>$1</em>');

    if (line.startsWith('## ')) {
      if (inList) { html.push('</ul>'); inList = false; }
      html.push(`<h2 class="md-h2">${line.slice(3)}</h2>`);
    } else if (line.startsWith('# ')) {
      if (inList) { html.push('</ul>'); inList = false; }
      html.push(`<h1 class="md-h1">${line.slice(2)}</h1>`);
    } else if (line.startsWith('- ') || line.startsWith('• ')) {
      if (!inList) { html.push('<ul class="md-ul">'); inList = true; }
      html.push(`<li class="md-li">${line.slice(2)}</li>`);
    } else if (line.trim() === '') {
      if (inList) { html.push('</ul>'); inList = false; }
      html.push('<div class="md-spacer"></div>');
    } else {
      if (inList) { html.push('</ul>'); inList = false; }
      html.push(`<p class="md-p">${line}</p>`);
    }
  }

  if (inList) html.push('</ul>');
  return html.join('');
}

export function WellnessReport({ narrative, snps, onReset }: WellnessReportProps) {
  const byCategory = snps.reduce<Record<string, SNPResult[]>>((acc, snp) => {
    (acc[snp.category] ??= []).push(snp);
    return acc;
  }, {});

  return (
    <div className="w-full max-w-3xl mx-auto space-y-8">
      {/* Header bar */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-stone-900">Your Wellness Report</h2>
          <p className="text-sm text-stone-500 mt-0.5">{snps.length} genetic markers analyzed</p>
        </div>
        <button
          onClick={onReset}
          className="text-sm text-emerald-700 hover:text-emerald-900 font-medium flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          Upload another file
        </button>
      </div>

      {/* AI Narrative */}
      <div className="bg-white border border-stone-200 rounded-2xl p-8 shadow-sm">
        <div
          className="prose-genomewell"
          // eslint-disable-next-line react-dom/no-dangerously-set-innerhtml
          dangerouslySetInnerHTML={{ __html: renderMarkdown(narrative) }}
        />
      </div>

      {/* SNP breakdown */}
      {Object.entries(byCategory).length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-stone-800 mb-4">Markers by Category</h3>
          <div className="grid grid-cols-1 gap-4">
            {Object.entries(byCategory).map(([category, items]) => (
              <div key={category} className="bg-white border border-stone-200 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span aria-hidden="true">{CATEGORY_ICONS[category as HealthCategory] ?? '🧬'}</span>
                  <h4 className="font-semibold text-stone-800">{category}</h4>
                  <span className="ml-auto text-xs text-stone-500 bg-stone-100 px-2 py-0.5 rounded-full">
                    {items.length} marker{items.length !== 1 ? 's' : ''}
                  </span>
                </div>
                <table className="w-full text-xs text-stone-600">
                  <thead>
                    <tr className="border-b border-stone-100 text-left">
                      <th className="pb-2 font-medium text-stone-500">rsID</th>
                      <th className="pb-2 font-medium text-stone-500">Gene</th>
                      <th className="pb-2 font-medium text-stone-500 hidden sm:table-cell">Topic</th>
                      <th className="pb-2 font-medium text-stone-500 text-right">Genotype</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((snp) => (
                      <tr key={snp.rsid} className="border-b border-stone-50 last:border-0">
                        <td className="py-1.5 font-mono text-emerald-700">{snp.rsid}</td>
                        <td className="py-1.5 font-semibold">{snp.gene}</td>
                        <td className="py-1.5 hidden sm:table-cell text-stone-500">{snp.topic}</td>
                        <td className="py-1.5 text-right font-mono font-bold text-stone-800">{snp.genotype}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Privacy footer */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex gap-3 text-sm">
        <svg className="w-5 h-5 text-emerald-700 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        <p className="text-emerald-800">
          <strong>Privacy reminder:</strong> Your raw DNA file was parsed in your browser. Only the structured
          marker results above were sent to Claude. No raw genetic data was stored or transmitted.
        </p>
      </div>
    </div>
  );
}
