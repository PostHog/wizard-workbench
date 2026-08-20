import Link from 'next/link'

import { PRODUCTS } from '@/lib/products'

export default function CartPage() {
  const items = PRODUCTS.slice(0, 2)
  const total = items.reduce((sum, item) => sum + item.priceUsd, 0)
  return (
    <main>
      <h1>Your cart</h1>
      <ul>
        {items.map((item) => (
          <li key={item.slug}>
            {item.name} - ${item.priceUsd}
          </li>
        ))}
      </ul>
      <p>Total: ${total}</p>
      <Link href="/checkout">Proceed to checkout</Link>
    </main>
  )
}
