import { useEffect, useRef } from "react";
import { Outlet } from "react-router";

import type { Route } from "./+types/_authenticated-routes-layout";
import {
  authContext,
  authMiddleware,
} from "~/features/user-authentication/user-authentication-middleware.server";
import { posthog } from "~/lib/posthog.client";

export const middleware = [authMiddleware];

export async function loader({ context }: Route.LoaderArgs) {
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
  const identifiedUserId = useRef<string | null>(null);

  useEffect(() => {
    if (identifiedUserId.current === loaderData.user.id) return;

    posthog.identify(loaderData.user.id, {
      email: loaderData.user.email,
    });
    identifiedUserId.current = loaderData.user.id;
  }, [loaderData.user.email, loaderData.user.id]);

  return <Outlet />;
}
