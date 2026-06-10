import type { HandleClientError } from "@sveltejs/kit"
import posthog from "posthog-js"

export const handleError: HandleClientError = ({ error }) => {
  posthog.captureException(error)
}
