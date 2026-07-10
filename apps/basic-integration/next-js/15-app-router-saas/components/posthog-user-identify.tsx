'use client';

import { useEffect } from 'react';
import useSWR from 'swr';
import posthog from 'posthog-js';

type CurrentUser = {
  id: number;
  email: string;
  name?: string | null;
  role?: string | null;
} | null;

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function PostHogUserIdentify() {
  const { data: user } = useSWR<CurrentUser>('/api/user', fetcher);

  useEffect(() => {
    if (!user?.id) {
      return;
    }

    posthog.identify(String(user.id), {
      email: user.email,
      name: user.name ?? undefined,
      role: user.role ?? undefined
    });
  }, [user]);

  return null;
}
