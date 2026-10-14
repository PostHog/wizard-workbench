import { emitPostHogLog } from '~/server/utils/posthog-logs'

export default defineEventHandler(async (event) => {
  deleteCookie(event, 'auth-user')

  const runtimeConfig = useRuntimeConfig()
  await emitPostHogLog(runtimeConfig.public.posthog, 'Authentication logout completed', {
    route: 'auth_logout',
  })

  return { success: true }
})
