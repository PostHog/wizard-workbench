import { usePostHog } from "@posthog/react";
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
    user: {
      email: user.email,
      id: user.id,
    },
  };
}

export default function AuthenticatedRoutesLayout({
  loaderData,
}: Route.ComponentProps) {
  const posthog = usePostHog();
  const identifiedUserId = useRef<string | null>(null);

  useEffect(() => {
    if (!posthog || identifiedUserId.current === loaderData.user.id) return;

    posthog.identify(
      loaderData.user.id,
      loaderData.user.email ? { email: loaderData.user.email } : {},
    );
    identifiedUserId.current = loaderData.user.id;
  }, [loaderData.user, posthog]);

  return <Outlet />;
}
