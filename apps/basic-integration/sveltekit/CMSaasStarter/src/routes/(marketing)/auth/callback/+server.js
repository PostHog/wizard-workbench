// src/routes/auth/callback/+server.js
import { redirect } from "@sveltejs/kit"
import { isAuthApiError } from "@supabase/supabase-js"
import { getPostHogServer } from "$lib/server/posthog"

export const GET = async ({ url, locals: { supabase } }) => {
  const code = url.searchParams.get("code")
  if (code) {
    try {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code)

      if (error) {
        throw error
      }

      const user = data.session?.user
      if (user?.id) {
        const posthog = getPostHogServer()

        posthog.capture({
          distinctId: user.id,
          event: "user_signed_in",
          properties: {
            auth_provider: user.app_metadata?.provider || "email",
            destination: url.searchParams.get("next") || "/account",
          },
        })
      }
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

  const next = url.searchParams.get("next")
  if (next) {
    redirect(303, next)
  }

  redirect(303, "/account")
}
