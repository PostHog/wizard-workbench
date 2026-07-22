import { getHeader } from 'h3'
import { PostHog } from 'posthog-node'

export default defineEventHandler(async (event) => {
  deleteCookie(event, 'auth-user')

  const runtimeConfig = useRuntimeConfig()
  const { publicKey, host } = runtimeConfig.public.posthog
  const distinctId = getHeader(event, 'x-posthog-distinct-id')
  if (publicKey && host && distinctId) {
    const posthog = new PostHog(publicKey, {
      host,
      enableExceptionAutocapture: true,
      flushAt: 1,
      flushInterval: 0,
    })

    posthog.capture({
      event: 'auth_logout_succeeded',
      distinctId,
    })
    await posthog.shutdown()
  }

  return { success: true }
})
