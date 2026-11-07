import { posthogLogs } from '~/server/utils/posthog-logs'

export default defineEventHandler(() => {
  posthogLogs.info('api status requested', { route: 'api_status' })
  return 'Nuxt Movies API'
})
