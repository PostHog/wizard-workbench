import { logPostHogServerEvent } from '../../utils/posthog-logs'

export default defineEventHandler(async (event) => {
  deleteCookie(event, 'auth-user')
  await logPostHogServerEvent(useRuntimeConfig(), 'authentication logout completed', {
    outcome: 'success',
  })
  return { success: true }
})
