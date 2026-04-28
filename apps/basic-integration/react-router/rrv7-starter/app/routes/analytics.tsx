import { useState, useEffect } from 'react'
import { StatCard } from '@/components/StatCard'
import { fakeMetrics } from '@/lib/data/fake-data'
import type { Route } from './+types/analytics'
import { generateMeta } from '@/lib/utils/meta'
import { SITE_URL } from '@/lib/constants'
import { getFollowers, getPurchasedFollowers } from '@/lib/utils/localStorage'
import type { FakeMetric } from '@/lib/data/fake-data'

export const meta: Route.MetaFunction = () => {
  const siteUrl = SITE_URL || 'https://clouthub.fake'
  return generateMeta({
    title: 'Analytics - CloutHub',
    description: 'Your fake analytics dashboard with fake metrics',
    url: `${siteUrl}/analytics`,
    siteName: 'CloutHub',
    image: { url: `${siteUrl}/opengraph-image.png`, width: 1200, height: 630, type: 'image/png' },
  })
}

export default function Analytics() {
  const [metrics, setMetrics] = useState<FakeMetric[]>(fakeMetrics)
  const [followers, setFollowers] = useState(0)
  const [purchasedFollowers, setPurchasedFollowers] = useState(0)

  useEffect(() => {
    const currentFollowers = getFollowers()
    const purchased = getPurchasedFollowers()
    setFollowers(currentFollowers)
    setPurchasedFollowers(purchased)

    // Update metrics with real localStorage data
    setMetrics((prev) => {
      const updated = [...prev]
      const followersIndex = updated.findIndex((m) => m.label === 'Fake Followers')
      if (followersIndex !== -1) {
        updated[followersIndex] = {
          ...updated[followersIndex],
          value: currentFollowers,
        }
      }
      return updated
    })
  }, [])

  return (
    <div className="min-h-screen bg-background pt-header pb-8">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-primary mb-2">Analytics Dashboard</h1>
          <p className="text-primary/50">
            All your metrics are fake, but they look real! 📊
          </p>
          {purchasedFollowers > 0 && (
            <p className="text-accent mt-2">
              You've purchased {purchasedFollowers.toLocaleString()} fake followers! (Saved in localStorage)
            </p>
          )}
        </div>

        <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">⚠️</span>
            <div>
              <h2 className="text-xl font-bold text-primary">Disclaimer</h2>
              <p className="text-primary/70 text-sm">
                All metrics shown are completely fake and generated randomly. 
                Any resemblance to real engagement is purely coincidental.
                (But your follower count is saved in localStorage!)
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {metrics.map((metric, index) => (
            <StatCard key={index} metric={metric} />
          ))}
        </div>

        <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-primary mb-4">📈 Engagement Chart (Fake)</h2>
          <div className="bg-background border border-primary/10 rounded-lg p-8 h-64 flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">📊</div>
              <p className="text-primary/50">
                This chart would show your fake engagement over time
              </p>
              <p className="text-primary/30 text-sm mt-2">
                (If we had time to build it, which we don't, because it's fake)
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

