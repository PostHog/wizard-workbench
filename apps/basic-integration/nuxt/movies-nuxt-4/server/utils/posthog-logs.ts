import { PostHog } from 'posthog-node'

let posthogLogs: PostHog | undefined

export function configurePostHogLogs(publicKey: string, host: string) {
  if (posthogLogs)
    return

  posthogLogs = new PostHog(publicKey, {
    host,
    logs: {
      serviceName: 'movies-nuxt-server',
    },
    enableExceptionAutocapture: true,
  })
}

export function logPostHogInfo(message: string, attributes: Record<string, string>) {
  posthogLogs?.logger.info(message, attributes)
}

export function logPostHogWarn(message: string, attributes: Record<string, string>) {
  posthogLogs?.logger.warn(message, attributes)
}

export function logPostHogError(message: string, attributes: Record<string, string>) {
  posthogLogs?.logger.error(message, attributes)
}

export async function shutdownPostHogLogs() {
  await posthogLogs?.shutdown(3000).catch(() => {})
}
