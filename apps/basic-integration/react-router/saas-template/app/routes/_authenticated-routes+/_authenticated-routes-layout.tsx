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

  return { user: { email: user.email, id: user.id } };
}

export default function AuthenticatedRoutesLayout({
  loaderData,
}: Route.ComponentProps) {
  const identifiedUserId = useRef<string | null>(null);
  const { user } = loaderData;

  useEffect(() => {
    if (identifiedUserId.current === user.id) return;

    let cancelled = false;

    void import("~/lib/posthog.client").then(({ default: posthog }) => {
      if (cancelled) return;

      const previousUserId = identifiedUserId.current;

      if (previousUserId && previousUserId !== user.id) {
        posthog?.reset();
      }

      posthog?.identify(user.id, user.email ? { email: user.email } : undefined);
      identifiedUserId.current = user.id;
    });

    return () => {
      cancelled = true;
    };
  }, [user.email, user.id]);

  return <Outlet />;
}
