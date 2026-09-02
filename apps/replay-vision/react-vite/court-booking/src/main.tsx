import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import posthog from 'posthog-js'

import { BookCourt } from './routes/BookCourt'
import { Confirmation } from './routes/Confirmation'
import { Courts } from './routes/Courts'

const posthogKey = import.meta.env.VITE_PUBLIC_POSTHOG_KEY
const posthogHost = import.meta.env.VITE_PUBLIC_POSTHOG_HOST

if (!posthogKey || !posthogHost) {
  if (import.meta.env.DEV) {
    throw new Error(
      'VITE_PUBLIC_POSTHOG_KEY and VITE_PUBLIC_POSTHOG_HOST variables required by PostHog are missing or un-configured, this causes events to be silently missed. This error stops appearing once VITE_PUBLIC_POSTHOG_KEY and VITE_PUBLIC_POSTHOG_HOST are configured'
    )
  }
} else {
  posthog.init(posthogKey, {
    api_host: posthogHost,
  })
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Courts />} />
        <Route path="/book/:courtId" element={<BookCourt />} />
        <Route path="/confirmation" element={<Confirmation />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
)
