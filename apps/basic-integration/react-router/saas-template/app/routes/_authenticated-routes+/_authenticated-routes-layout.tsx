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

  return { user: { email: user.email, id: user.id } };
}

export default function AuthenticatedRoutesLayout({
  loaderData,
}: Route.ComponentProps) {
  const { user } = loaderData;

  useEffect(() => {
    void import("~/lib/posthog.client").then(({ isPostHogEnabled, posthog }) => {
      if (isPostHogEnabled) {
        posthog.identify(
          user.id,
          user.email ? { email: user.email } : undefined,
        );
      }
    });
  }, [user.email, user.id]);

  return <Outlet />;
}
