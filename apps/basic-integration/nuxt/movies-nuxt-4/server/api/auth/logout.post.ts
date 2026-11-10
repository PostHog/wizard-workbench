import { posthogLogger } from '~/server/utils/posthog-logger'

export default defineEventHandler(async (event) => {
  posthogLogger?.emit({
    severityText: 'info',
    body: 'user_logout_succeeded',
  })
  deleteCookie(event, 'auth-user')
  return { success: true }
})
