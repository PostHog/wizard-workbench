import { PostCard } from '@/components/PostCard'
import { fakePosts } from '@/lib/data/fake-data'
import type { Route } from './+types/feed'
import { generateMeta } from '@/lib/utils/meta'
import { SITE_URL } from '@/lib/constants'

export const meta: Route.MetaFunction = () => {
  const siteUrl = SITE_URL || 'https://clouthub.fake'
  return generateMeta({
    title: 'Feed - CloutHub',
    description: 'Your fake social media feed with fake engagement and fake posts',
    url: `${siteUrl}/feed`,
    siteName: 'CloutHub',
    image: { url: `${siteUrl}/opengraph-image.png`, width: 1200, height: 630, type: 'image/png' },
  })
}

export default function Feed() {
  return (
    <div className="min-h-screen bg-background pt-header pb-8">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-primary mb-2">Your Feed</h1>
          <p className="text-primary/50">
            All the fake content you never asked for, but definitely need
          </p>
        </div>

        <div className="space-y-4">
          {fakePosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>

        <div className="mt-8 text-center text-primary/50 text-sm">
          <p>✨ You've reached the end of fake content ✨</p>
          <p className="mt-2">(All engagement is 100% authentic and definitely not fake)</p>
        </div>
      </div>
    </div>
  )
}

