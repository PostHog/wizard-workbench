import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { Manrope } from 'next/font/google';
import useSWR, { SWRConfig } from 'swr';
import { useEffect, useState } from 'react';

const manrope = Manrope({ subsets: ['latin'] });
const fetcher = (url: string) => fetch(url).then((res) => res.json());

type PostHogUser = {
  id: number;
  email: string;
  name: string | null;
  role: string;
};

function PostHogIdentity({ ready }: { ready: boolean }) {
  const { data: user } = useSWR<PostHogUser>('/api/user', fetcher);

  useEffect(() => {
    if (!ready || !user || typeof user.id !== 'number') {
      return;
    }

    void import('posthog-js').then(({ default: posthog }) => {
      posthog.identify(String(user.id), {
        email: user.email,
        name: user.name || undefined,
        role: user.role
      });
    });
  }, [ready, user]);

  return null;
}

export default function App({ Component, pageProps }: AppProps) {
  const [posthogReady, setPosthogReady] = useState(false);

  useEffect(() => {
    const projectToken = process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
    const host = process.env.NEXT_PUBLIC_POSTHOG_HOST;

    if (!projectToken || !host) {
      if (process.env.NODE_ENV === 'development') {
        const variableName = !projectToken
          ? 'NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN'
          : 'NEXT_PUBLIC_POSTHOG_HOST';
        throw new Error(
          `${variableName} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once ${variableName} is configured`
        );
      }
      return;
    }

    void import('posthog-js').then(({ default: posthog }) => {
      posthog.init(projectToken, {
        api_host: host,
        defaults: '2026-01-30',
        capture_exceptions: true,
        debug: process.env.NODE_ENV === 'development',
        tracing_headers: [window.location.hostname]
      });
      setPosthogReady(true);
    });
  }, []);

  return (
    <div className={manrope.className}>
      <SWRConfig
        value={{
          fallback: pageProps.fallback || {}
        }}
      >
        <PostHogIdentity ready={posthogReady} />
        <Component {...pageProps} />
      </SWRConfig>
    </div>
  );
}
