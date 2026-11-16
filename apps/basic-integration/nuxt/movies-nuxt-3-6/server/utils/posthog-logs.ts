import { PostHog } from 'posthog-node'

let posthogLogs: PostHog | undefined
let warnedAboutMissingConfiguration = false

function getPostHogLogs(): PostHog | undefined {
  if (posthogLogs)
    return posthogLogs

  const projectToken = process.env.NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN
  const host = process.env.NUXT_PUBLIC_POSTHOG_HOST

  if (!projectToken || !host) {
    if (process.env.NODE_ENV !== 'production' && !warnedAboutMissingConfiguration) {
      if (!projectToken)
        console.warn('NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN is configured')

      if (!host)
        console.warn('NUXT_PUBLIC_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NUXT_PUBLIC_POSTHOG_HOST is configured')

      warnedAboutMissingConfiguration = true
    }

    return undefined
  }

  posthogLogs = new PostHog(projectToken, {
    host,
    enableExceptionAutocapture: true,
    flushAt: 1,
    flushInterval: 0,
    requestTimeout: 2000,
    fetchRetryCount: 0,
    logs: {
      serviceName: 'movies-nuxt-3-6',
    },
  })

  return posthogLogs
}

export async function logAuthenticationCompleted(): Promise<void> {
  const client = getPostHogLogs()
  client?.logger.info('authentication login completed', {
    route: '/api/auth/login',
  })
  await client?.flush().catch(() => {})
}

export async function logLogoutCompleted(): Promise<void> {
  const client = getPostHogLogs()
  client?.logger.info('authentication logout completed', {
    route: '/api/auth/logout',
  })
  await client?.flush().catch(() => {})
}

export async function shutdownPostHogLogs(): Promise<void> {
  if (posthogLogs)
    await posthogLogs.shutdown(3000).catch(() => {})
}
