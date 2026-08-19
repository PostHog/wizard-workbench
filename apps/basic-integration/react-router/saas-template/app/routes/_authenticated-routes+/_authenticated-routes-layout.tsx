import { useEffect } from "react";
import { Outlet } from "react-router";

import type { Route } from "./+types/_authenticated-routes-layout";
import {
  authContext,
  authMiddleware,
} from "~/features/user-authentication/user-authentication-middleware.server";

export const middleware = [authMiddleware];

export async function loader({ context }: Route.LoaderArgs) {
  const { user } = context.get(authContext);

  return { user: { email: user.email, id: user.id } };
}

export default function AuthenticatedRoutesLayout({
  loaderData,
}: Route.ComponentProps) {
  useEffect(() => {
    void import("posthog-js").then(({ default: posthog }) => {
      if (
        !posthog.__loaded ||
        posthog.get_distinct_id() === loaderData.user.id
      ) {
        return;
      }

      posthog.identify(loaderData.user.id, { email: loaderData.user.email });
    });
  }, [loaderData.user.email, loaderData.user.id]);

  return <Outlet />;
}
