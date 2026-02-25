import { redirect } from "react-router";

import type { Route } from "./+types/logout";
import { logout } from "~/features/user-authentication/user-authentication-helpers.server";
import { posthogContext } from "~/lib/posthog-middleware";

export function loader() {
  return redirect("/");
}

export async function action({ request, context }: Route.ActionArgs) {
  try {
    const { posthog } = context.get(posthogContext);
    posthog.capture({ event: "user_logged_out" });
  } catch {
    // PostHog context unavailable — continue with logout
  }

  return await logout(request);
}
