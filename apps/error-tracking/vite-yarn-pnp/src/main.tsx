import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { PostHogProvider } from 'posthog-js/react'
import './index.css'
import App from './App.tsx'

const posthogOptions = {
  api_host: import.meta.env.VITE_PH_API_HOST,
  defaults: '2025-11-30',
} as const

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PostHogProvider apiKey={import.meta.env.VITE_PH_PROJECT_TOKEN} options={posthogOptions}>
      <App />
    </PostHogProvider>
  </StrictMode>,
)
