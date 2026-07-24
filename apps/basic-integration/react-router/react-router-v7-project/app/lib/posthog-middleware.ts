import { PostHog } from "posthog-node";
import type { RouterContextProvider } from "react-router";
import type { Route } from "../+types/root";

export interface PostHogContext extends RouterContextProvider {
  posthog?: PostHog;
}

export const posthogMiddleware: Route.MiddlewareFunction = async ({ request, context }, next) => {
  const token = process.env.VITE_PUBLIC_POSTHOG_PROJECT_TOKEN;
  const host = process.env.VITE_PUBLIC_POSTHOG_HOST;

  if (!token || !host) {
    if (process.env.NODE_ENV !== 'production') {
      console.error(
        'VITE_PUBLIC_POSTHOG_PROJECT_TOKEN or VITE_PUBLIC_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once VITE_PUBLIC_POSTHOG_PROJECT_TOKEN and VITE_PUBLIC_POSTHOG_HOST are configured'
      );
    }
    return next();
  }

  const posthog = new PostHog(token, {
    host,
    flushAt: 1,
    flushInterval: 0,
  });

  const sessionId = request.headers.get('X-POSTHOG-SESSION-ID');
  const distinctId = request.headers.get('X-POSTHOG-DISTINCT-ID');

  (context as PostHogContext).posthog = posthog;

  const response = await posthog.withContext(
    { sessionId: sessionId ?? undefined, distinctId: distinctId ?? undefined },
    next
  );

  await posthog.shutdown().catch(() => {});

  return response;
};
