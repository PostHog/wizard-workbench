import { logPostHogAuthEvent } from '~/server/utils/posthog-logs'

export default defineEventHandler(async (event) => {
  deleteCookie(event, 'auth-user')
  await logPostHogAuthEvent('logout_succeeded')
  return { success: true }
})
