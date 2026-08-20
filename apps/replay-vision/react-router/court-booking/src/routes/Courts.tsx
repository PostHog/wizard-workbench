import { Link } from 'react-router-dom'

import { COURTS } from '../courts'

export function Courts() {
  return (
    <main style={{ fontFamily: 'system-ui', maxWidth: 640, margin: '2rem auto' }}>
      <h1>Book a padel court</h1>
      <ul>
        {COURTS.map((court) => (
          <li key={court.id}>
            {court.name} ({court.surface}) <Link to={`/book/${court.id}`}>Book</Link>
          </li>
        ))}
      </ul>
    </main>
  )
}
