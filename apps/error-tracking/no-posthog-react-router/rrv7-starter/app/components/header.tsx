import { useState, useEffect } from 'react'
import { Link } from 'react-router'
import { fakeUser } from '@/lib/data/fake-data'
import { getFollowers } from '@/lib/utils/localStorage'

export const Header = () => {
  const [followers, setFollowers] = useState(fakeUser.followers)

  useEffect(() => {
    setFollowers(getFollowers())
    // Update when storage changes (for cross-tab sync)
    const handleStorageChange = () => {
      setFollowers(getFollowers())
    }
    window.addEventListener('storage', handleStorageChange)
    // Also check periodically for same-tab updates
    const interval = setInterval(() => {
      setFollowers(getFollowers())
    }, 1000)
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(interval)
    }
  }, [])

  return (
    <header className="fixed top-0 z-50 w-full items-center justify-between grid grid-cols-3 p-2 px-4 md:py-4 h-header bg-background/80 backdrop-blur-sm border-b border-primary/10">
      <div className="gap-3 contents">
        <Link key="logo" to="/" className="max-w-max justify-self-start">
          <span className="text-2xl font-bold text-accent">CloutHub</span>
        </Link>
        <nav className="flex items-center justify-center md:justify-self-center">
          <ul className="flex items-center gap-3 md:gap-6 font-mono uppercase text-sm">
            <li>
              <Link to="/" className="hover:text-accent transition">Home</Link>
            </li>
            <li>
              <Link to="/feed" className="hover:text-accent transition">Feed</Link>
            </li>
            <li>
              <Link to="/profile" className="hover:text-accent transition">Profile</Link>
            </li>
            <li>
              <Link to="/analytics" className="hover:text-accent transition">Analytics</Link>
            </li>
          </ul>
        </nav>
      </div>

      <div className="flex items-center gap-4 justify-self-end">
        <div className="hidden md:flex items-center gap-2 text-sm text-primary/70">
          <span className="text-accent font-bold">{followers.toLocaleString()}</span>
          <span>followers</span>
        </div>
        <Link
          to="/buy-followers"
          className="bg-accent text-primary font-bold px-4 py-2 rounded-lg text-sm hover:opacity-80 transition"
        >
          Buy Followers
        </Link>
        <Link to="/profile" className="flex items-center gap-2">
          <img
            src={fakeUser.avatar}
            alt={fakeUser.username}
            className="w-8 h-8 rounded-full border-2 border-accent"
          />
        </Link>
      </div>
    </header>
  )
}
