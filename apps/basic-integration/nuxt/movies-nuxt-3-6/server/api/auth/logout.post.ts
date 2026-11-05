import { emitPostHogIntegrationLog, flushPostHogIntegrationLogs } from '~/server/utils/posthog-logs'

export default defineEventHandler(async (event) => {
  deleteCookie(event, 'auth-user')
  emitPostHogIntegrationLog('info', 'Demo user logout succeeded', {
    route: '/api/auth/logout',
  })
  await flushPostHogIntegrationLogs()
  return { success: true }
})
