import { useState } from 'react'
import { usePostHog } from 'posthog-js/react'
import { AddTripForm } from './components/AddTripForm'
import { TripCard } from './components/TripCard'
import { initialTrips, type Trip } from './data/trips'

function App() {
  const posthog = usePostHog()
  const [trips, setTrips] = useState<Trip[]>(initialTrips)

  function addTrip(trip: Trip) {
    setTrips((current) => [...current, trip])
    posthog.capture('trip_added', { distance_km: trip.distanceKm })
  }

  function removeTrip(id: string) {
    setTrips((current) => current.filter((trip) => trip.id !== id))
  }

  return (
    <main>
      <h1>Trailhead</h1>
      <p>Plan your next hikes and check conditions before you go.</p>
      <AddTripForm onAdd={addTrip} />
      {trips.map((trip) => (
        <TripCard key={trip.id} trip={trip} onRemove={removeTrip} />
      ))}
    </main>
  )
}

export default App
