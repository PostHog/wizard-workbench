import type { AppProps } from 'next/app';
import '@/styles/globals.css';
import '../instrumentation-client';

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
