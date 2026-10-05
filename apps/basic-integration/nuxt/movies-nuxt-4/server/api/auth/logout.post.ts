import { getPostHogLogger } from '~/server/utils/posthog-logs'

export default defineEventHandler(async (event) => {
  deleteCookie(event, 'auth-user')
  getPostHogLogger(useRuntimeConfig().public.posthog)?.emit({
    severityText: 'INFO',
    body: 'demo logout completed',
    attributes: { route: 'auth_logout', outcome: 'success' },
  })
  return { success: true }
})
