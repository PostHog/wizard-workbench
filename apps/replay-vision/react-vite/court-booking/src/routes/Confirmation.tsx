import { Link } from 'react-router-dom'

export function Confirmation() {
  return (
    <main>
      <h1>Booking confirmed</h1>
      <p>See you on court.</p>
      <Link to="/">Book another slot</Link>
    </main>
  )
}
