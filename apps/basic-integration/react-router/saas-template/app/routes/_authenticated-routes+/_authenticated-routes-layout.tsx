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

  return {
    posthogUser: {
      distinctId: user.id,
      email: user.email,
    },
  };
}

export default function AuthenticatedRoutesLayout({
  loaderData,
}: Route.ComponentProps) {
  const { distinctId, email } = loaderData.posthogUser;

  useEffect(() => {
    void import("posthog-js").then(({ default: posthog }) => {
      posthog.identify(distinctId, email ? { email } : undefined);
    });
  }, [distinctId, email]);

  return <Outlet />;
}
