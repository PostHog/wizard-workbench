import Link from 'next/link'

export default function CheckoutSuccessPage() {
  return (
    <main>
      <h1>Order placed</h1>
      <p>Thanks for shopping at Artisan Ceramics.</p>
      <Link href="/">Back to the shop</Link>
    </main>
  )
}
