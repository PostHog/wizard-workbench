import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "Ledgerly",
  description: "Invoices and reports for small teams",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <header className="topbar">
          <Link href="/" className="brand">
            Ledgerly
          </Link>
          <nav>
            <Link href="/">Invoices</Link>
            <Link href="/invoices/new">New invoice</Link>
            <Link href="/reports">Reports</Link>
          </nav>
        </header>
        <main className="container">{children}</main>
      </body>
    </html>
  );
}
