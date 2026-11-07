import { shutdownPostHogLogCapture } from '~/server/utils/posthog-logs'

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hookOnce('close', shutdownPostHogLogCapture)
})
