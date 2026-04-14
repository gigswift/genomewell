import { useRef, useState, type DragEvent, type ChangeEvent } from 'react';

interface FileUploadProps {
  onFile: (file: File) => void;
}

export function FileUpload({ onFile }: FileUploadProps) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) onFile(file);
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) onFile(file);
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Drop zone */}
      <div
        role="button"
        tabIndex={0}
        aria-label="Upload DNA file — click or drag and drop"
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click(); }}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={[
          'border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-200',
          dragging
            ? 'border-emerald-500 bg-emerald-50 scale-[1.01]'
            : 'border-stone-300 bg-white hover:border-emerald-400 hover:bg-emerald-50',
        ].join(' ')}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
            <svg className="w-8 h-8 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <p className="text-lg font-semibold text-stone-800">
              {dragging ? 'Drop your DNA file here' : 'Upload your raw DNA file'}
            </p>
            <p className="text-sm text-stone-500 mt-1">
              Accepts .txt or .zip from 23andMe or AncestryDNA
            </p>
          </div>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
            className="px-6 py-2.5 bg-emerald-700 text-white rounded-lg font-medium hover:bg-emerald-800 transition-colors text-sm"
          >
            Browse files
          </button>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept=".txt,.zip"
          className="hidden"
          onChange={handleChange}
          aria-label="DNA file input"
        />
      </div>

      {/* Source instructions */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white border border-stone-200 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 text-xs font-bold flex items-center justify-center">23</span>
            <h3 className="font-semibold text-stone-800 text-sm">23andMe</h3>
          </div>
          <ol className="text-xs text-stone-600 space-y-1 list-decimal list-inside">
            <li>Go to <strong>Settings</strong></li>
            <li>Click <strong>23andMe Data</strong></li>
            <li>Click <strong>Download Raw Data</strong></li>
            <li>Upload the .zip or .txt here</li>
          </ol>
        </div>
        <div className="bg-white border border-stone-200 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center">A</span>
            <h3 className="font-semibold text-stone-800 text-sm">AncestryDNA</h3>
          </div>
          <ol className="text-xs text-stone-600 space-y-1 list-decimal list-inside">
            <li>Go to <strong>Settings</strong></li>
            <li>Click <strong>Privacy</strong></li>
            <li>Click <strong>Download Your Data</strong></li>
            <li>Upload the .zip or .txt here</li>
          </ol>
        </div>
      </div>

      {/* Privacy callout */}
      <div className="mt-6 bg-emerald-50 border border-emerald-200 rounded-xl p-5 flex gap-3">
        <svg className="w-5 h-5 text-emerald-700 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
        <div>
          <p className="text-sm font-semibold text-emerald-800">Your DNA never leaves your device</p>
          <p className="text-xs text-emerald-700 mt-0.5">
            All file parsing happens locally in your browser. Only structured genetic marker results
            (not your raw file) are sent to Claude to generate your wellness narrative.
            No genetic data is stored or transmitted to any server.
          </p>
        </div>
      </div>
    </div>
  );
}
