import { logPosthogServer } from '~/server/utils/posthog-logs'

export default defineEventHandler(async (event) => {
  deleteCookie(event, 'auth-user')
  await logPosthogServer('INFO', 'logout completed', {
    operation: 'logout',
    outcome: 'success',
  })
  return { success: true }
})
