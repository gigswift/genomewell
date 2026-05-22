import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../docs/design/handoff/chronicwellness.css'
import './index.css'
import App from './App.tsx'
import { initTracking } from './lib/tracking'

initTracking();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
