import { getPostHogLogger } from '~/server/utils/posthog-logs'

export default defineEventHandler(async (event) => {
  deleteCookie(event, 'auth-user')

  getPostHogLogger()?.emit({
    severityText: 'INFO',
    body: 'auth logout completed',
    attributes: { auth_operation: 'logout', outcome: 'success' },
  })

  return { success: true }
})
