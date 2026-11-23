import { PostHog } from 'posthog-node'

let posthogClient: PostHog | null = null

function warnForMissingConfiguration(variableName: string) {
  if (process.env.NODE_ENV !== 'production') {
    console.warn(
      `${variableName} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${variableName} is configured`,
    )
  }
}

export function getPostHogClient() {
  const token =
    process.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN ||
    import.meta.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN
  const host =
    process.env.VITE_PUBLIC_POSTHOG_HOST || import.meta.env.VITE_PUBLIC_POSTHOG_HOST

  if (!token) {
    warnForMissingConfiguration('VITE_PUBLIC_POSTHOG_PROJECT_TOKEN')
    return null
  }

  if (!host) {
    warnForMissingConfiguration('VITE_PUBLIC_POSTHOG_HOST')
    return null
  }

  if (!posthogClient) {
    posthogClient = new PostHog(token, {
      host,
      enableExceptionAutocapture: true,
      logs: {
        serviceName: 'tanstack-start-saas',
      },
      flushAt: 1,
      flushInterval: 0,
      requestTimeout: 2000,
      fetchRetryCount: 0,
    })
  }

  return posthogClient
}

export async function capturePostHogEvent(
  event: string,
  properties: Record<string, string | number | string[]>,
) {
  const posthog = getPostHogClient()
  if (!posthog) return

  posthog.capture({ event, properties })
  await posthog.flush().catch(() => {})
}

export async function logPostHogInvoiceLifecycle(
  message: string,
  attributes: Record<string, string | number>,
) {
  const posthog = getPostHogClient()
  if (!posthog) return

  posthog.logger.info(message, attributes)
  await posthog.flush().catch(() => {})
}
