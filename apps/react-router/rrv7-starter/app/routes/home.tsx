import { useState, useEffect } from 'react'
import { Link } from 'react-router'
import type { Route } from './+types/home'
import { generateMeta } from '@/lib/utils/meta'
import { SITE_URL } from '@/lib/constants'
import { getFollowers, getPosts, getFollowing } from '@/lib/utils/localStorage'

export const meta: Route.MetaFunction = () => {
  const siteUrl = SITE_URL || 'https://clouthub.fake'
  return generateMeta({
    title: 'CloutHub - The Fake Influencer Social Network',
    description: 'Get fake followers, fake engagement, and fake clout. Everything is fake, but it looks real!',
    url: siteUrl,
    siteName: 'CloutHub',
    image: { url: `${siteUrl}/opengraph-image.png`, width: 1200, height: 630, type: 'image/png' },
  })
}

export default function Home() {
  const [followers, setFollowers] = useState(124789)
  const [posts, setPosts] = useState(1337)
  const [following, setFollowing] = useState(42)

  useEffect(() => {
    setFollowers(getFollowers())
    setPosts(getPosts())
    setFollowing(getFollowing())
  }, [])

  return (
    <div className="min-h-screen bg-background pt-header">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center mb-16">
          <h1 className="text-6xl md:text-8xl font-bold text-primary mb-6">
            CloutHub
          </h1>
          <p className="text-2xl md:text-3xl text-primary/70 mb-4">
            The Fake Influencer Social Network
          </p>
          <p className="text-lg text-primary/50 max-w-2xl mx-auto mb-8">
            Get fake followers, fake engagement, and fake clout. 
            Everything is 100% fake, but it looks totally real! ✨
            <br />
            <span className="text-sm text-accent">(Data saved to localStorage)</span>
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              to="/feed"
              className="bg-accent text-primary font-bold px-8 py-4 rounded-lg text-lg hover:opacity-80 transition"
            >
              View Feed
            </Link>
            <Link
              to="/buy-followers"
              className="bg-primary/10 text-primary border-2 border-primary font-bold px-8 py-4 rounded-lg text-lg hover:bg-primary/20 transition"
            >
              Buy Fake Followers
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 text-center">
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="text-xl font-bold text-primary mb-2">Fake Followers</h3>
            <p className="text-primary/70">
              Get thousands of fake bot followers instantly. They're 100% fake, but who cares?
            </p>
          </div>
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 text-center">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-bold text-primary mb-2">Fake Analytics</h3>
            <p className="text-primary/70">
              Beautiful charts showing your fake engagement. All numbers are made up!
            </p>
          </div>
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 text-center">
            <div className="text-4xl mb-4">💎</div>
            <h3 className="text-xl font-bold text-primary mb-2">Fake Verification</h3>
            <p className="text-primary/70">
              Get a fake blue checkmark. It's just as real as your fake followers!
            </p>
          </div>
        </div>

        {/* Stats Preview */}
        <div className="bg-primary/5 border border-primary/20 rounded-lg p-8 mb-16">
          <h2 className="text-3xl font-bold text-primary text-center mb-8">
            Your Fake Stats (Preview)
          </h2>
          <div className="grid grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-4xl font-bold text-accent mb-2">
                {followers.toLocaleString()}
              </div>
              <div className="text-primary/50">Fake Followers</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-accent mb-2">
                {posts.toLocaleString()}
              </div>
              <div className="text-primary/50">Fake Posts</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-accent mb-2">
                {following.toLocaleString()}
              </div>
              <div className="text-primary/50">Following</div>
            </div>
          </div>
        </div>

        {/* Warning */}
        <div className="bg-red-500/10 border-2 border-red-500/50 rounded-lg p-6 max-w-3xl mx-auto">
          <div className="flex items-start gap-4">
            <span className="text-3xl">⚠️</span>
            <div>
              <h3 className="text-xl font-bold text-primary mb-2">Important Disclaimer</h3>
              <p className="text-primary/70 mb-2">
                This is a satirical fake app built for entertainment purposes. 
                Everything is fake - followers, engagement, analytics, everything.
              </p>
              <p className="text-primary/50 text-sm">
                Please don't try to buy fake followers in real life. 
                This app is a joke. A funny joke. But still a joke.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
