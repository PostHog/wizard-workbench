type EventProperties = Record<string, string | number | boolean | null | undefined>

function isPostHogConfigured() {
  return Boolean(
    import.meta.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN && import.meta.env.VITE_PUBLIC_POSTHOG_HOST,
  )
}

export async function capturePostHog(event: string, properties?: EventProperties) {
  if (typeof window === 'undefined' || !isPostHogConfigured()) return

  const { default: posthog } = await import('posthog-js')
  posthog.capture(event, properties)
}
