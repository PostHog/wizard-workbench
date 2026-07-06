import { PUBLIC_POSTHOG_HOST, PUBLIC_POSTHOG_PROJECT_TOKEN } from "$env/static/public"
import { PostHog } from "posthog-node"

let posthogClient: PostHog | null = null

export const getPostHogClient = () => {
  if (!posthogClient) {
    posthogClient = new PostHog(PUBLIC_POSTHOG_PROJECT_TOKEN, {
      host: PUBLIC_POSTHOG_HOST,
      enableExceptionAutocapture: true,
    })
  }

  return posthogClient
}
