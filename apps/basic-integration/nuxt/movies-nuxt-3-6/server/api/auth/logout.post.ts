import { capturePostHogLog } from '~/server/utils/posthog-logs'

export default defineEventHandler(async (event) => {
  deleteCookie(event, 'auth-user')

  await capturePostHogLog(useRuntimeConfig().public.posthog, 'auth logout completed', {
    authentication_type: 'demo_credentials',
  })

  return { success: true }
})
