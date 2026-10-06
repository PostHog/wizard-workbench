import { posthogLog } from '~/server/utils/posthog-logs'

export default defineEventHandler(async (event) => {
  deleteCookie(event, 'auth-user')
  posthogLog.emit({
    severityText: 'INFO',
    body: 'auth_logout_completed',
    attributes: {
      auth_action: 'logout',
    },
  })
  return { success: true }
})
