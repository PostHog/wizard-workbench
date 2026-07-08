import { usePostHog } from "@posthog/react";
import { useEffect } from "react";
import { data, Outlet } from "react-router";

import type { Route } from "./+types/_authenticated-routes-layout";
import { requireAuthenticatedUserExists } from "~/features/user-accounts/user-accounts-helpers.server";
import { authMiddleware } from "~/features/user-authentication/user-authentication-middleware.server";

export const middleware = [authMiddleware];

export async function loader({ request, context }: Route.LoaderArgs) {
  const { user, headers } = await requireAuthenticatedUserExists({
    context,
    request,
  });
  return data({ userId: user.id, userName: user.name }, { headers });
}

export default function AuthenticatedRoutesLayout({
  loaderData,
}: Route.ComponentProps) {
  const posthog = usePostHog();

  useEffect(() => {
    posthog?.identify(loaderData.userId, {
      name: loaderData.userName,
    });
  }, [posthog, loaderData.userId, loaderData.userName]);

  return <Outlet />;
}
