let clientPromise: Promise<(typeof import('posthog-js'))['default'] | null> | undefined

export function getPostHog() {
  if (typeof window === 'undefined') return Promise.resolve(null)

  clientPromise ??= (async () => {
    const token = import.meta.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN
    if (!token) {
      if (import.meta.env.DEV) {
        throw new Error(
          'VITE_PUBLIC_POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once VITE_PUBLIC_POSTHOG_PROJECT_TOKEN is configured'
        )
      }
      return null
    }

    const host = import.meta.env.VITE_PUBLIC_POSTHOG_HOST
    if (!host) {
      if (import.meta.env.DEV) {
        throw new Error(
          'VITE_PUBLIC_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once VITE_PUBLIC_POSTHOG_HOST is configured'
        )
      }
      return null
    }

    const { default: posthog } = await import('posthog-js')
    posthog.init(token, {
      api_host: host,
      defaults: '2026-01-30',
      logs: {
        serviceName: 'clouthub-web',
        environment: import.meta.env.MODE,
      },
    })

    return posthog
  })()

  return clientPromise
}

type PostHogLogAttributes = Record<string, string | number | boolean>

export const posthogLogger = {
  info: async (message: string, attributes: PostHogLogAttributes) => {
    const posthog = await getPostHog()
    posthog?.logger.info(message, attributes)
  },
}
