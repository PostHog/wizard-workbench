"use client";

import { useFlags } from "launchdarkly-react-client-sdk";
import { createContext, useContext } from "react";

type Flags = Record<string, unknown>;
const FlagsContext = createContext<Flags>({});

export function LDFlagsProvider({ children }: { children: React.ReactNode }) {
  const flags = useFlags();
  return <FlagsContext.Provider value={flags}>{children}</FlagsContext.Provider>;
}

export function EmptyFlagsProvider({ children }: { children: React.ReactNode }) {
  return <FlagsContext.Provider value={{}}>{children}</FlagsContext.Provider>;
}

export function useFeatureFlags() {
  return useContext(FlagsContext);
}
