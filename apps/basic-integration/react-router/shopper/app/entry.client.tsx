import { StrictMode, startTransition } from "react";
import { hydrateRoot } from "react-dom/client";
import { PostHogProvider } from "@posthog/react";
import { HydratedRouter } from "react-router/dom";

import posthog from "./posthog.client";

startTransition(() => {
  const app = posthog ? (
    <PostHogProvider client={posthog}>
      <HydratedRouter />
    </PostHogProvider>
  ) : (
    <HydratedRouter />
  );

  hydrateRoot(document, <StrictMode>{app}</StrictMode>);
});
