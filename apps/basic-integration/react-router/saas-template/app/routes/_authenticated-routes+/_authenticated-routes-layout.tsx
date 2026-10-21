import { useEffect } from "react";
import { data, Outlet } from "react-router";

import type { Route } from "./+types/_authenticated-routes-layout";
import {
  authContext,
  authMiddleware,
} from "~/features/user-authentication/user-authentication-middleware.server";

let identifiedUserId: string | undefined;

export const middleware = [authMiddleware];

export function loader({ context }: Route.LoaderArgs) {
  const { user } = context.get(authContext);

  return data({
    user: {
      email: user.email,
      id: user.id,
    },
  });
}

export default function AuthenticatedRoutesLayout({
  loaderData,
}: Route.ComponentProps) {
  const { user } = loaderData;

  useEffect(() => {
    if (identifiedUserId === user.id) return;

    identifiedUserId = user.id;
    void import("~/lib/posthog.client")
      .then(({ default: posthog }) => {
        posthog.identify(
          user.id,
          user.email ? { email: user.email } : undefined,
        );
      })
      .catch(() => {
        identifiedUserId = undefined;
      });
  }, [user.email, user.id]);

  return <Outlet />;
}
