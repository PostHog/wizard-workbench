import { Link } from 'react-router-dom'

export function Confirmation() {
  return (
    <main style={{ fontFamily: 'system-ui', maxWidth: 640, margin: '2rem auto' }}>
      <h1>Booking confirmed</h1>
      <p>See you on court.</p>
      <Link to="/">Book another slot</Link>
    </main>
  )
}
