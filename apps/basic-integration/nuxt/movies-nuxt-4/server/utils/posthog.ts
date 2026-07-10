import { PostHog } from 'posthog-node'

let client: PostHog | null = null

export function useServerPostHog(): PostHog | null {
  const config = useRuntimeConfig()
  const publicKey = config.public.posthog?.publicKey
  const host = config.public.posthog?.host

  if (!publicKey || !host)
    return null

  if (!client) {
    client = new PostHog(publicKey, {
      host,
      enableExceptionAutocapture: true,
    })
  }

  return client
}

export async function captureServerEvent(input: {
  distinctId?: string | null
  event: string
  properties?: Record<string, unknown>
}) {
  const posthog = useServerPostHog()
  if (!posthog || !input.distinctId)
    return

  await posthog.capture({
    distinctId: input.distinctId,
    event: input.event,
    properties: input.properties,
  })
}
