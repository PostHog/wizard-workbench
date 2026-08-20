import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'

import { COURTS } from '../courts'

export function BookCourt() {
  const { courtId } = useParams()
  const navigate = useNavigate()
  const [slot, setSlot] = useState('18:00')
  const court = COURTS.find((c) => c.id === courtId)
  if (!court) {
    return (
      <main>
        <p>Court not found.</p>
        <Link to="/">Back to courts</Link>
      </main>
    )
  }
  return (
    <main>
      <h1>Book {court.name}</h1>
      <form
        onSubmit={(event) => {
          event.preventDefault()
          navigate('/confirmation')
        }}
      >
        <label>
          Time slot
          <select value={slot} onChange={(event) => setSlot(event.target.value)}>
            <option>17:00</option>
            <option>18:00</option>
            <option>19:00</option>
          </select>
        </label>
        <button type="submit">Confirm booking</button>
      </form>
    </main>
  )
}
