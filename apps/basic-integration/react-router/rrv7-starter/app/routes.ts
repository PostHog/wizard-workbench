import { type RouteConfig, index, route } from '@react-router/dev/routes'

export default [
  index('routes/home.tsx'),
  route('/feed', 'routes/feed.tsx'),
  route('/profile', 'routes/profile.tsx'),
  route('/analytics', 'routes/analytics.tsx'),
  route('/buy-followers', 'routes/buy-followers.tsx'),
] satisfies RouteConfig
