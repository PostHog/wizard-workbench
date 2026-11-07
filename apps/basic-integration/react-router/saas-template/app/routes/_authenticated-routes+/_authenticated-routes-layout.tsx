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
  const name = user.user_metadata.name;

  return {
    user: {
      email: user.email,
      id: user.id,
      name: typeof name === "string" ? name : undefined,
    },
  };
}

export default function AuthenticatedRoutesLayout({
  loaderData,
}: Route.ComponentProps) {
  const { user } = loaderData;

  useEffect(() => {
    window.posthogIdentify?.(user.id, {
      ...(user.email ? { email: user.email } : {}),
      ...(user.name ? { name: user.name } : {}),
    });
  }, [user.email, user.id, user.name]);

  return <Outlet />;
}
