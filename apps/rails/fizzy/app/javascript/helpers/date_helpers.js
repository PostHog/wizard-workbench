export function differenceInDays(fromDate, toDate) {
  return Math.round(Math.abs((beginningOfDay(toDate) - beginningOfDay(fromDate)) / (1000 * 60 * 60 * 24)))
}

export function signedDifferenceInDays(fromDate, toDate) {
  return Math.round((beginningOfDay(toDate) - beginningOfDay(fromDate)) / (1000 * 60 * 60 * 24))
}

export function beginningOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

export function secondsToDate(seconds) {
  return new Date(seconds * 1000)
}
