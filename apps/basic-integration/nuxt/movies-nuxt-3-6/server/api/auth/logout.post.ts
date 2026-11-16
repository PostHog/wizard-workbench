import { logLogoutCompleted } from '~/server/utils/posthog-logs'

export default defineEventHandler(async (event) => {
  deleteCookie(event, 'auth-user')
  await logLogoutCompleted()
  return { success: true }
})
