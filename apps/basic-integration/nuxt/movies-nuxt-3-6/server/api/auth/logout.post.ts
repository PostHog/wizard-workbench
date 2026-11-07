import { emitPostHogLog } from '../../utils/posthog-logs'

export default defineEventHandler(async (event) => {
  deleteCookie(event, 'auth-user')
  await emitPostHogLog('INFO', 'Authentication logout completed', {
    event: 'authentication_logout',
    outcome: 'success',
  })
  return { success: true }
})
