import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { Manrope } from 'next/font/google';
import { SWRConfig } from 'swr';
import { useEffect } from 'react';
import useSWR from 'swr';
import posthog from 'posthog-js';
import { User } from '@/lib/db/schema';

const manrope = Manrope({ subsets: ['latin'] });
const fetcher = (url: string) => fetch(url).then((res) => res.json());

function IdentifyAuthenticatedUser() {
  const { data: user } = useSWR<User | null>('/api/user', fetcher);

  useEffect(() => {
    if (!user) return;

    posthog.identify(user.id.toString(), {
      email: user.email,
      name: user.name || undefined,
      role: user.role
    });
  }, [user?.id, user?.email, user?.name, user?.role]);

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
