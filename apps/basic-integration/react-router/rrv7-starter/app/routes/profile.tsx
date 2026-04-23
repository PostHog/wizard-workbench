import { useState, useEffect } from 'react'
import { fakeUser } from '@/lib/data/fake-data'
import { fakeFollowers } from '@/lib/data/fake-data'
import type { Route } from './+types/profile'
import { generateMeta } from '@/lib/utils/meta'
import { SITE_URL } from '@/lib/constants'
import { getFollowers, getFollowing, getPosts, setFollowing } from '@/lib/utils/localStorage'
import cn from '@/lib/utils/cn'

function FollowButton({ username, onFollow }: { username: string; onFollow: () => void }) {
  const [isFollowing, setIsFollowing] = useState(false)

  const handleClick = () => {
    setIsFollowing(!isFollowing)
    if (!isFollowing) {
      onFollow()
    }
  }

  return (
    <button
      onClick={handleClick}
      className={cn(
        'px-4 py-2 rounded-lg font-bold transition',
        isFollowing
          ? 'bg-primary/10 text-primary border border-primary/20'
          : 'bg-accent text-primary hover:opacity-80'
      )}
    >
      {isFollowing ? 'Following' : 'Follow back'}
    </button>
  )
}

export const meta: Route.MetaFunction = () => {
  const siteUrl = SITE_URL || 'https://clouthub.fake'
  return generateMeta({
    title: 'Profile - CloutHub',
    description: 'Your fake influencer profile with fake stats',
    url: `${siteUrl}/profile`,
    siteName: 'CloutHub',
    image: { url: `${siteUrl}/opengraph-image.png`, width: 1200, height: 630, type: 'image/png' },
  })
}

export default function Profile() {
  const [followers, setFollowers] = useState(fakeUser.followers)
  const [following, setFollowing] = useState(fakeUser.following)
  const [posts, setPosts] = useState(fakeUser.posts)

  useEffect(() => {
    setFollowers(getFollowers())
    setFollowing(getFollowing())
    setPosts(getPosts())
  }, [])

  return (
    <div className="min-h-screen bg-background pt-header pb-8">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Profile Header */}
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <img
              src={fakeUser.avatar}
              alt={fakeUser.displayName}
              className="w-32 h-32 rounded-full border-4 border-accent"
            />
            <div className="flex-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                <h1 className="text-3xl font-bold text-primary">{fakeUser.displayName}</h1>
                {fakeUser.verified && (
                  <span className="text-accent text-2xl" title="Verified (Fake)">
                    ✓
                  </span>
                )}
              </div>
              <p className="text-primary/70 mb-4">{fakeUser.bio}</p>

              <div className="flex gap-6 justify-center md:justify-start mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {posts.toLocaleString()}
                  </div>
                  <div className="text-sm text-primary/50">posts</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {followers.toLocaleString()}
                  </div>
                  <div className="text-sm text-primary/50">followers (fake)</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">
                    {following.toLocaleString()}
                  </div>
                  <div className="text-sm text-primary/50">following</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Achievements */}
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 mb-6">
          <h2 className="text-2xl font-bold text-primary mb-4">🏆 Achievements (All Fake)</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {fakeUser.achievements.map((achievement, index) => (
              <div
                key={index}
                className="bg-background border border-primary/10 rounded-lg p-3 flex items-center gap-3"
              >
                <span className="text-2xl">{achievement.split(' ')[0]}</span>
                <span className="text-primary">{achievement.substring(achievement.indexOf(' ') + 1)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Followers */}
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-primary mb-4">Recent Followers (All Bots)</h2>
          <div className="space-y-3">
            {fakeFollowers.map((follower, index) => (
              <div
                key={index}
                className="flex items-center gap-3 bg-background border border-primary/10 rounded-lg p-3"
              >
                <img
                  src={follower.avatar}
                  alt={follower.username}
                  className="w-12 h-12 rounded-full"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-primary">{follower.username}</span>
                    {follower.verified && (
                      <span className="text-accent" title="Verified (Fake)">
                        ✓
                      </span>
                    )}
                  </div>
                  <span className="text-sm text-primary/50">Followed you 2 minutes ago</span>
                </div>
                <FollowButton 
                  username={follower.username}
                  onFollow={() => {
                    const newFollowing = getFollowing() + 1
                    setFollowing(newFollowing)
                  }}
                />
              </div>
            ))}
          </div>
          <p className="text-center text-primary/50 text-sm mt-4">
            (These are all fake bot accounts, but they count as followers!)
          </p>
        </div>
      </div>
    </div>
  )
}

