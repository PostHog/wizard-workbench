import { getPostHog } from '@/lib/posthog'

type PostHogLogAttributes = Record<string, string | number | boolean>

export const posthogLogger = {
  info: (message: string, attributes: PostHogLogAttributes) => {
    void getPostHog().then((posthog) => posthog?.logger.info(message, attributes))
  },
}
