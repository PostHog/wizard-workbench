import { getPostHog } from '@/lib/posthog-client'

type LogAttributes = Record<string, boolean | number | string>

export const posthogLog = {
  info: (message: string, attributes: LogAttributes) => {
    if (!import.meta.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN || !import.meta.env.VITE_PUBLIC_POSTHOG_HOST) {
      return
    }

    void getPostHog().then((posthog) => {
      posthog.logger.info(message, attributes)
    })
  },
}
