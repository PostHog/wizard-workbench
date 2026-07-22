import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { Manrope } from 'next/font/google';
import posthog from 'posthog-js';
import { useEffect } from 'react';
import useSWR, { SWRConfig } from 'swr';
import { User } from '@/lib/db/schema';

const fetcher = (url: string) => fetch(url).then((res) => res.json());
const isPostHogConfigured = Boolean(
  process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN &&
    process.env.NEXT_PUBLIC_POSTHOG_HOST
);

const manrope = Manrope({ subsets: ['latin'] });

function IdentifyAuthenticatedUser() {
  const { data: user } = useSWR<User>('/api/user', fetcher);

  useEffect(() => {
    if (!isPostHogConfigured || !user) {
      return;
    }

    posthog.identify(String(user.id), {
      email: user.email,
      ...(user.name ? { name: user.name } : {}),
      role: user.role
    });
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
