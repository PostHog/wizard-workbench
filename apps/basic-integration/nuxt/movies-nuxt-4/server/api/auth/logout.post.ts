import { flushPostHogLogs, getPostHogLogger } from '~/server/utils/posthog-logs'

export default defineEventHandler(async (event) => {
  const logger = getPostHogLogger()

  deleteCookie(event, 'auth-user')
  logger?.info('Logout completed', { route: '/api/auth/logout' })
  await flushPostHogLogs()
  return { success: true }
})
