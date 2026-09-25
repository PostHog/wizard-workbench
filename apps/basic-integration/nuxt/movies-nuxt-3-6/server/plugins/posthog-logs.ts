import { configurePostHogLogs } from '~/server/utils/posthog-logs'

export default defineNitroPlugin(() => {
  configurePostHogLogs()
})
