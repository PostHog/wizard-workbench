import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { Manrope } from 'next/font/google';
import { SWRConfig } from 'swr';
import { useEffect } from 'react';
import posthog from 'posthog-js';

const manrope = Manrope({ subsets: ['latin'] });

export default function App({ Component, pageProps }: AppProps) {
  const user = pageProps.fallback?.['/api/user'];

  useEffect(() => {
    if (user?.id) {
      posthog.identify(String(user.id), {
        email: user.email,
        name: user.name,
        role: user.role,
      });
    }
  }, [user?.id]);

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
