'use client';

import { useEffect } from 'react';
import posthog from 'posthog-js';

export function PostHogIdentify({
  userId,
  email,
  name,
  role,
}: {
  userId: number;
  email: string;
  name: string | null;
  role: string;
}) {
  useEffect(() => {
    posthog.identify(String(userId), { email, name, role });
  }, [userId, email, name, role]);

  return null;
}
