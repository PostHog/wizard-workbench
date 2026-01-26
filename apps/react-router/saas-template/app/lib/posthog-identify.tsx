import { usePostHog } from "@posthog/react";
import { useEffect, useRef } from "react";

interface PostHogIdentifyProps {
  user: {
    id: string;
    email: string;
    name?: string | null;
  } | null;
}

/**
 * Component that identifies the user with PostHog when they're authenticated.
 * Should be placed in authenticated layouts to ensure user identification happens
 * once per session after successful authentication.
 */
export function PostHogIdentify({ user }: PostHogIdentifyProps) {
  const posthog = usePostHog();
  const identifiedRef = useRef<string | null>(null);

  useEffect(() => {
    if (!posthog || !user) return;

    // Only identify if we haven't identified this user yet in this session
    if (identifiedRef.current === user.id) return;

    posthog.identify(user.id, {
      email: user.email,
      ...(user.name && { name: user.name }),
    });

    identifiedRef.current = user.id;
  }, [posthog, user]);

  return null;
}

/**
 * Hook version for cases where a component approach isn't suitable
 */
export function usePostHogIdentify(user: PostHogIdentifyProps["user"]) {
  const posthog = usePostHog();
  const identifiedRef = useRef<string | null>(null);

  useEffect(() => {
    if (!posthog || !user) return;

    // Only identify if we haven't identified this user yet in this session
    if (identifiedRef.current === user.id) return;

    posthog.identify(user.id, {
      email: user.email,
      ...(user.name && { name: user.name }),
    });

    identifiedRef.current = user.id;
  }, [posthog, user]);
}
