import Link from 'next/link'

import { PRODUCTS } from '@/lib/products'

export default function ShopPage() {
  return (
    <main>
      <h1>Artisan Ceramics</h1>
      <ul>
        {PRODUCTS.map((product) => (
          <li key={product.slug}>
            {product.name} - ${product.priceUsd} <Link href="/cart">Add to cart</Link>
          </li>
        ))}
      </ul>
    </main>
  )
}
