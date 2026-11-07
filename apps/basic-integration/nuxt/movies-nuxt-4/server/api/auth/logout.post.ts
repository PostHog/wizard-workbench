import { posthogServerLogger } from '~/server/utils/posthog-logs'

export default defineEventHandler(async (event) => {
  deleteCookie(event, 'auth-user')
  posthogServerLogger?.emit({
    severityText: 'INFO',
    body: 'Demo authentication session cleared',
    attributes: { outcome: 'success' },
  })
  return { success: true }
})
