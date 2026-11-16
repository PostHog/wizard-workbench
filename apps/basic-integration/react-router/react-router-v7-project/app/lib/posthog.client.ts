type EventProperties = Record<string, boolean | number | string>
type LogAttributes = Record<string, boolean | number | string>

export function capturePostHogEvent(event: string, properties?: EventProperties) {
  if (
    typeof window === "undefined" ||
    !import.meta.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN ||
    !import.meta.env.VITE_PUBLIC_POSTHOG_HOST
  ) {
    return
  }

  void import("posthog-js")
    .then(({ default: posthog }) => {
      posthog.capture(event, properties)
    })
    .catch(() => undefined)
}

export function logPostHogInfo(message: string, attributes?: LogAttributes) {
  if (
    typeof window === "undefined" ||
    !import.meta.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN ||
    !import.meta.env.VITE_PUBLIC_POSTHOG_HOST
  ) {
    return
  }

  void import("posthog-js")
    .then(({ default: posthog }) => {
      posthog.logger.info(message, attributes)
    })
    .catch(() => undefined)
}
