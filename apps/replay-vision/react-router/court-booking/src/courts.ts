export interface Court {
  id: string
  name: string
  surface: 'glass' | 'panoramic'
}

export const COURTS: Court[] = [
  { id: 'center', name: 'Center court', surface: 'panoramic' },
  { id: 'north', name: 'North court', surface: 'glass' },
  { id: 'south', name: 'South court', surface: 'glass' },
]
