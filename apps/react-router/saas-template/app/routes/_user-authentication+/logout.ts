import type { PostHog } from "posthog-node";
import { redirect } from "react-router";

import type { Route } from "./+types/logout";
import { retrieveUserAccountFromDatabaseBySupabaseUserId } from "~/features/user-accounts/user-accounts-model.server";
import { createSupabaseServerClient } from "~/features/user-authentication/supabase.server";
import { logout } from "~/features/user-authentication/user-authentication-helpers.server";

export function loader() {
  return redirect("/");
}

export async function action({ request, context }: Route.ActionArgs) {
  const posthog = (context as Record<string, unknown>).posthog as
    | PostHog
    | undefined;

  if (posthog) {
    try {
      const { supabase } = createSupabaseServerClient({ request });
      const {
        data: { user: supabaseUser },
      } = await supabase.auth.getUser();
      if (supabaseUser) {
        const dbUser = await retrieveUserAccountFromDatabaseBySupabaseUserId(
          supabaseUser.id,
        );
        if (dbUser) {
          posthog.capture({
            distinctId: dbUser.id,
            event: "user_logged_out",
          });
        }
      }
    } catch {
      // Non-critical: do not block logout if tracking fails
    }
  }

  return await logout(request);
}
