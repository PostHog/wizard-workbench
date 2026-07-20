import { usePostHog } from "@posthog/react";
import { useEffect } from "react";
import { Outlet } from "react-router";

import type { Route } from "./+types/_authenticated-routes-layout";
import { requireAuthenticatedUserExists } from "~/features/user-accounts/user-accounts-helpers.server";
import { authMiddleware } from "~/features/user-authentication/user-authentication-middleware.server";

export const middleware = [authMiddleware];

export async function loader({ context, request }: Route.LoaderArgs) {
  const { user } = await requireAuthenticatedUserExists({ context, request });
  return { user };
}

export default function AuthenticatedRoutesLayout({
  loaderData,
}: Route.ComponentProps) {
  const posthog = usePostHog();

  useEffect(() => {
    posthog.identify(loaderData.user.id, {
      email: loaderData.user.email,
      name: loaderData.user.name,
    });
  }, [loaderData.user, posthog]);

  return <Outlet />;
}
