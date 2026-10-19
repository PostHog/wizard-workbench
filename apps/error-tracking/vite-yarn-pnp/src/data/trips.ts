export type Trip = {
  id: string
  name: string
  distanceKm: number
  elevationM: number
  stationId: string
}

export const initialTrips: Trip[] = [
  { id: 't1', name: 'Mount Tam loop', distanceKm: 14.2, elevationM: 720, stationId: 'KSFO' },
  { id: 't2', name: 'Half Dome', distanceKm: 26.5, elevationM: 1460, stationId: 'KMCE' },
  { id: 't3', name: 'Lost Coast', distanceKm: 40.1, elevationM: 2100, stationId: 'unknown' },
]
