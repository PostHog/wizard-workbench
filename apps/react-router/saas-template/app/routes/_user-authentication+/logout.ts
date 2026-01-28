import { redirect } from "react-router";

import type { Route } from "./+types/logout";
import type { PostHogContext } from "~/lib/posthog-middleware";
import { logout } from "~/features/user-authentication/user-authentication-helpers.server";

export function loader() {
  return redirect("/");
}

export async function action({ request, context }: Route.ActionArgs) {
  const posthog = (context as PostHogContext).posthog;
  posthog?.capture({ event: "logout_clicked" });

  return await logout(request);
}
