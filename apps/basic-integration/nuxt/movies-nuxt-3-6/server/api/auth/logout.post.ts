import { getPostHogLogger } from '~/server/utils/posthog-logs'

export default defineEventHandler(async (event) => {
  deleteCookie(event, 'auth-user')
  getPostHogLogger()?.emit({
    severityText: 'INFO',
    body: 'Demo authentication session ended',
    attributes: {
      event_name: 'demo_authentication_session_ended',
      outcome: 'success',
    },
  })
  return { success: true }
})
