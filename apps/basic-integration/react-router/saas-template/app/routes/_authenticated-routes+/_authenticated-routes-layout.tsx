import { usePostHog } from "@posthog/react";
import { useEffect, useRef } from "react";
import { Outlet } from "react-router";

import type { Route } from "./+types/_authenticated-routes-layout";
import {
  authContext,
  authMiddleware,
} from "~/features/user-authentication/user-authentication-middleware.server";

export const middleware = [authMiddleware];

export async function loader({ context }: Route.LoaderArgs) {
  const { user } = context.get(authContext);

  return {
    user: {
      email: user.email ?? null,
      id: user.id,
    },
  };
}

export default function AuthenticatedRoutesLayout({
  loaderData,
}: Route.ComponentProps) {
  return (
    <>
      <PostHogIdentity user={loaderData.user} />
      <Outlet />
    </>
  );
}

function PostHogIdentity({
  user,
}: {
  user: { email: string | null; id: string };
}) {
  const posthog = usePostHog();
  const identifiedUserId = useRef<string | null>(null);

  useEffect(() => {
    if (
      !import.meta.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN ||
      !import.meta.env.VITE_PUBLIC_POSTHOG_HOST ||
      identifiedUserId.current === user.id
    ) {
      return;
    }

    posthog.identify(user.id, user.email ? { email: user.email } : undefined);
    identifiedUserId.current = user.id;
  }, [posthog, user]);

  return null;
}
