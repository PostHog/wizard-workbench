import type { ReactNode } from 'react';

export const metadata = {
  title: 'Support desk',
  description: 'Inbound ticket triage',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
