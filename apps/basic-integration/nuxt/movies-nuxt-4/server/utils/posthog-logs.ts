import { PostHog } from 'posthog-node'

let posthogLogs: PostHog | undefined

export function getPostHogLogger() {
  if (posthogLogs) {
    return posthogLogs.logger
  }

  const runtimeConfig = useRuntimeConfig()
  const projectToken = runtimeConfig.public.posthog.projectToken
  const host = runtimeConfig.public.posthog.host

  if (!projectToken || !host) {
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
      serviceName: 'movies-nuxt',
    },
  })

  return posthogLogs.logger
}

export async function flushPostHogLogs() {
  await posthogLogs?.flush().catch(() => {})
}

export async function shutdownPostHogLogs() {
  if (posthogLogs) {
    await posthogLogs.shutdown(3000).catch(() => {})
    posthogLogs = undefined
  }
}
