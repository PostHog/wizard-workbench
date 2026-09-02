import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { Manrope } from 'next/font/google';
import useSWR, { SWRConfig } from 'swr';
import { useEffect } from 'react';
import posthog from 'posthog-js';

interface AuthenticatedUser {
  id: number;
  email: string;
  name: string | null;
  role: string;
}

const manrope = Manrope({ subsets: ['latin'] });

const fetcher = (url: string) => fetch(url).then((res) => res.json());

function PostHogIdentity() {
  const { data: user } = useSWR<AuthenticatedUser | null>('/api/user', fetcher);

  useEffect(() => {
    if (!user) {
      return;
    }

    posthog.identify(String(user.id), {
      email: user.email,
      ...(user.name ? { name: user.name } : {}),
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
        <PostHogIdentity />
        <Component {...pageProps} />
      </SWRConfig>
    </div>
  );
}
