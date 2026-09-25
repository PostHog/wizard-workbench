import { emitPostHogLog } from '~/server/utils/posthog-logs'

export default defineEventHandler(async (event) => {
  const startedAt = Date.now()
  deleteCookie(event, 'auth-user')
  await emitPostHogLog('authentication request completed', {
    route: 'auth_logout',
    outcome: 'success',
    duration_ms: Date.now() - startedAt,
  })
  return { success: true }
})
