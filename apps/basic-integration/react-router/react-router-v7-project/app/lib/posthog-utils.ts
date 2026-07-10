import type { FakeUser } from '~/lib/utils/auth'

export function getPostHogPersonProperties(user: FakeUser) {
  return {
    email: user.email,
    username: user.username,
    total_points: user.totalPoints,
    claimed_countries_count: user.claimedCountries.length,
    liked_countries_count: user.likedCountries.length,
    visited_countries_count: user.visitedCountries.length,
    achievements_count: user.achievements.length,
    joined_date: user.joinedDate,
  }
}

export function getCountryActionProperties(user: FakeUser, countryName: string) {
  return {
    country_name: countryName,
    total_points: user.totalPoints,
    claimed_countries_count: user.claimedCountries.length,
    liked_countries_count: user.likedCountries.length,
    visited_countries_count: user.visitedCountries.length,
  }
}
