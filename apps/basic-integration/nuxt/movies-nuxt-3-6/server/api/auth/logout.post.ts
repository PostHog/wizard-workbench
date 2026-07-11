import { createServerPostHog, getPostHogContext } from '~/server/utils/posthog'

export default defineEventHandler(async (event) => {
  const posthog = createServerPostHog()
  const { distinctId, sessionId } = getPostHogContext(event)

  await posthog.withContext({ distinctId, sessionId }, async () => {
    posthog.capture({
      event: 'server_logout_succeeded',
      distinctId: distinctId ?? 'anonymous',
      properties: {
        logout_source: 'navigation',
      },
    })
  })

  await posthog.shutdown()
  deleteCookie(event, 'auth-user')
  return { success: true }
})
