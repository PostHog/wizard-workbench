let posthogClientPromise: ReturnType<typeof importPostHog> | undefined

function importPostHog() {
  return import('posthog-js').then(({ default: posthog }) => posthog)
}

export function getPostHog() {
  if (typeof window === 'undefined') {
    return Promise.resolve(undefined)
  }

  const projectToken = import.meta.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN
  const host = import.meta.env.VITE_PUBLIC_POSTHOG_HOST

  if (!projectToken || !host) {
    if (import.meta.env.DEV) {
      const missingVariable = projectToken ? 'VITE_PUBLIC_POSTHOG_HOST' : 'VITE_PUBLIC_POSTHOG_PROJECT_TOKEN'
      console.error(
        new Error(
          `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`
        )
      )
    }

    return Promise.resolve(undefined)
  }

  posthogClientPromise ??= importPostHog().then((posthog) => {
    posthog.init(projectToken, {
      api_host: host,
      defaults: '2026-01-30',
      capture_exceptions: {
        capture_unhandled_errors: true,
        capture_unhandled_rejections: true,
        capture_console_errors: false,
      },
    })

    return posthog
  })

  return posthogClientPromise
}
