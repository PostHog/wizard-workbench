import { Outlet } from "react-router";

import type { Route } from "./+types/_authenticated-routes-layout";
import {
  authContext,
  authMiddleware,
} from "~/features/user-authentication/user-authentication-middleware.server";

export const middleware = [authMiddleware];

export function loader({ context }: Route.LoaderArgs) {
  const { user } = context.get(authContext);

  return {
    posthogUser: {
      email: user.email,
      id: user.id,
    },
  };
}

export default function AuthenticatedRoutesLayout({
  loaderData,
}: Route.ComponentProps) {
  return (
    <>
      <div
        data-posthog-user-email={loaderData.posthogUser.email}
        data-posthog-user-id={loaderData.posthogUser.id}
        hidden
      />
      <Outlet />
    </>
  );
}
