import { Outlet } from "react-router";

import type { Route } from "./+types/_authenticated-routes-layout";
import {
  authContext,
  authMiddleware,
} from "~/features/user-authentication/user-authentication-middleware.server";

export const middleware = [authMiddleware];

export function loader({ context }: Route.LoaderArgs) {
  const { user } = context.get(authContext);

  return { posthogUser: { email: user.email, id: user.id } };
}

export default function AuthenticatedRoutesLayout() {
  return <Outlet />;
}
