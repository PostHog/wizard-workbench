import { useEffect } from "react";
import { Outlet } from "react-router";

import type { Route } from "./+types/_authenticated-routes-layout";
import { retrieveUserAccountFromDatabaseBySupabaseUserId } from "~/features/user-accounts/user-accounts-model.server";
import {
  authContext,
  authMiddleware,
} from "~/features/user-authentication/user-authentication-middleware.server";
import { posthog } from "~/lib/posthog.client";

export const middleware = [authMiddleware];

export async function loader({ context }: Route.LoaderArgs) {
  const {
    user: { id: supabaseUserId },
  } = context.get(authContext);
  const user =
    await retrieveUserAccountFromDatabaseBySupabaseUserId(supabaseUserId);

  if (!user) {
    throw new Error("Authenticated user account not found");
  }

  return {
    posthogUser: {
      email: user.email,
      id: user.id,
      name: user.name,
    },
  };
}

export default function AuthenticatedRoutesLayout({
  loaderData,
}: Route.ComponentProps) {
  const { posthogUser } = loaderData;

  useEffect(() => {
    posthog.identify(posthogUser.id, {
      email: posthogUser.email,
      name: posthogUser.name,
    });
  }, [posthogUser]);

  return <Outlet />;
}
