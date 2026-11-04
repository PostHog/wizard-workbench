import { usePostHog } from '@posthog/react'

type PostHogLogAttributes = Record<string, boolean | number | string>

export const usePostHogLogger = () => {
  const posthog = usePostHog()

  return {
    info: (message: string, attributes: PostHogLogAttributes) => {
      posthog.logger.info(message, attributes)
    },
  }
}
