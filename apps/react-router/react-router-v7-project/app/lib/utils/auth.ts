// Fake authentication utilities using localStorage
import { nanoid } from 'nanoid'
import posthog from 'posthog-js'

export interface FakeUser {
  id: string
  username: string
  email: string
  avatar: string
  joinedDate: string
  claimedCountries: string[]
  likedCountries: string[]
  visitedCountries: string[]
  totalPoints: number
  achievements: string[]
}

const STORAGE_KEY = 'fake_country_explorer_user'
const USERS_KEY = 'fake_country_explorer_users'

/** Generate a safe avatar URL from a username */
export function getAvatarUrl(username: string): string {
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(username)}`
}

export function getCurrentUser(): FakeUser | null {
  if (typeof window === 'undefined') return null
  const stored = localStorage.getItem(STORAGE_KEY)
  return stored ? JSON.parse(stored) : null
}

export function setCurrentUser(user: FakeUser | null): void {
  if (typeof window === 'undefined') return
  if (user) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
  } else {
    localStorage.removeItem(STORAGE_KEY)
  }
}

export function getAllUsers(): FakeUser[] {
  if (typeof window === 'undefined') return []
  const stored = localStorage.getItem(USERS_KEY)
  return stored ? JSON.parse(stored) : []
}

export function saveUser(user: FakeUser): void {
  if (typeof window === 'undefined') return
  const users = getAllUsers()
  const existingIndex = users.findIndex((u) => u.id === user.id)
  if (existingIndex >= 0) {
    users[existingIndex] = user
  } else {
    users.push(user)
  }
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export function fakeLogin(username: string, password: string): FakeUser | null {
  // Fake login - any password works!
  const users = getAllUsers()
  const user = users.find((u) => u.username === username)
  
  if (user) {
    setCurrentUser(user)
    return user
  }
  
  return null
}

export function fakeSignup(username: string, email: string, password: string): FakeUser {
  // Fake signup - creates a new user
  const avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(username)}`
  const newUser: FakeUser = {
    id: `user_${nanoid()}`,
    username,
    email,
    avatar,
    joinedDate: new Date().toISOString(),
    claimedCountries: [],
    likedCountries: [],
    visitedCountries: [],
    totalPoints: 0,
    achievements: [],
  }
  
  saveUser(newUser)
  setCurrentUser(newUser)
  return newUser
}

export function fakeLogout(): void {
  setCurrentUser(null)
}

export function claimCountry(countryName: string): void {
  const user = getCurrentUser()
  if (!user) return

  if (!user.claimedCountries.includes(countryName)) {
    const previousAchievementsCount = user.achievements.length
    user.claimedCountries.push(countryName)
    user.totalPoints += 100
    checkAchievements(user)
    saveUser(user)
    setCurrentUser(user)

    // Capture country claimed event
    posthog.capture('country_claimed', {
      country_name: countryName,
      total_claimed: user.claimedCountries.length,
      points_earned: 100,
    })

    // Check if any new achievements were unlocked
    if (user.achievements.length > previousAchievementsCount) {
      const newAchievements = user.achievements.slice(previousAchievementsCount)
      newAchievements.forEach(achievement => {
        posthog.capture('achievement_unlocked', {
          achievement_name: achievement,
          total_achievements: user.achievements.length,
        })
      })
    }
  }
}

export function likeCountry(countryName: string): void {
  const user = getCurrentUser()
  if (!user) return

  if (!user.likedCountries.includes(countryName)) {
    const previousAchievementsCount = user.achievements.length
    user.likedCountries.push(countryName)
    user.totalPoints += 10
    checkAchievements(user)
    saveUser(user)
    setCurrentUser(user)

    // Capture country liked event
    posthog.capture('country_liked', {
      country_name: countryName,
      total_liked: user.likedCountries.length,
      points_earned: 10,
    })

    // Check if any new achievements were unlocked
    if (user.achievements.length > previousAchievementsCount) {
      const newAchievements = user.achievements.slice(previousAchievementsCount)
      newAchievements.forEach(achievement => {
        posthog.capture('achievement_unlocked', {
          achievement_name: achievement,
          total_achievements: user.achievements.length,
        })
      })
    }
  }
}

export function visitCountry(countryName: string): void {
  const user = getCurrentUser()
  if (!user) return

  if (!user.visitedCountries.includes(countryName)) {
    const previousAchievementsCount = user.achievements.length
    user.visitedCountries.push(countryName)
    user.totalPoints += 50
    checkAchievements(user)
    saveUser(user)
    setCurrentUser(user)

    // Capture country visited event
    posthog.capture('country_visited', {
      country_name: countryName,
      total_visited: user.visitedCountries.length,
      points_earned: 50,
    })

    // Check if any new achievements were unlocked
    if (user.achievements.length > previousAchievementsCount) {
      const newAchievements = user.achievements.slice(previousAchievementsCount)
      newAchievements.forEach(achievement => {
        posthog.capture('achievement_unlocked', {
          achievement_name: achievement,
          total_achievements: user.achievements.length,
        })
      })
    }
  }
}

function checkAchievements(user: FakeUser): void {
  const achievements = [...user.achievements]
  
  if (user.claimedCountries.length >= 1 && !achievements.includes('🌍 First Claim')) {
    achievements.push('🌍 First Claim')
    user.totalPoints += 50
  }
  
  if (user.claimedCountries.length >= 10 && !achievements.includes('🏆 Country Collector')) {
    achievements.push('🏆 Country Collector')
    user.totalPoints += 200
  }
  
  if (user.claimedCountries.length >= 50 && !achievements.includes('👑 World Dominator')) {
    achievements.push('👑 World Dominator')
    user.totalPoints += 1000
  }
  
  if (user.visitedCountries.length >= 5 && !achievements.includes('✈️ Frequent Flyer')) {
    achievements.push('✈️ Frequent Flyer')
    user.totalPoints += 150
  }
  
  if (user.likedCountries.length >= 20 && !achievements.includes('❤️ Country Lover')) {
    achievements.push('❤️ Country Lover')
    user.totalPoints += 100
  }
  
  if (user.totalPoints >= 1000 && !achievements.includes('⭐ Point Master')) {
    achievements.push('⭐ Point Master')
  }
  
  user.achievements = achievements
}

