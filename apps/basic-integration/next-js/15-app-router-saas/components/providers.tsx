'use client';

import { useEffect } from 'react';
import posthog from 'posthog-js';
import type { User } from '@/lib/db/schema';

export function PostHogProvider({
  children,
  user,
}: {
  children: React.ReactNode;
  user: User | null;
}) {
  useEffect(() => {
    posthog.init(
      process.env.NEXT_PUBLIC_POSTHOG_KEY as string,
      {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
      }
    );
  }, []);

  useEffect(() => {
    if (user) {
      posthog.identify(String(user.id), {
        email: user.email,
        ...(user.name && { name: user.name }),
      });
    }
  }, [user]);

  return <>{children}</>;
}
