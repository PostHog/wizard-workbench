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
  const { user } = context.get(authContext);

  return data({
    posthogUser: {
      distinctId: user.id,
      ...(user.email ? { email: user.email } : {}),
    },
  });
}

export default function AuthenticatedRoutesLayout({
  loaderData,
}: Route.ComponentProps) {
  const posthog = usePostHog();
  const { distinctId, email } = loaderData.posthogUser;

  useEffect(() => {
    if (
      !posthog ||
      !window.ENV.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN ||
      !window.ENV.VITE_PUBLIC_POSTHOG_HOST
    ) {
      return;
    }

    if (posthog.get_distinct_id() !== distinctId) {
      posthog.identify(distinctId, email ? { email } : undefined);
      posthog.logger.info("authenticated session identified", {
        event: "authenticated_session_identified",
      });
    }
  }, [distinctId, email, posthog]);

  return <Outlet />;
}
