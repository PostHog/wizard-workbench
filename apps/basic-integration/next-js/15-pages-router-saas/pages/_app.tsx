import '@/styles/globals.css';
import ErrorBoundary from '@/components/error-boundary';
import type { AppProps } from 'next/app';
import { Manrope } from 'next/font/google';
import { SWRConfig } from 'swr';

const manrope = Manrope({ subsets: ['latin'] });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className={manrope.className}>
      <SWRConfig
        value={{
          fallback: pageProps.fallback || {}
        }}
      >
        <ErrorBoundary>
          <Component {...pageProps} />
        </ErrorBoundary>
      </SWRConfig>
    </div>
  );
}
