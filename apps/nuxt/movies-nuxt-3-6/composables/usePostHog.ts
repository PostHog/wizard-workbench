import type { PostHog } from 'posthog-js'

export function usePostHog(): PostHog | undefined {
  const nuxtApp = useNuxtApp()
  return nuxtApp.$posthog?.() as PostHog | undefined
}
