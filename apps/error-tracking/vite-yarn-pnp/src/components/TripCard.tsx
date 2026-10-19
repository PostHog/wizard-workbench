import type { Trip } from '../data/trips'
import { Forecast } from './Forecast'

export function TripCard({ trip, onRemove }: { trip: Trip; onRemove: (id: string) => void }) {
  return (
    <div className="trip">
      <div>
        <strong>{trip.name}</strong>
        <div>
          {trip.distanceKm} km · {trip.elevationM} m gain
        </div>
        <Forecast stationId={trip.stationId} />
      </div>
      <button type="button" onClick={() => onRemove(trip.id)}>
        Remove
      </button>
    </div>
  )
}
