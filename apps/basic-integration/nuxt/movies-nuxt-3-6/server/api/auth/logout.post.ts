import { logPostHogServerEvent } from '~/server/utils/posthog-logs'

export default defineEventHandler(async (event) => {
  deleteCookie(event, 'auth-user')
  await logPostHogServerEvent('logout_completed')
  return { success: true }
})
