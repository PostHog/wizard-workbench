import { PostHog } from 'posthog-node'

const projectToken = process.env.NUXT_PUBLIC_POSTHOG_PROJECT_TOKEN
const host = process.env.NUXT_PUBLIC_POSTHOG_HOST

const posthogLogClient = projectToken && host
  ? new PostHog(projectToken, {
    host,
    logs: {
      serviceName: 'nuxt-movies',
    },
  })
  : undefined

export function logPosthogInfo(message: string, attributes: Record<string, string> = {}) {
  posthogLogClient?.logger.info(message, attributes)
}

export async function shutdownPosthogLogs() {
  if (posthogLogClient)
    await posthogLogClient.shutdown(3000).catch(() => {})
}
