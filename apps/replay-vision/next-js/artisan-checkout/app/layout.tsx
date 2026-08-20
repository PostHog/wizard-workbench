import Link from 'next/link'
import type { ReactNode } from 'react'

export const metadata = { title: 'Artisan Checkout' }

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'system-ui', maxWidth: 640, margin: '2rem auto', padding: '0 1rem' }}>
        <nav style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          <Link href="/">Shop</Link>
          <Link href="/cart">Cart</Link>
        </nav>
        {children}
      </body>
    </html>
  )
}
