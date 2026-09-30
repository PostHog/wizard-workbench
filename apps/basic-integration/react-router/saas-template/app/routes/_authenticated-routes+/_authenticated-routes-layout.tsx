import { usePostHog } from "@posthog/react";
import { useEffect } from "react";
import { data, Outlet } from "react-router";

import type { Route } from "./+types/_authenticated-routes-layout";
import {
  authContext,
  authMiddleware,
} from "~/features/user-authentication/user-authentication-middleware.server";

export const middleware = [authMiddleware];

export function loader({ context }: Route.LoaderArgs) {
  const { headers, user } = context.get(authContext);

  return data(
    {
      user: {
        email: user.email,
        id: user.id,
      },
    },
    { headers },
  );
}

export default function AuthenticatedRoutesLayout({
  loaderData,
}: Route.ComponentProps) {
  const posthog = usePostHog();
  const { user } = loaderData;

  useEffect(() => {
    posthog?.identify(
      user.id,
      user.email ? { email: user.email } : undefined,
    );
  }, [posthog, user.email, user.id]);

  return <Outlet />;
}
