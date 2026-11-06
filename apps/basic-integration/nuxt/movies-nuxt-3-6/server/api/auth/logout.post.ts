import { captureServerEvent } from '~/server/utils/posthog'
import { createPostHogLogger } from '~/server/utils/posthog-logs'

export default defineEventHandler(async (event) => {
  deleteCookie(event, 'auth-user')
  await captureServerEvent(event, 'user_logout_completed')

  const posthogLogger = createPostHogLogger()
  posthogLogger?.emit('Authentication logout completed', { operation: 'logout' })
  await posthogLogger?.shutdown()

  return { success: true }
})
