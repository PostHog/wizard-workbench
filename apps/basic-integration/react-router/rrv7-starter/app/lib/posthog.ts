const projectToken = import.meta.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN
const host = import.meta.env.VITE_PUBLIC_POSTHOG_HOST

type PostHogClient = (typeof import('posthog-js'))['default']
type CaptureProperties = Parameters<PostHogClient['capture']>[1]
type LogAttributes = Parameters<PostHogClient['logger']['info']>[1]

let posthogPromise: Promise<PostHogClient> | null = null

if (typeof window !== 'undefined') {
  if (!projectToken) {
    if (import.meta.env.DEV) {
      throw new Error(
        'VITE_PUBLIC_POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once VITE_PUBLIC_POSTHOG_PROJECT_TOKEN is configured'
      )
    }
  } else if (!host) {
    if (import.meta.env.DEV) {
      throw new Error(
        'VITE_PUBLIC_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once VITE_PUBLIC_POSTHOG_HOST is configured'
      )
    }
  } else {
    posthogPromise = import('posthog-js').then(({ default: posthog }) => {
      posthog.init(projectToken, {
        api_host: host,
        defaults: '2026-01-30',
        logs: {
          serviceName: 'clouthub-web',
          environment: import.meta.env.MODE,
        },
      })
      return posthog
    })
  }
}

const posthog = {
  capture(event: string, properties?: CaptureProperties) {
    void posthogPromise?.then((client) => client.capture(event, properties))
  },
  captureException(error: Error) {
    void posthogPromise?.then((client) => client.captureException(error))
  },
  logger: {
    info(message: string, attributes?: LogAttributes) {
      void posthogPromise?.then((client) => client.logger.info(message, attributes))
    },
  },
}

export default posthog
