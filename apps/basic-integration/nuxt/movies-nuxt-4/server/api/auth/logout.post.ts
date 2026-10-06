import { getHeader } from 'h3'
import { PostHog } from 'posthog-node'
import { emitPostHogLog } from '~/server/utils/posthog-log'

async function captureAuthEvent(event: Parameters<typeof getHeader>[0]) {
  const runtimeConfig = useRuntimeConfig()
  const token = runtimeConfig.public.posthogToken
  const host = runtimeConfig.public.posthogHost
  const distinctId = getHeader(event, 'x-posthog-distinct-id')

  if (!token || !host || !distinctId)
    return

  const posthog = new PostHog(token, {
    host,
    enableExceptionAutocapture: true,
    flushAt: 1,
    flushInterval: 0,
  })

  try {
    await posthog.withContext({
      distinctId,
      sessionId: getHeader(event, 'x-posthog-session-id') ?? undefined,
    }, async () => {
      posthog.capture({ event: 'logout_completed' })
    })
  }
  finally {
    await posthog.shutdown()
  }
}

export default defineEventHandler(async (event) => {
  deleteCookie(event, 'auth-user')
  await captureAuthEvent(event)
  await emitPostHogLog('authentication logout completed', {
    route: '/api/auth/logout',
    outcome: 'success',
  })
  return { success: true }
})
