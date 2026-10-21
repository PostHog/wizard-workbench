import { emitPostHogLog } from '~/server/utils/posthog-logs'

export default defineEventHandler(async (event) => {
  deleteCookie(event, 'auth-user')
  await emitPostHogLog('authentication_logout_succeeded', 'logout')
  return { success: true }
})
