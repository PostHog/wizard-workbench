// src/routes/auth/callback/+server.js
import { redirect } from "@sveltejs/kit"
import { isAuthApiError } from "@supabase/supabase-js"
import { getPostHogClient } from "$lib/server/posthog"

export const GET = async ({ url, locals: { supabase } }) => {
  const code = url.searchParams.get("code")
  if (code) {
    try {
      await supabase.auth.exchangeCodeForSession(code)
    } catch (error) {
      // If you open in another browser, need to redirect to login.
      // Should not display error
      if (isAuthApiError(error)) {
        redirect(303, "/login/sign_in?verified=true")
      } else {
        throw error
      }
    }
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user?.id) {
    const posthog = getPostHogClient()
    posthog.capture({
      distinctId: user.id,
      event: "auth_callback_completed",
      properties: {
        next_present: Boolean(url.searchParams.get("next")),
        provider: user.app_metadata?.provider ?? "email",
      },
    })
    await posthog.flush()
  }

  const next = url.searchParams.get("next")
  if (next) {
    redirect(303, next)
  }

  redirect(303, "/account")
}
