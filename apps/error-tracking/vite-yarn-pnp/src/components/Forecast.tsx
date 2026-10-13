import { useState } from 'react'

type Reading = { tempC: number; windKph: number }

const readings: Record<string, string> = {
  KSFO: '17.5|22',
  KMCE: '29.1|8',
}

function parseReading(stationId: string): Reading {
  const raw = readings[stationId]
  const [temp, wind] = raw.split('|')
  return { tempC: Number(temp), windKph: Number(wind) }
}

export function Forecast({ stationId }: { stationId: string }) {
  const [reading, setReading] = useState<Reading | null>(null)

  return (
    <span className="forecast">
      {reading ? `${reading.tempC}°C, wind ${reading.windKph} km/h ` : null}
      <button type="button" onClick={() => setReading(parseReading(stationId))}>
        Refresh forecast
      </button>
    </span>
  )
}
