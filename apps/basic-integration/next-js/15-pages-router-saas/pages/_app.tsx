import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { Manrope } from 'next/font/google';
import { useEffect } from 'react';
import posthog from 'posthog-js';
import useSWR, { SWRConfig } from 'swr';
import type { User } from '@/lib/db/schema';

const manrope = Manrope({ subsets: ['latin'] });
const fetcher = (url: string) => fetch(url).then((res) => res.json());

function PostHogIdentity() {
  const { data: user } = useSWR<User>('/api/user', fetcher);

  useEffect(() => {
    if (!user) {
      return;
    }

    posthog.identify(String(user.id), {
      email: user.email,
      name: user.name ?? undefined,
      role: user.role,
    });
  }, [user?.id]);

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
