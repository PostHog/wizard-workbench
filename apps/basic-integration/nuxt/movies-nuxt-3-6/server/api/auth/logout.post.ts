import { logPosthogInfo } from '~/server/utils/posthog-logs'

export default defineEventHandler(async (event) => {
  deleteCookie(event, 'auth-user')
  logPosthogInfo('demo_session_logged_out')
  return { success: true }
})
