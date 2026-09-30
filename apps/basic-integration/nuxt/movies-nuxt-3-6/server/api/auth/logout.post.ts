import { emitPostHogLog } from '~/server/utils/posthog-logger'

export default defineEventHandler(async (event) => {
  deleteCookie(event, 'auth-user')
  await emitPostHogLog('Authentication logout completed', 'auth_logout')
  return { success: true }
})
