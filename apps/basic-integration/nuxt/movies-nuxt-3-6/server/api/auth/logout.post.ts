import { getPostHogLogLogger } from '~/server/utils/posthog-logs'

export default defineEventHandler(async (event) => {
  deleteCookie(event, 'auth-user')
  getPostHogLogLogger()?.emit({
    severityText: 'INFO',
    body: 'auth_logout_completed',
  })
  return { success: true }
})
