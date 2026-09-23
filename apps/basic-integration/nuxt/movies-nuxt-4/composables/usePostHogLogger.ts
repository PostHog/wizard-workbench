type PostHogLogAttributes = Record<string, boolean | number | string>

export function usePostHogLogger() {
  const { $posthog: posthog } = useNuxtApp()

  return {
    info: (message: string, attributes: PostHogLogAttributes) => {
      posthog?.logger.info(message, attributes)
    },
    warn: (message: string, attributes: PostHogLogAttributes) => {
      posthog?.logger.warn(message, attributes)
    },
  }
}
