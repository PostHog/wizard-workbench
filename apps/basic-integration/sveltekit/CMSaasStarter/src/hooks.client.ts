import { dev } from "$app/environment"
import { env } from "$env/dynamic/public"
import {
  PUBLIC_SUPABASE_ANON_KEY,
  PUBLIC_SUPABASE_URL,
} from "$env/static/public"
import { createBrowserClient } from "@supabase/ssr"
import type { HandleClientError } from "@sveltejs/kit"
import posthog from "posthog-js"

let identifiedUserId: string | null = null

export function init() {
  if (!env.PUBLIC_POSTHOG_PROJECT_TOKEN || !env.PUBLIC_POSTHOG_HOST) {
    if (dev) {
      const missingVariable = !env.PUBLIC_POSTHOG_PROJECT_TOKEN
        ? "PUBLIC_POSTHOG_PROJECT_TOKEN"
        : "PUBLIC_POSTHOG_HOST"
      throw new Error(
        `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`,
      )
    }

    return
  }

  posthog.init(env.PUBLIC_POSTHOG_PROJECT_TOKEN, {
    api_host: env.PUBLIC_POSTHOG_HOST,
  })

  const supabase = createBrowserClient(
    PUBLIC_SUPABASE_URL,
    PUBLIC_SUPABASE_ANON_KEY,
  )

  supabase.auth.onAuthStateChange((event, session) => {
    if (event === "SIGNED_OUT") {
      identifiedUserId = null
      posthog.reset()
      return
    }

    if (
      (event === "INITIAL_SESSION" || event === "SIGNED_IN") &&
      session?.user.id
    ) {
      if (identifiedUserId && identifiedUserId !== session.user.id) {
        posthog.reset()
      }

      identifiedUserId = session.user.id

      const fullName = session.user.user_metadata.full_name
      posthog.identify(session.user.id, {
        ...(typeof session.user.email === "string"
          ? { email: session.user.email }
          : {}),
        ...(typeof fullName === "string" ? { name: fullName } : {}),
      })
    }
  })
}

export const handleError: HandleClientError = ({ error }) => {
  if (env.PUBLIC_POSTHOG_PROJECT_TOKEN && env.PUBLIC_POSTHOG_HOST) {
    posthog.captureException(error)
  }
}
