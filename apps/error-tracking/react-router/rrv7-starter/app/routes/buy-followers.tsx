import { useState } from 'react'
import { useNavigate } from 'react-router'
import { followerPackages } from '@/lib/data/fake-data'
import type { Route } from './+types/buy-followers'
import { generateMeta } from '@/lib/utils/meta'
import { SITE_URL } from '@/lib/constants'
import { addFollowers, addPurchasedFollowers } from '@/lib/utils/localStorage'
import cn from '@/lib/utils/cn'

export const meta: Route.MetaFunction = () => {
  const siteUrl = SITE_URL || 'https://clouthub.fake'
  return generateMeta({
    title: 'Buy Followers - CloutHub',
    description: 'Buy fake followers for your fake influencer account',
    url: `${siteUrl}/buy-followers`,
    siteName: 'CloutHub',
    image: { url: `${siteUrl}/opengraph-image.png`, width: 1200, height: 630, type: 'image/png' },
  })
}

export default function BuyFollowers() {
  const navigate = useNavigate()
  const [selectedPackage, setSelectedPackage] = useState<number | null>(null)
  const [purchased, setPurchased] = useState(false)

  const handlePurchase = () => {
    if (selectedPackage === null) return
    setPurchased(true)
    
    setTimeout(() => {
      const pkg = followerPackages[selectedPackage]
      const totalFollowers = pkg.amount + pkg.bonus
      
      // Save to localStorage
      addFollowers(totalFollowers)
      addPurchasedFollowers(totalFollowers)
      
      alert(`Purchase complete! You now have ${totalFollowers.toLocaleString()} more fake followers! (Saved to localStorage)`)
      setPurchased(false)
      setSelectedPackage(null)
      
      // Navigate to profile to see the updated count
      navigate('/profile')
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-background pt-header pb-8">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6 text-center">
          <h1 className="text-4xl font-bold text-primary mb-2">Buy Fake Followers</h1>
          <p className="text-primary/50">
            Get the fake clout you deserve! All followers are 100% fake bots.
          </p>
        </div>

        <div className="bg-red-500/10 border-2 border-red-500/50 rounded-lg p-6 mb-6">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🚨</span>
            <div>
              <h2 className="text-xl font-bold text-primary mb-1">Legal Disclaimer</h2>
              <p className="text-primary/70 text-sm">
                This is a fake app. You cannot actually buy followers here. 
                This is a satirical demonstration. Please don't try to buy fake followers in real life.
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {followerPackages.map((pkg, index) => {
            const isSelected = selectedPackage === index
            const totalFollowers = pkg.amount + pkg.bonus

            return (
              <div
                key={index}
                onClick={() => setSelectedPackage(index)}
                className={cn(
                  'bg-primary/5 border-2 rounded-lg p-6 cursor-pointer transition',
                  isSelected
                    ? 'border-accent bg-accent/10'
                    : 'border-primary/20 hover:border-primary/40'
                )}
              >
                <div className="text-center mb-4">
                  <div className="text-3xl font-bold text-primary mb-1">
                    {totalFollowers.toLocaleString()}
                  </div>
                  <div className="text-sm text-primary/50">Fake Followers</div>
                  {pkg.bonus > 0 && (
                    <div className="text-xs text-accent mt-1">
                      +{pkg.bonus.toLocaleString()} bonus!
                    </div>
                  )}
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-accent mb-2">
                    ${pkg.price.toFixed(2)}
                  </div>
                  <div className="text-xs text-primary/50">
                    ${(pkg.price / totalFollowers).toFixed(4)} per fake follower
                  </div>
                </div>
                {isSelected && (
                  <div className="mt-4 text-center text-accent font-bold">
                    ✓ Selected
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <div className="bg-primary/5 border border-primary/20 rounded-lg p-6">
          <h2 className="text-xl font-bold text-primary mb-4">What You Get:</h2>
          <ul className="space-y-2 text-primary/70">
            <li className="flex items-center gap-2">
              <span>✓</span>
              <span>100% fake bot accounts</span>
            </li>
            <li className="flex items-center gap-2">
              <span>✓</span>
              <span>Zero real engagement</span>
            </li>
            <li className="flex items-center gap-2">
              <span>✓</span>
              <span>Instant delivery (because they're fake)</span>
            </li>
            <li className="flex items-center gap-2">
              <span>✓</span>
              <span>No refunds (because this is fake)</span>
            </li>
            <li className="flex items-center gap-2">
              <span>✓</span>
              <span>Perfect for fake influencers</span>
            </li>
          </ul>

          <button
            onClick={handlePurchase}
            disabled={selectedPackage === null || purchased}
            className={cn(
              'w-full mt-6 bg-accent text-primary font-bold py-4 rounded-lg text-lg',
              'hover:opacity-80 transition disabled:opacity-50 disabled:cursor-not-allowed'
            )}
          >
            {purchased
              ? 'Processing... (Fake)'
              : selectedPackage === null
              ? 'Select a package first'
              : 'Buy Fake Followers (Fake Button)'}
          </button>

          <p className="text-center text-primary/30 text-xs mt-4">
            This button does nothing. It's all fake. Just like your future followers.
          </p>
        </div>
      </div>
    </div>
  )
}

