import { usePostHog } from 'posthog-js/react'
import { eventName } from '@repo/shared'

function App() {
  const posthog = usePostHog()

  return (
    <main style={{ padding: '2rem', fontFamily: 'system-ui' }}>
      <h1>Vite + React + PostHog test fixture (pnpm workspace)</h1>
      <p>This page exists to give the bundler something to ship.</p>
      <button onClick={() => posthog?.capture(eventName('frontend', 'button_clicked'))}>
        Capture event
      </button>
    </main>
  )
}

export default App
