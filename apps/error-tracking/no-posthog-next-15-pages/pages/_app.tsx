import type { AppProps } from 'next/app';
import Link from 'next/link';
import '../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <header>
        <Link href="/">Invoices</Link>
        <Link href="/reports">Reports</Link>
      </header>
      <main>
        <Component {...pageProps} />
      </main>
    </>
  );
}
