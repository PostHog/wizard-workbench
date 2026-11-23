import { logPostHogInfo } from '~/server/utils/posthog-logs'

export default defineEventHandler(async (event) => {
  deleteCookie(event, 'auth-user')
  logPostHogInfo('Authentication logout completed', {
    outcome: 'success',
    route: 'api_auth_logout',
  })
  return { success: true }
})
