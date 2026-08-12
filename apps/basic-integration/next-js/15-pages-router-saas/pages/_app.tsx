import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { useEffect } from 'react';
import { Manrope } from 'next/font/google';
import { SWRConfig } from 'swr';
import posthog from 'posthog-js';

const manrope = Manrope({ subsets: ['latin'] });

type AuthenticatedUser = {
  id: number;
  email: string;
  name: string | null;
  role: string;
};

function identifyUser(user: AuthenticatedUser | null | undefined) {
  if (!user) return;

  posthog.identify(String(user.id), {
    email: user.email,
    name: user.name,
    role: user.role
  });
}

export default function App({ Component, pageProps }: AppProps) {
  const user = pageProps.fallback?.['/api/user'] as AuthenticatedUser | null | undefined;

  useEffect(() => {
    identifyUser(user);
  }, [user]);

  return (
    <div className={manrope.className}>
      <SWRConfig
        value={{
          fallback: pageProps.fallback || {}
        }}
      >
        <Component {...pageProps} />
      </SWRConfig>
    </div>
  );
}
