import { useEffect } from "react";
import posthog from "posthog-js";
import { Outlet } from "react-router";

import type { Route } from "./+types/_authenticated-routes-layout";
import {
  authContext,
  authMiddleware,
} from "~/features/user-authentication/user-authentication-middleware.server";

let identifiedUserId: string | undefined;

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
    const token = window.ENV?.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN;
    const host = window.ENV?.VITE_PUBLIC_POSTHOG_HOST;

    if (!token || !host || identifiedUserId === posthogUser.id) return;

    posthog.identify(
      posthogUser.id,
      posthogUser.email ? { email: posthogUser.email } : undefined,
    );
    identifiedUserId = posthogUser.id;
  }, [posthogUser.email, posthogUser.id]);

  return <Outlet />;
}
