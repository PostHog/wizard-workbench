import { useEffect } from "react";
import { Outlet } from "react-router";

import type { Route } from "./+types/_authenticated-routes-layout";
import {
  authContext,
  authMiddleware,
} from "~/features/user-authentication/user-authentication-middleware.server";

export const middleware = [authMiddleware];

export function loader({ context }: Route.LoaderArgs) {
  const { user } = context.get(authContext);
  const name =
    typeof user.user_metadata.full_name === "string"
      ? user.user_metadata.full_name
      : typeof user.user_metadata.name === "string"
        ? user.user_metadata.name
        : undefined;

  return {
    posthogUser: {
      email: user.email,
      id: user.id,
      name,
    },
  };
}

export default function AuthenticatedRoutesLayout({
  loaderData,
}: Route.ComponentProps) {
  const { email, id, name } = loaderData.posthogUser;

  useEffect(() => {
    const properties = {
      ...(email ? { email } : {}),
      ...(name ? { name } : {}),
    };

    void import("posthog-js").then(({ default: posthog }) => {
      posthog.identify(id, properties);
    });
  }, [email, id, name]);

  return <Outlet />;
}
