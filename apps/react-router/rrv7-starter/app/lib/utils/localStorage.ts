// localStorage utilities for CloutHub fake data

const STORAGE_KEYS = {
  LIKED_POSTS: 'clouthub_liked_posts',
  FOLLOWERS: 'clouthub_followers',
  FOLLOWING: 'clouthub_following',
  POSTS: 'clouthub_posts',
  PURCHASED_FOLLOWERS: 'clouthub_purchased_followers',
} as const

export function getLikedPosts(): Set<string> {
  if (typeof window === 'undefined') return new Set()
  const stored = localStorage.getItem(STORAGE_KEYS.LIKED_POSTS)
  return stored ? new Set(JSON.parse(stored)) : new Set()
}

export function toggleLikedPost(postId: string): boolean {
  if (typeof window === 'undefined') return false
  const liked = getLikedPosts()
  const isLiked = liked.has(postId)
  
  if (isLiked) {
    liked.delete(postId)
  } else {
    liked.add(postId)
  }
  
  localStorage.setItem(STORAGE_KEYS.LIKED_POSTS, JSON.stringify(Array.from(liked)))
  return !isLiked
}

export function getFollowers(): number {
  if (typeof window === 'undefined') return 124789
  const stored = localStorage.getItem(STORAGE_KEYS.FOLLOWERS)
  return stored ? parseInt(stored, 10) : 124789
}

export function setFollowers(count: number): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEYS.FOLLOWERS, count.toString())
}

export function addFollowers(amount: number): number {
  const current = getFollowers()
  const newCount = current + amount
  setFollowers(newCount)
  return newCount
}

export function getPurchasedFollowers(): number {
  if (typeof window === 'undefined') return 0
  const stored = localStorage.getItem(STORAGE_KEYS.PURCHASED_FOLLOWERS)
  return stored ? parseInt(stored, 10) : 0
}

export function addPurchasedFollowers(amount: number): number {
  if (typeof window === 'undefined') return 0
  const current = getPurchasedFollowers()
  const newCount = current + amount
  localStorage.setItem(STORAGE_KEYS.PURCHASED_FOLLOWERS, newCount.toString())
  return newCount
}

export function getFollowing(): number {
  if (typeof window === 'undefined') return 42
  const stored = localStorage.getItem(STORAGE_KEYS.FOLLOWING)
  return stored ? parseInt(stored, 10) : 42
}

export function setFollowing(count: number): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEYS.FOLLOWING, count.toString())
}

export function getPosts(): number {
  if (typeof window === 'undefined') return 1337
  const stored = localStorage.getItem(STORAGE_KEYS.POSTS)
  return stored ? parseInt(stored, 10) : 1337
}

export function setPosts(count: number): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEYS.POSTS, count.toString())
}

