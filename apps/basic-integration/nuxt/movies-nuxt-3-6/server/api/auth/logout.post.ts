import { emitPostHogLog } from '~/server/utils/posthog-log-exporter'

export default defineEventHandler(async (event) => {
  deleteCookie(event, 'auth-user')
  await emitPostHogLog(useRuntimeConfig(), 'INFO', 'authentication completed', {
    outcome: 'signed_out',
  })
  return { success: true }
})
