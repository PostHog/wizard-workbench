import { useEffect, useRef } from "react";
import { Outlet } from "react-router";
import { usePostHog } from "posthog-js/react";

import type { Route } from "./+types/_authenticated-routes-layout";
import {
  authContext,
  authMiddleware,
} from "~/features/user-authentication/user-authentication-middleware.server";

export const middleware = [authMiddleware];

export function loader({ context }: Route.LoaderArgs) {
  const { user } = context.get(authContext);

  return { email: user.email, id: user.id };
}

export default function AuthenticatedRoutesLayout({
  loaderData,
}: Route.ComponentProps) {
  const posthog = usePostHog();
  const isPostHogConfigured = Boolean(
    globalThis.ENV.VITE_PUBLIC_POSTHOG_HOST &&
      globalThis.ENV.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN,
  );
  const identifiedUserId = useRef<string | null>(null);

  useEffect(() => {
    if (!isPostHogConfigured || identifiedUserId.current === loaderData.id) {
      return;
    }

    posthog?.identify(
      loaderData.id,
      loaderData.email ? { email: loaderData.email } : undefined,
    );
    posthog?.logger.info("authenticated session identified", {
      authentication_method: "supabase",
    });
    identifiedUserId.current = loaderData.id;
  }, [isPostHogConfigured, loaderData.email, loaderData.id, posthog]);

  return <Outlet />;
}
