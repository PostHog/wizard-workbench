// src/routes/auth/callback/+server.js
import { redirect } from "@sveltejs/kit"
import { isAuthApiError } from "@supabase/supabase-js"
import { getPostHogClient } from "$lib/server/posthog"

export const GET = async ({ url, locals: { supabase } }) => {
  const code = url.searchParams.get("code")
  if (code) {
    try {
      const { data } = await supabase.auth.exchangeCodeForSession(code)

      if (data?.user) {
        const posthog = getPostHogClient()
        posthog.capture({
          distinctId: data.user.id,
          event: "auth_callback_completed",
          properties: {
            has_next: !!url.searchParams.get("next"),
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
