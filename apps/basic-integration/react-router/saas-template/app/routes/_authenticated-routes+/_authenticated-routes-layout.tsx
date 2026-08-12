import { useEffect, useRef } from "react";
import { data, Outlet } from "react-router";

import type { Route } from "./+types/_authenticated-routes-layout";
import {
  authContext,
  authMiddleware,
} from "~/features/user-authentication/user-authentication-middleware.server";
import { posthog } from "~/utils/posthog.client";

export const middleware = [authMiddleware];

export async function loader({ context }: Route.LoaderArgs) {
  const { headers, user } = context.get(authContext);

  return data({ user: { email: user.email, id: user.id } }, { headers });
}

export default function AuthenticatedRoutesLayout({
  loaderData,
}: Route.ComponentProps) {
  const identifiedUserId = useRef<string | null>(null);

  useEffect(() => {
    if (identifiedUserId.current !== loaderData.user.id) {
      posthog.identify(loaderData.user.id, {
        email: loaderData.user.email,
      });
      identifiedUserId.current = loaderData.user.id;
    }
  }, [loaderData.user.email, loaderData.user.id]);

  return <Outlet />;
}
