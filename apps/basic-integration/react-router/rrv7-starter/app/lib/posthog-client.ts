let posthogPromise: Promise<(typeof import('posthog-js'))['default']> | undefined

export function getPostHog() {
  posthogPromise ??= import('posthog-js').then(({ default: posthog }) => posthog)

  return posthogPromise
}
