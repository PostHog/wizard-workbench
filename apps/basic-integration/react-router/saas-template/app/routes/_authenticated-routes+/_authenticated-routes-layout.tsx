import { useEffect } from "react";
import { Outlet, useLoaderData } from "react-router";

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
    posthogUser: {
      ...(user.email ? { email: user.email } : {}),
      id: user.id,
    },
  };
}

export default function AuthenticatedRoutesLayout() {
  const { posthogUser } = useLoaderData<typeof loader>();

  useEffect(() => {
    posthog.identify(
      posthogUser.id,
      posthogUser.email ? { email: posthogUser.email } : {},
    );
  }, [posthogUser.email, posthogUser.id]);

  return <Outlet />;
}
