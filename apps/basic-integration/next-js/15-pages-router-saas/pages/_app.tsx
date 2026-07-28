import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { Manrope } from 'next/font/google';
import { useCallback, useEffect, useRef } from 'react';
import useSWR, { SWRConfig } from 'swr';

const manrope = Manrope({ subsets: ['latin'] });

interface IdentifiedUser {
  id: number;
  email: string;
  name: string | null;
  role: string;
}

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function PostHogIdentity() {
  const { data: user } = useSWR<IdentifiedUser | null>('/api/user', fetcher);
  const identifiedUserId = useRef<string | null>(null);

  const identifyUser = useCallback((identifiedUser: IdentifiedUser) => {
    const distinctId = String(identifiedUser.id);
    if (identifiedUserId.current === distinctId) {
      return;
    }

    identifiedUserId.current = distinctId;
    void import('posthog-js').then(({ default: posthog }) => {
      posthog.identify(distinctId, {
        email: identifiedUser.email,
        name: identifiedUser.name || undefined,
        role: identifiedUser.role
      });
    });
  }, []);

  useEffect(() => {
    if (user) {
      identifyUser(user);
    }
  }, [user, identifyUser]);

  useEffect(() => {
    const handleIdentify = (event: Event) => {
      identifyUser((event as CustomEvent<IdentifiedUser>).detail);
    };

    window.addEventListener('posthog:identify', handleIdentify);
    return () => window.removeEventListener('posthog:identify', handleIdentify);
  }, [identifyUser]);

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
