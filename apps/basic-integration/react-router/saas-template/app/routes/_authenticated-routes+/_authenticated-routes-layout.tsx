import { usePostHog } from "@posthog/react";
import { useEffect } from "react";
import { data, Outlet, useLoaderData } from "react-router";

import type { Route } from "./+types/_authenticated-routes-layout";
import {
  authContext,
  authMiddleware,
} from "~/features/user-authentication/user-authentication-middleware.server";

export const middleware = [authMiddleware];

export function loader({ context }: Route.LoaderArgs) {
  const { user } = context.get(authContext);

  return data({
    user: {
      email: user.email,
      id: user.id,
      name: user.user_metadata.full_name,
    },
  });
}

export default function AuthenticatedRoutesLayout() {
  const { user } = useLoaderData<typeof loader>();
  const posthog = usePostHog();

  useEffect(() => {
    posthog?.identify(user.id, {
      ...(user.email ? { email: user.email } : {}),
      ...(user.name ? { name: user.name } : {}),
    });
  }, [posthog, user.email, user.id, user.name]);

  return <Outlet />;
}
