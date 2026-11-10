import { shutdownPostHogLogger } from '~/server/utils/posthog-logger'

export default defineNitroPlugin((nitroApp) => {
  nitroApp.hooks.hook('close', () => shutdownPostHogLogger())
})
