import { redirect } from "react-router";

import type { Route } from "./+types/logout";
import { logout } from "~/features/user-authentication/user-authentication-helpers.server";
import { posthogContext } from "~/utils/posthog-middleware.server";

export function loader() {
  return redirect("/");
}

export async function action({ request, context }: Route.ActionArgs) {
  const posthog = context.get(posthogContext);
  const distinctId = posthog?.distinctId;

  if (posthog && distinctId) {
    posthog.posthog.capture({
      distinctId,
      event: "user_logged_out",
    });
  }

  return await logout(request);
}
