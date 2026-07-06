// src/hooks.server.ts
import { PRIVATE_SUPABASE_SERVICE_ROLE } from "$env/static/private"
import {
  PUBLIC_POSTHOG_HOST,
  PUBLIC_SUPABASE_ANON_KEY,
  PUBLIC_SUPABASE_URL,
} from "$env/static/public"
import { createServerClient } from "@supabase/ssr"
import { createClient, type AMREntry } from "@supabase/supabase-js"
import type { Handle } from "@sveltejs/kit"
import { sequence } from "@sveltejs/kit/hooks"
import { getPostHogClient } from "$lib/server/posthog"

const posthog = getPostHogClient()

export const supabase: Handle = async ({ event, resolve }) => {
  const distinctId = event.cookies.get("posthog_distinct_id") ?? crypto.randomUUID()
  event.locals.posthogDistinctId = distinctId
  event.cookies.set("posthog_distinct_id", distinctId, {
    path: "/",
    httpOnly: false,
    sameSite: "lax",
    secure: event.url.protocol === "https:",
    maxAge: 60 * 60 * 24 * 365,
  })

  event.locals.supabase = createServerClient(
    PUBLIC_SUPABASE_URL,
    PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll: () => event.cookies.getAll(),
        /**
         * SvelteKit's cookies API requires `path` to be explicitly set in
         * the cookie options. Setting `path` to `/` replicates previous/
         * standard behavior.
         */
        setAll: (
          cookiesToSet: {
            name: string
            value: string
            options: Record<string, unknown>
          }[],
        ) => {
          cookiesToSet.forEach(({ name, value, options }) => {
            event.cookies.set(name, value, { ...options, path: "/" })
          })
        },
      },
    },
  )

  event.locals.supabaseServiceRole = createClient(
    PUBLIC_SUPABASE_URL,
    PRIVATE_SUPABASE_SERVICE_ROLE,
    { auth: { persistSession: false } },
  )

  // https://github.com/supabase/auth-js/issues/888#issuecomment-2189298518
  if ("suppressGetSessionWarning" in event.locals.supabase.auth) {
    // @ts-expect-error - suppressGetSessionWarning is not part of the official API
    event.locals.supabase.auth.suppressGetSessionWarning = true
  } else {
    console.warn(
      "SupabaseAuthClient#suppressGetSessionWarning was removed. See https://github.com/supabase/auth-js/issues/888.",
    )
  }

  /**
   * Unlike `supabase.auth.getSession()`, which returns the session _without_
   * validating the JWT, this function also calls `getUser()` to validate the
   * JWT before returning the session.
   */
  event.locals.safeGetSession = async () => {
    const {
      data: { session },
    } = await event.locals.supabase.auth.getSession()
    if (!session) {
      return { session: null, user: null, amr: null }
    }

    const {
      data: { user },
      error: userError,
    } = await event.locals.supabase.auth.getUser()
    if (userError) {
      // JWT validation has failed
      return { session: null, user: null, amr: null }
    }

    const { data: aal, error: amrError } =
      await event.locals.supabase.auth.mfa.getAuthenticatorAssuranceLevel()
    if (amrError) {
      return { session, user, amr: null }
    }

    return {
      session,
      user,
      amr: aal.currentAuthenticationMethods as AMREntry[],
    }
  }

  if (event.url.pathname.startsWith("/ingest")) {
    const useAssetHost =
      event.url.pathname.startsWith("/ingest/static/") ||
      event.url.pathname.startsWith("/ingest/array/")
    const hostname = useAssetHost
      ? "us-assets.i.posthog.com"
      : new URL(PUBLIC_POSTHOG_HOST).hostname

    const url = new URL(event.request.url)
    url.protocol = "https:"
    url.hostname = hostname
    url.port = "443"
    url.pathname = event.url.pathname.replace(/^\/ingest/, "")

    const headers = new Headers(event.request.headers)
    headers.set("host", hostname)
    headers.set("accept-encoding", "")

    const clientIp =
      event.request.headers.get("x-forwarded-for") || event.getClientAddress()
    if (clientIp) {
      headers.set("x-forwarded-for", clientIp)
    }

    return fetch(url.toString(), {
      method: event.request.method,
      headers,
      body: event.request.body,
      // @ts-expect-error - duplex is required for streaming request bodies
      duplex: "half",
    })
  }

  return resolve(event, {
    filterSerializedResponseHeaders(name) {
      return name === "content-range" || name === "x-supabase-api-version"
    },
  })
}

// Not called for prerendered marketing pages so generally okay to call on ever server request
// Next-page CSR will mean relatively minimal calls to this hook
const authGuard: Handle = async ({ event, resolve }) => {
  const { session, user } = await event.locals.safeGetSession()
  event.locals.session = session
  event.locals.user = user

  if (user?.id) {
    posthog.identify({
      distinctId: user.id,
      properties: {
        email: user.email,
      },
    })
    event.locals.posthogDistinctId = user.id
  }

  return resolve(event)
}

export const handleError = async ({ error, event }) => {
  posthog.captureException(error, event.locals.posthogDistinctId ?? "anonymous")

  return {
    message: error instanceof Error ? error.message : "Unknown error",
  }
}

export const handle: Handle = sequence(supabase, authGuard)
