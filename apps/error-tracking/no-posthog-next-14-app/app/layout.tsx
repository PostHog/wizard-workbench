import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: 'Ledgerly',
  description: 'Invoices for small teams',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header>
          <Link href="/">Invoices</Link>
          <Link href="/invoices/new">New invoice</Link>
          <Link href="/reports">Reports</Link>
          <Link href="/settings">Settings</Link>
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
