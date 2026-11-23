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
      email: user.email,
      id: user.id,
    },
  };
}

export default function AuthenticatedRoutesLayout({
  loaderData,
}: Route.ComponentProps) {
  const { posthogUser } = loaderData;

  useEffect(() => {
    if (!import.meta.env.VITE_POSTHOG_KEY) return;

    let cancelled = false;

    void import("posthog-js")
      .then(({ default: posthog }) => {
        if (!cancelled) {
          posthog.identify(
            posthogUser.id,
            posthogUser.email ? { email: posthogUser.email } : undefined,
          );
        }
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [posthogUser.email, posthogUser.id]);

  return <Outlet />;
}
