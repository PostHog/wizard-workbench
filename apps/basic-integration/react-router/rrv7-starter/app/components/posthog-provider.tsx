import { useEffect, useState, type ComponentType, type ReactNode } from 'react'

type ProviderProps = {
  children: ReactNode
  client: object
}

let posthogClient: object | null = null
let PostHogProvider: ComponentType<ProviderProps> | null = null
let PostHogErrorBoundary: ComponentType<{ children: ReactNode }> | null = null
let initialization: Promise<void> | null = null

function initializePostHog() {
  if (initialization) return initialization

  const token = import.meta.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN
  const host = import.meta.env.VITE_PUBLIC_POSTHOG_HOST

  if (!token || !host) {
    if (import.meta.env.DEV) {
      const variable = !token ? 'VITE_PUBLIC_POSTHOG_PROJECT_TOKEN' : 'VITE_PUBLIC_POSTHOG_HOST'
      throw new Error(
        `${variable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${variable} is configured`
      )
    }

    return Promise.resolve()
  }

  initialization = Promise.all([import('posthog-js'), import('@posthog/react')]).then(
    ([{ default: posthog }, { PostHogErrorBoundary: ErrorBoundary, PostHogProvider: Provider }]) => {
      posthog.init(token, {
        api_host: host,
        defaults: '2026-05-30',
        capture_exceptions: {
          capture_console_errors: false,
        },
      })

      posthogClient = posthog
      PostHogProvider = Provider as ComponentType<ProviderProps>
      PostHogErrorBoundary = ErrorBoundary as ComponentType<{ children: ReactNode }>
    }
  )

  return initialization
}

export function PostHogProviderLoader({ children }: { children: ReactNode }) {
  const [client, setClient] = useState<object | null>(posthogClient)
  const [Provider, setProvider] = useState<ComponentType<ProviderProps> | null>(() => PostHogProvider)
  const [ErrorBoundary, setErrorBoundary] = useState<ComponentType<{ children: ReactNode }> | null>(
    () => PostHogErrorBoundary
  )

  useEffect(() => {
    initializePostHog().then(() => {
      setClient(posthogClient)
      setProvider(() => PostHogProvider)
      setErrorBoundary(() => PostHogErrorBoundary)
    })
  }, [])

  if (!client || !Provider || !ErrorBoundary) return children

  return (
    <Provider client={client}>
      <ErrorBoundary>{children}</ErrorBoundary>
    </Provider>
  )
}
