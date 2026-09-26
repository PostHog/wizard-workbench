import { usePostHog } from 'posthog-js/react'

function App() {
  const posthog = usePostHog()

  return (
    <main style={{ padding: '2rem', fontFamily: 'system-ui' }}>
      <h1>Vite + React + PostHog test fixture</h1>
      <p>This page exists to give the bundler something to ship.</p>
      <button onClick={() => posthog?.capture('button_clicked')}>
        Capture event
      </button>
      {/* POSTHOG TEST - REMOVE AFTER TESTING */}
      <button onClick={() => posthog?.captureException(new Error('PostHog source maps test'))}>
        Test PostHog Error Tracking
      </button>
      {/* END POSTHOG TEST */}
    </main>
  )
}

export default App
