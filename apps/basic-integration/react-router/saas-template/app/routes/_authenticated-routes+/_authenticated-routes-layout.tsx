import { Outlet } from "react-router";

import type { Route } from "./+types/_authenticated-routes-layout";
import {
  authContext,
  authMiddleware,
} from "~/features/user-authentication/user-authentication-middleware.server";

export const middleware = [authMiddleware];

export function loader({ context }: Route.LoaderArgs) {
  const { user } = context.get(authContext);

  return { user: { email: user.email, id: user.id } };
}

export async function clientLoader({ serverLoader }: Route.ClientLoaderArgs) {
  const { user } = await serverLoader();
  const { identifyPostHogUser } = await import("~/lib/posthog.client");

  identifyPostHogUser(user);

  return { user };
}

clientLoader.hydrate = true;

export default function AuthenticatedRoutesLayout() {
  return <Outlet />;
}
