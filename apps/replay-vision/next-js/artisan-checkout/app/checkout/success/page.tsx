import Link from 'next/link'

export default function CheckoutSuccessPage() {
  return (
    <main>
      <h1>Order placed</h1>
      <p>Thanks for supporting the studio.</p>
      <Link href="/">Back to the shop</Link>
    </main>
  )
}
