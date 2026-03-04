import { usePostHog } from "@posthog/react";
import { useEffect } from "react";
import { Outlet, useLoaderData } from "react-router";

import type { Route } from "./+types/_authenticated-routes-layout";
import {
  authContext,
  authMiddleware,
} from "~/features/user-authentication/user-authentication-middleware.server";

export const middleware = [authMiddleware];

export async function loader({ context }: Route.LoaderArgs) {
  const { user } = context.get(authContext);
  return { userEmail: user.email, userId: user.id };
}

export default function AuthenticatedRoutesLayout() {
  const { userEmail, userId } = useLoaderData<typeof loader>();
  const posthog = usePostHog();

  useEffect(() => {
    if (posthog && userId) {
      posthog.identify(userId, { email: userEmail });
    }
  }, [posthog, userId, userEmail]);

  return <Outlet />;
}
