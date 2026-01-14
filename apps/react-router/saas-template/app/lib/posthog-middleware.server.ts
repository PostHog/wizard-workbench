import { PostHog } from "posthog-node";
import type { MiddlewareFunction, RouterContextProvider } from "react-router";

export interface PostHogContext extends RouterContextProvider {
  posthog?: PostHog;
}

export const posthogMiddleware: MiddlewareFunction = async (
  { request, context },
  next,
) => {
  const apiKey = process.env.VITE_PUBLIC_POSTHOG_KEY ?? "";
  const host = process.env.VITE_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com";

  const posthog = new PostHog(apiKey, {
    host,
    flushAt: 1,
    flushInterval: 0,
  });

  const sessionId = request.headers.get("X-POSTHOG-SESSION-ID");
  const distinctId = request.headers.get("X-POSTHOG-DISTINCT-ID");

  (context as PostHogContext).posthog = posthog;

  const response = await posthog.withContext(
    { sessionId: sessionId ?? undefined, distinctId: distinctId ?? undefined },
    next,
  );

  await posthog.shutdown().catch(() => {});

  return response as Response;
};
