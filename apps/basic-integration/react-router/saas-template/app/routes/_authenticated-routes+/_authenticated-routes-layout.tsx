import posthog from "posthog-js";
import { useEffect, useRef } from "react";
import { data, Outlet, useLoaderData } from "react-router";

import type { Route } from "./+types/_authenticated-routes-layout";
import {
  authContext,
  authMiddleware,
} from "~/features/user-authentication/user-authentication-middleware.server";

export const middleware = [authMiddleware];

export async function loader({ context }: Route.LoaderArgs) {
  const { user } = context.get(authContext);

  return data({
    user: {
      email: user.email,
      id: user.id,
    },
  });
}

export default function AuthenticatedRoutesLayout() {
  const { user } = useLoaderData<typeof loader>();
  const hasIdentified = useRef(false);

  useEffect(() => {
    if (
      !hasIdentified.current &&
      window.ENV.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN &&
      window.ENV.VITE_PUBLIC_POSTHOG_HOST
    ) {
      posthog.identify(user.id, { email: user.email });
      hasIdentified.current = true;
    }
  }, [user.email, user.id]);

  return <Outlet />;
}
