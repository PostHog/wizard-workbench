import { emitPostHogServerLog } from '../../utils/posthog-logs'

export default defineEventHandler(async (event) => {
  deleteCookie(event, 'auth-user')
  await emitPostHogServerLog('info', 'Demo logout completed', {
    route: '/api/auth/logout',
  })
  return { success: true }
})
