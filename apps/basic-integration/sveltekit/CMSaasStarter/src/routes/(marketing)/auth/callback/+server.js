// src/routes/auth/callback/+server.js
import { redirect } from "@sveltejs/kit"
import { isAuthApiError } from "@supabase/supabase-js"
import { getPostHogClient } from "$lib/server/posthog"

export const GET = async ({ url, locals: { supabase } }) => {
  const code = url.searchParams.get("code")
  if (code) {
    try {
      const { data } = await supabase.auth.exchangeCodeForSession(code)
      const user = data?.user
      if (user?.id) {
        const posthog = getPostHogClient()
        posthog.capture({
          distinctId: user.id,
          event: "user_signed_up",
          properties: {
            email: user.email,
            provider: user.app_metadata?.provider ?? "email",
          },
        })
        await posthog.flush()
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
