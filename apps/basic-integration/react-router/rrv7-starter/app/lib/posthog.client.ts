type EventProperties = Record<string, boolean | number | string>

const isPostHogConfigured = Boolean(
  import.meta.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN && import.meta.env.VITE_PUBLIC_POSTHOG_HOST
)

export function captureEvent(event: string, properties: EventProperties) {
  if (!isPostHogConfigured || typeof window === 'undefined') return

  void import('posthog-js').then(({ default: posthog }) => {
    posthog.capture(event, properties)
  })
}
