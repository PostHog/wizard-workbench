type LogAttributes = Record<string, number>

type PostHogLogClient = {
  logger?: {
    info: (message: string, attributes: LogAttributes) => void
  }
}

export const posthogLogger = {
  info: (posthog: PostHogLogClient | undefined, message: string, attributes: LogAttributes) => {
    posthog?.logger?.info(message, attributes)
  },
}
