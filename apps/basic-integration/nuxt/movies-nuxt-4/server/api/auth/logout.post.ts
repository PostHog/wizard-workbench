import { flushPostHogServerLogs, logPostHogServerInfo } from '~/server/utils/posthog-logs'

export default defineEventHandler(async (event) => {
  deleteCookie(event, 'auth-user')
  logPostHogServerInfo('server_logout_completed', {
    route: 'auth_logout',
  })
  await flushPostHogServerLogs()
  return { success: true }
})
