import { logPostHogServerEvent } from '../../plugins/posthog-logs'

export default defineEventHandler(async (event) => {
  deleteCookie(event, 'auth-user')
  logPostHogServerEvent('authentication logout completed', {
    route: 'api_auth_logout',
  })
  return { success: true }
})
