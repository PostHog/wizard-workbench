import type { PostHog } from 'posthog-js'

declare module '#app' {
  interface NuxtApp {
    $posthog: PostHog | undefined
    $posthogLogger: PostHog['logger'] | undefined
  }
}

export {}
