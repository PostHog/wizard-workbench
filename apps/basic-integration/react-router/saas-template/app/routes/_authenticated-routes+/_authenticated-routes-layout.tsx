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
  return { userEmail: user.email ?? null };
}

export default function AuthenticatedRoutesLayout({
  loaderData,
}: Route.ComponentProps) {
  const posthog = usePostHog();

  useEffect(() => {
    if (loaderData.userEmail) {
      posthog?.identify(loaderData.userEmail, { email: loaderData.userEmail });
    }
  }, [posthog, loaderData.userEmail]);

  return <Outlet />;
}
