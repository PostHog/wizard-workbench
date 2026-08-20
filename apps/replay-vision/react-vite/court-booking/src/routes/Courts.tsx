import { Link } from 'react-router-dom'

import { COURTS } from '../courts'

export function Courts() {
  return (
    <main>
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
