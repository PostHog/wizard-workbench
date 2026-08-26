import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { Manrope } from 'next/font/google';
import { useEffect, useRef } from 'react';
import useSWR, { SWRConfig } from 'swr';
import posthog from 'posthog-js';
import { User } from '@/lib/db/schema';

const manrope = Manrope({ subsets: ['latin'] });
const fetcher = (url: string) => fetch(url).then((res) => res.json());

function IdentifyAuthenticatedUser() {
  const { data: user } = useSWR<User>('/api/user', fetcher);
  const identifiedUserId = useRef<number | null>(null);

  useEffect(() => {
    if (!user) {
      identifiedUserId.current = null;
      return;
    }

    if (identifiedUserId.current === user.id) return;

    posthog.identify(String(user.id), {
      email: user.email,
      name: user.name || undefined,
      role: user.role
    });
    identifiedUserId.current = user.id;
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
        <IdentifyAuthenticatedUser />
        <Component {...pageProps} />
      </SWRConfig>
    </div>
  );
}
