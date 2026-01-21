import { redirect } from "react-router";

import type { Route } from "./+types/logout";
import { logout } from "~/features/user-authentication/user-authentication-helpers.server";
import type { PostHogContext } from "~/lib/posthog-middleware";

export function loader() {
  return redirect("/");
}

export async function action({ request, context }: Route.ActionArgs) {
  // Track logout event on server side
  const posthog = (context as PostHogContext).posthog;
  posthog?.capture({ event: "user logged out" });

  return await logout(request);
}
