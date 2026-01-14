# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into your React Router v7 Framework project. The integration includes:

- **Client-side PostHog initialization** with `PostHogProvider` in `entry.client.tsx`
- **Server-side middleware** for request tracking and session correlation in `posthog-middleware.ts`
- **Error tracking** in the root `ErrorBoundary` component
- **Custom event tracking** across key user interactions throughout the application

## Environment Variables

The following environment variables have been configured in `.env`:

| Variable | Description |
|----------|-------------|
| `VITE_PUBLIC_POSTHOG_KEY` | Your PostHog project API key |
| `VITE_PUBLIC_POSTHOG_HOST` | PostHog host URL (https://us.i.posthog.com) |

## Events Implemented

| Event Name | Description | File |
|------------|-------------|------|
| `follower_package_selected` | User selected a follower package on the buy-followers page | `app/routes/buy-followers.tsx` |
| `follower_package_purchased` | User completed a fake follower package purchase (conversion event) | `app/routes/buy-followers.tsx` |
| `post_liked` | User liked a post in the feed | `app/components/PostCard.tsx` |
| `post_unliked` | User unliked a post in the feed | `app/components/PostCard.tsx` |
| `user_followed` | User followed another user from the profile page | `app/routes/profile.tsx` |
| `cta_clicked` | User clicked a call-to-action button on the home page | `app/routes/home.tsx` |
| `navigation_clicked` | User clicked a navigation link in the header | `app/components/header.tsx` |
| `buy_followers_header_clicked` | User clicked the Buy Followers button in the header | `app/components/header.tsx` |

## Files Modified/Created

| File | Type | Description |
|------|------|-------------|
| `app/entry.client.tsx` | Created | PostHog client initialization with PostHogProvider |
| `app/lib/posthog-middleware.ts` | Created | Server-side middleware for session/user tracking |
| `app/root.tsx` | Modified | Added middleware export and error tracking |
| `react-router.config.ts` | Modified | Enabled v8_middleware future flag |
| `app/routes/buy-followers.tsx` | Modified | Added purchase funnel events |
| `app/components/PostCard.tsx` | Modified | Added like/unlike events |
| `app/routes/profile.tsx` | Modified | Added follow event |
| `app/routes/home.tsx` | Modified | Added CTA click events |
| `app/components/header.tsx` | Modified | Added navigation events |
| `.env` | Created | Environment variables for PostHog |

## Next Steps

### Recommended Dashboard Insights

Create a dashboard named "Analytics basics" in PostHog with the following insights:

1. **Purchase Funnel**: A funnel insight tracking:
   - `buy_followers_header_clicked` OR `cta_clicked` (where cta_name = 'buy_fake_followers')
   - `follower_package_selected`
   - `follower_package_purchased`

2. **Engagement Overview**: A trends insight showing:
   - `post_liked` events over time
   - `user_followed` events over time

3. **Navigation Patterns**: A trends insight showing:
   - `navigation_clicked` broken down by `nav_item` property

4. **CTA Performance**: A trends insight showing:
   - `cta_clicked` broken down by `cta_name` property

5. **Daily Active Users**: A trends insight showing unique users per day

### To Create These Insights

1. Go to your PostHog dashboard: https://us.i.posthog.com
2. Navigate to "Insights" and click "New insight"
3. Create each insight using the events listed above
4. Add them to a new dashboard named "Analytics basics"

## Automatic Features Enabled

PostHog will automatically capture:
- **Pageviews** (autocapture)
- **Session recordings** (if enabled in project settings)
- **Error tracking** via the ErrorBoundary component
