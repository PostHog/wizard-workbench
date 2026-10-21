import { logPostHogAuthOutcome } from '~/server/utils/posthog-logs'

export default defineEventHandler(async (event) => {
  deleteCookie(event, 'auth-user')
  logPostHogAuthOutcome('auth.logout.completed')
  return { success: true }
})
