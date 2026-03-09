import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

declare global {
  interface Window { __API_URL__?: string }
}

async function init() {
  try {
    const res = await fetch('/config.json')
    if (res.ok) {
      const cfg = await res.json() as { apiUrl?: string }
      if (cfg.apiUrl) window.__API_URL__ = cfg.apiUrl.replace(/\/$/, '')
    }
  } catch {
    // Sin config.json: se usa VITE_API_URL o localhost
  }
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
}

init()
