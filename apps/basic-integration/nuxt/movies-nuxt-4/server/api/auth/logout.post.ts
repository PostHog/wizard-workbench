import { getPostHogLogger } from '~/server/utils/posthog-logger'

export default defineEventHandler(async (event) => {
  deleteCookie(event, 'auth-user')

  getPostHogLogger()?.emit({
    severityText: 'info',
    body: 'Demo logout completed',
    attributes: { 'auth.action': 'logout' },
  })

  return { success: true }
})
