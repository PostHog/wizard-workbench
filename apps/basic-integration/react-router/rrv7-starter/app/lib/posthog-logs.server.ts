import { PostHog } from 'posthog-node'

const posthogToken = process.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN
const posthogHost = process.env.VITE_PUBLIC_POSTHOG_HOST

const posthogLogClient =
  posthogToken && posthogHost
    ? new PostHog(posthogToken, {
        host: posthogHost,
        logs: { serviceName: 'clouthub-react-router' },
        enableExceptionAutocapture: true,
        flushAt: 1,
        flushInterval: 0,
        requestTimeout: 2000,
        fetchRetryCount: 0,
      })
    : undefined

if (!posthogLogClient && process.env.NODE_ENV !== 'production') {
  const missingVariable = posthogToken ? 'VITE_PUBLIC_POSTHOG_HOST' : 'VITE_PUBLIC_POSTHOG_PROJECT_TOKEN'
  console.warn(
    `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`
  )
}

posthogLogClient?.logger.info('server_log_capture_configured', {
  service: 'clouthub-react-router',
})

export async function logRootLoaderServed(method: string) {
  if (!posthogLogClient) return

  posthogLogClient.logger.info('root_loader_served', {
    route_id: 'root',
    request_method: method,
  })
  await posthogLogClient.flush().catch(() => {})
}
