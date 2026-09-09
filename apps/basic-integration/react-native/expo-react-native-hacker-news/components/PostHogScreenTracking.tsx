import { useEffect } from "react";
import { usePathname } from "expo-router";

import { posthog } from "@/lib/posthog";

export const PostHogScreenTracking = () => {
  const pathname = usePathname();

  useEffect(() => {
    posthog?.screen(pathname);
  }, [pathname]);

  return null;
};
