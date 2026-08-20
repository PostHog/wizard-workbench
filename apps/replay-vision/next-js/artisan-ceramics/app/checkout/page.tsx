'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

const DECLINED_CARD = '0000 0000 0000 0000'

export default function CheckoutPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [card, setCard] = useState('')
  const [declined, setDeclined] = useState(false)
  return (
    <main>
      <h1>Checkout</h1>
      {declined ? <p role="alert">Payment declined. Try a different card.</p> : null}
      <form
        onSubmit={(event) => {
          event.preventDefault()
          if (card === DECLINED_CARD) {
            setDeclined(true)
            return
          }
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
        <label>
          Card number
          <input
            required
            value={card}
            onChange={(event) => setCard(event.target.value)}
            placeholder="0000 0000 0000 0000"
            style={{ display: 'block', margin: '0.5rem 0 1rem' }}
          />
        </label>
        <button type="submit">Place order</button>
      </form>
    </main>
  )
}
