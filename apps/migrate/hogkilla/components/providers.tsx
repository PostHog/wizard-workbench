"use client";

import { EmptyFlagsProvider, LDFlagsProvider } from "@/hooks/use-flags";
import { LDProvider } from "launchdarkly-react-client-sdk";
import { type ReactNode } from "react";

const launchDarklyContext = {
  kind: "user",
  key: "EXAMPLE_CONTEXT_KEY",
  email: "biz@face.dev",
};

function LaunchDarklyProvider({ children }: { children: ReactNode }) {
  const ldClientId = process.env.NEXT_PUBLIC_LAUNCHDARKLY_CLIENT_ID ?? "69c4193c7a26180a245c89f3";

  if (!ldClientId) {
    return <EmptyFlagsProvider>{children}</EmptyFlagsProvider>;
  }

  return (
    <LDProvider clientSideID={ldClientId} context={launchDarklyContext}>
      <LDFlagsProvider>{children}</LDFlagsProvider>
    </LDProvider>
  );
}

export function AppProviders({ children }: { children: ReactNode }) {
  return <LaunchDarklyProvider>{children}</LaunchDarklyProvider>;
}
