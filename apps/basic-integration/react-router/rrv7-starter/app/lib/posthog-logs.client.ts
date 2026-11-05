import posthog from './posthog.client'

interface FollowerPackageLogAttributes {
  [key: string]: number
  base_follower_count: number
  bonus_follower_count: number
  total_follower_count: number
  package_price: number
}

export const posthogLog = {
  followerPackageSelected: (attributes: FollowerPackageLogAttributes) => {
    posthog?.logger.info('follower_package_selected', attributes)
  },
  followersPurchased: (attributes: FollowerPackageLogAttributes) => {
    posthog?.logger.info('followers_purchased', attributes)
  },
}
