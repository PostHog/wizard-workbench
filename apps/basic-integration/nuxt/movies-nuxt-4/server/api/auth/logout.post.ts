import { emitPostHogLog } from '~/server/utils/posthog-logs'

export default defineEventHandler(async (event) => {
  deleteCookie(event, 'auth-user')
  emitPostHogLog('Demo authentication logout succeeded', {
    auth_action: 'logout',
    outcome: 'succeeded',
  })
  return { success: true }
})
