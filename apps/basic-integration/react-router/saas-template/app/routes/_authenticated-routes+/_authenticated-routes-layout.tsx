import { useEffect, useRef } from "react";
import { Outlet } from "react-router";

import type { Route } from "./+types/_authenticated-routes-layout";
import {
  authContext,
  authMiddleware,
} from "~/features/user-authentication/user-authentication-middleware.server";

export const middleware = [authMiddleware];

export async function loader({ context }: Route.LoaderArgs) {
  const { user } = context.get(authContext);

  return { posthogUser: { email: user.email ?? null, userId: user.id } };
}

export default function AuthenticatedRoutesLayout({
  loaderData,
}: Route.ComponentProps) {
  const identifiedUserId = useRef<string | null>(null);

  useEffect(() => {
    if (identifiedUserId.current === loaderData.posthogUser.userId) return;

    identifiedUserId.current = loaderData.posthogUser.userId;
    document.dispatchEvent(
      new CustomEvent("posthog:identify", { detail: loaderData.posthogUser }),
    );
  }, [loaderData.posthogUser]);

  return <Outlet />;
}
