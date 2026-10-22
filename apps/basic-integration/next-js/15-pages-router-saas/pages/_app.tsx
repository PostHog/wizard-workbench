import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { Manrope } from 'next/font/google';
import { useEffect, useRef } from 'react';
import { SWRConfig } from 'swr';
import useSWR from 'swr';
import posthog from 'posthog-js';
import type { User } from '@/lib/db/schema';

const manrope = Manrope({ subsets: ['latin'] });

if (typeof window !== 'undefined') {
  const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
  const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;

  if (!posthogKey) {
    if (process.env.NODE_ENV === 'development') {
      throw new Error(
        'NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN is configured'
      );
    }
  } else if (!posthogHost) {
    if (process.env.NODE_ENV === 'development') {
      throw new Error(
        'NEXT_PUBLIC_POSTHOG_HOST variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once NEXT_PUBLIC_POSTHOG_HOST is configured'
      );
    }
  } else {
    posthog.init(posthogKey, {
      api_host: posthogHost,
      tracing_headers: [window.location.hostname],
      defaults: '2025-05-24',
      capture_exceptions: true,
      debug: process.env.NODE_ENV === 'development'
    });
  }
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function PostHogIdentity() {
  const { data: user } = useSWR<User | null>('/api/user', fetcher);
  const identifiedUserId = useRef<string | null>(null);

  useEffect(() => {
    if (
      !process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN ||
      !process.env.NEXT_PUBLIC_POSTHOG_HOST ||
      user === undefined
    ) {
      return;
    }

    if (!user) {
      if (identifiedUserId.current) {
        posthog.reset();
        identifiedUserId.current = null;
      }
      return;
    }

    const distinctId = String(user.id);
    if (identifiedUserId.current === distinctId) {
      return;
    }

    if (identifiedUserId.current) {
      posthog.reset();
    }

    posthog.identify(distinctId, {
      email: user.email,
      name: user.name || undefined,
      role: user.role
    });
    identifiedUserId.current = distinctId;
  }, [user]);

  return null;
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={manrope.className}>
      <SWRConfig
        value={{
          fallback: pageProps.fallback || {}
        }}
      >
        <PostHogIdentity />
        <Component {...pageProps} />
      </SWRConfig>
    </div>
  );
}
