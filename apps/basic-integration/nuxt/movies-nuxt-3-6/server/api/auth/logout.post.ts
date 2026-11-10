import { logAuthenticationCompleted } from '~/server/utils/posthog-logs'

export default defineEventHandler(async (event) => {
  deleteCookie(event, 'auth-user')
  logAuthenticationCompleted('logout')
  return { success: true }
})
