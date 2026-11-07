import { emitPostHogLog } from '~/server/utils/posthog-logs'

export default defineEventHandler(async (event) => {
  deleteCookie(event, 'auth-user')

  emitPostHogLog('INFO', 'Authentication logout completed', {
    event: 'auth_logout_completed',
    outcome: 'success',
  })

  return { success: true }
})
