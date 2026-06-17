import { usePostHog } from "@posthog/react";
import { useEffect } from "react";
import { Outlet } from "react-router";

import type { Route } from "./+types/_authenticated-routes-layout";
import {
  authContext,
  authMiddleware,
} from "~/features/user-authentication/user-authentication-middleware.server";

export const middleware = [authMiddleware];

export async function loader({ context }: Route.LoaderArgs) {
  const { user } = context.get(authContext);
  return { userEmail: user.email ?? undefined, userId: user.id };
}

export default function AuthenticatedRoutesLayout({
  loaderData,
}: Route.ComponentProps) {
  const posthog = usePostHog();
  const { userId, userEmail } = loaderData;

  useEffect(() => {
    posthog?.identify(userId, { email: userEmail });
  }, [posthog, userId, userEmail]);

  return <Outlet />;
}
