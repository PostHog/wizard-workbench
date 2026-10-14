import posthog from '@/lib/posthog.client'

export const posthogLog = {
  followerPackageSelected: (followerCount: number, packagePrice: number) => {
    posthog?.logger.info('follower package selected', {
      event: 'follower_package_selected',
      follower_count: followerCount,
      package_price: packagePrice,
    })
  },
  followersPurchaseCompleted: (followerCount: number, packagePrice: number) => {
    posthog?.logger.info('followers purchase completed', {
      event: 'followers_purchase_completed',
      follower_count: followerCount,
      package_price: packagePrice,
    })
  },
}
