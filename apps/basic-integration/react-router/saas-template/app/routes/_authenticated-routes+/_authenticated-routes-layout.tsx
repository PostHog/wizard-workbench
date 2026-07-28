import { useEffect } from "react";
import { Outlet } from "react-router";

import type { Route } from "./+types/_authenticated-routes-layout";
import { authContext, authMiddleware } from "~/features/user-authentication/user-authentication-middleware.server";

export const middleware = [authMiddleware];

export async function loader({ context }: Route.LoaderArgs) {
  const { user } = context.get(authContext);

  return {
    user: {
      email: user.email,
      id: user.id,
    },
  };
}

export default function AuthenticatedRoutesLayout({
  loaderData,
}: Route.ComponentProps) {
  useEffect(() => {
    if (
      !import.meta.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN ||
      !import.meta.env.VITE_PUBLIC_POSTHOG_HOST
    ) {
      return;
    }

    void import("posthog-js").then(({ default: posthog }) => {
      posthog.identify(
        loaderData.user.id,
        loaderData.user.email ? { email: loaderData.user.email } : undefined,
      );
    });
  }, [loaderData.user.email, loaderData.user.id]);

  return <Outlet />;
}
