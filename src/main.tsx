import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { SupplementCardPreview } from './components/SupplementCardPreview'

const isPreview =
  import.meta.env.DEV &&
  new URLSearchParams(window.location.search).get('preview') ===
    'supplement-cards'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {isPreview ? (
      <div className="min-h-screen bg-stone-50 py-10 px-4">
        <SupplementCardPreview />
      </div>
    ) : (
      <App />
    )}
  </StrictMode>,
)
