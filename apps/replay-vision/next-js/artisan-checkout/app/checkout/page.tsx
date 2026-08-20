'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function CheckoutPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  return (
    <main>
      <h1>Checkout</h1>
      <form
        onSubmit={(event) => {
          event.preventDefault()
          router.push('/checkout/success')
        }}
      >
        <label>
          Email
          <input
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            style={{ display: 'block', margin: '0.5rem 0 1rem' }}
          />
        </label>
        <button type="submit">Place order</button>
      </form>
    </main>
  )
}
