import { posthogLogs } from '~/server/utils/posthog-logs'

export default defineEventHandler(async (event) => {
  deleteCookie(event, 'auth-user')
  posthogLogs.info('demo logout completed')
  return { success: true }
})
