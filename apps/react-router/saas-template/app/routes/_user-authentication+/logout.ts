import { redirect } from "react-router";

import type { Route } from "./+types/logout";
import { requireAuthenticatedUserExists } from "~/features/user-accounts/user-accounts-helpers.server";
import { logout } from "~/features/user-authentication/user-authentication-helpers.server";
import type { PostHogContext } from "~/lib/posthog-middleware.server";

export function loader() {
  return redirect("/");
}

export async function action({ request, context }: Route.ActionArgs) {
  const posthog = (context as PostHogContext).posthog;
  try {
    const { user } = await requireAuthenticatedUserExists({ context, request });
    posthog?.capture({
      event: "user_logged_out",
      properties: { user_id: user.id },
    });
  } catch {
    // Not authenticated - proceed with logout anyway
  }
  return await logout(request);
}
