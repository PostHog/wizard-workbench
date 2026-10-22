import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { Manrope } from 'next/font/google';
import { useEffect, useRef } from 'react';
import useSWR, { SWRConfig } from 'swr';
import posthog from 'posthog-js';
import type { User } from '@/lib/db/schema';

const manrope = Manrope({ subsets: ['latin'] });
const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const posthogHost = process.env.NEXT_PUBLIC_POSTHOG_HOST;
const posthogConfigured = Boolean(posthogKey && posthogHost);

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function PostHogIdentity() {
  const { data: user } = useSWR<User>('/api/user', fetcher);
  const identifiedUserId = useRef<number | null>(null);

  useEffect(() => {
    if (!posthogConfigured) {
      return;
    }

    if (!user) {
      identifiedUserId.current = null;
      return;
    }

    if (identifiedUserId.current === user.id) {
      return;
    }

    posthog.identify(String(user.id), {
      $email: user.email,
      ...(user.name ? { $name: user.name } : {}),
      role: user.role
    });
    identifiedUserId.current = user.id;
  }, [user]);

  return null;
}

if (typeof window !== 'undefined') {
  if (posthogKey && posthogHost) {
    posthog.init(posthogKey, {
      api_host: posthogHost,
      capture_exceptions: true,
      debug: process.env.NODE_ENV === 'development'
    });
  } else if (process.env.NODE_ENV === 'development') {
    const missingVariable = posthogKey
      ? 'NEXT_PUBLIC_POSTHOG_HOST'
      : 'NEXT_PUBLIC_POSTHOG_KEY';

    console.error(
      `${missingVariable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${missingVariable} is configured`
    );
  }
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
