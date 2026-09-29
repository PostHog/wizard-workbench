import { emitPostHogLog } from '~/server/utils/posthog-logs'

export default defineEventHandler(async (event) => {
  deleteCookie(event, 'auth-user')

  await emitPostHogLog('auth_logout_completed')

  return { success: true }
})
