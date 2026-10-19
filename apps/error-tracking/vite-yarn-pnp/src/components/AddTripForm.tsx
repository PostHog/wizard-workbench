import { useState, type FormEvent } from 'react'
import type { Trip } from '../data/trips'

export function AddTripForm({ onAdd }: { onAdd: (trip: Trip) => void }) {
  const [name, setName] = useState('')
  const [distance, setDistance] = useState('')

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (!name.trim()) return
    onAdd({
      id: crypto.randomUUID(),
      name: name.trim(),
      distanceKm: Number(distance) || 0,
      elevationM: 0,
      stationId: 'KSFO',
    })
    setName('')
    setDistance('')
  }

  return (
    <form onSubmit={handleSubmit}>
      <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Trail name" />
      <input
        value={distance}
        onChange={(e) => setDistance(e.target.value)}
        placeholder="km"
        inputMode="decimal"
      />
      <button type="submit">Add trip</button>
    </form>
  )
}
