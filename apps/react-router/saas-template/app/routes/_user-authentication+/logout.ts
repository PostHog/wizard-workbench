import { redirect } from "react-router";

import type { Route } from "./+types/logout";
import type { PostHogContext } from "~/lib/posthog-middleware.server";
import { logout } from "~/features/user-authentication/user-authentication-helpers.server";

export function loader() {
  return redirect("/");
}

export async function action({ request, context }: Route.ActionArgs) {
  // Capture logout event on server side
  const posthog = (context as PostHogContext).posthog;
  posthog?.capture({ event: "user_logged_out" });

  return await logout(request);
}
