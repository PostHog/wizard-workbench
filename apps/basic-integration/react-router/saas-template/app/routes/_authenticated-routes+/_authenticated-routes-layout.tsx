import { useEffect } from "react";
import { Outlet } from "react-router";

import type { Route } from "./+types/_authenticated-routes-layout";
import {
  authContext,
  authMiddleware,
} from "~/features/user-authentication/user-authentication-middleware.server";
import posthog from "~/lib/posthog.client";

export const middleware = [authMiddleware];

export function loader({ context }: Route.LoaderArgs) {
  const { user } = context.get(authContext);

  return {
    user: {
      email: user.email,
      id: user.id,
      name: user.user_metadata.full_name ?? user.user_metadata.name,
    },
  };
}

export default function AuthenticatedRoutesLayout({
  loaderData,
}: Route.ComponentProps) {
  const { user } = loaderData;

  useEffect(() => {
    if (posthog.get_distinct_id() !== user.id) {
      posthog.identify(user.id, {
        email: user.email,
        name: user.name,
      });
    }
  }, [user.email, user.id, user.name]);

  return <Outlet />;
}
