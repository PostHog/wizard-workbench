import { usePostHog } from "@posthog/react";
import { useEffect } from "react";
import { Outlet } from "react-router";

import type { Route } from "./+types/_authenticated-routes-layout";
import {
  authContext,
  authMiddleware,
} from "~/features/user-authentication/user-authentication-middleware.server";

export const middleware = [authMiddleware];

export function loader({ context }: Route.LoaderArgs) {
  const { user } = context.get(authContext);

  return { email: user.email, userId: user.id };
}

export default function AuthenticatedRoutesLayout({
  loaderData,
}: Route.ComponentProps) {
  const posthog = usePostHog();

  useEffect(() => {
    posthog.identify(
      loaderData.userId,
      loaderData.email ? { email: loaderData.email } : undefined,
    );
  }, [loaderData.email, loaderData.userId, posthog]);

  return <Outlet />;
}
