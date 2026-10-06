import { logs } from '@opentelemetry/api-logs'

export const posthogLog = logs.getLogger('posthog-nuxt-server')
