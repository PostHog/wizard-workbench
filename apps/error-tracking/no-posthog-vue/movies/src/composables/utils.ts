export function formatDate(string: string) {
  const date = new Date(string)
  return date.toLocaleDateString()
}

export function formatTime(minutes: number) {
  const seconds = minutes * 60
  let secondsLeft = seconds

  const hours = Math.floor(secondsLeft / 3600)
  secondsLeft = secondsLeft % 3600

  const mins = Math.floor(secondsLeft / 60)
  secondsLeft = secondsLeft % 60

  return `${hours ? `${hours}h ` : ''}${mins}min`
}

export function numberWithCommas(number: number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}

export function formatVote(number?: number): string {
  if (number === undefined) {
    number = 0
  }

  const formatter = new Intl.NumberFormat('en-GB', {
    notation: 'compact',
    maximumFractionDigits: 1,
  })

  return formatter.format(number)
}

export function getTrailer(item: any) {
  if (!item.videos?.results) return null
  const trailer = item.videos.results.find((v: any) => v.type === 'Trailer' && v.site === 'YouTube')
  return trailer ? `https://www.youtube.com/embed/${trailer.key}` : null
}
