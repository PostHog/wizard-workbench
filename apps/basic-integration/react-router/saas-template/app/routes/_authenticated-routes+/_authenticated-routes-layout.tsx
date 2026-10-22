import { useEffect, useRef } from "react";
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
  const identifiedUserId = useRef<string>();

  useEffect(() => {
    const { email, id } = loaderData.posthogUser;
    const posthogProjectToken = window.ENV.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN;
    const posthogHost = window.ENV.VITE_PUBLIC_POSTHOG_HOST;

    if (!posthogProjectToken || !posthogHost || identifiedUserId.current === id) {
      return;
    }

    identifiedUserId.current = id;
    void import("posthog-js").then(({ default: posthog }) => {
      posthog.identify(id, email ? { email } : undefined);
    });
  }, [loaderData.posthogUser]);

  return <Outlet />;
}
