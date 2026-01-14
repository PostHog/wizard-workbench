# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into your CloutHub React Router 7 application. The integration includes:

- **Client-side initialization** via `app/entry.client.tsx` with PostHogProvider wrapping the entire application
- **Server-side middleware** via `app/lib/posthog-middleware.ts` for tracking server-side events with proper session/user context
- **Error tracking** in the root error boundary to capture unhandled errors
- **Event tracking** across key user interactions for conversion and engagement analytics

## Events Implemented

| Event Name | Description | File Path |
|------------|-------------|-----------|
| `follower_package_selected` | User selects a follower package on the buy followers page | `app/routes/buy-followers.tsx` |
| `follower_package_purchased` | User completes a fake follower purchase, capturing package details and total followers | `app/routes/buy-followers.tsx` |
| `post_liked` | User likes a post in the feed | `app/components/PostCard.tsx` |
| `post_unliked` | User unlikes a post in the feed | `app/components/PostCard.tsx` |
| `user_followed` | User follows another user from the profile page | `app/routes/profile.tsx` |
| `cta_clicked` | User clicks on a call-to-action button on the homepage (View Feed or Buy Fake Followers) | `app/routes/home.tsx` |
| `navigation_clicked` | User clicks on a navigation link in the header | `app/components/header.tsx` |
| `buy_followers_header_clicked` | User clicks the Buy Followers button in the header | `app/components/header.tsx` |
| `profile_avatar_clicked` | User clicks their profile avatar in the header | `app/components/header.tsx` |
| `error_displayed` | An error is displayed to the user via the error boundary (via `captureException`) | `app/root.tsx` |

## Configuration Files Created/Modified

| File | Purpose |
|------|---------|
| `.env` | PostHog API key and host environment variables |
| `app/entry.client.tsx` | PostHog client initialization with PostHogProvider |
| `app/lib/posthog-middleware.ts` | Server-side PostHog middleware for request context |
| `app/root.tsx` | Added middleware export and error tracking in ErrorBoundary |
| `react-router.config.ts` | Enabled v8_middleware future flag |
| `vite.config.ts` | Added PostHog packages to SSR noExternal list |

## Next steps

Once your application is deployed and collecting data, you can create the following insights and dashboards in PostHog:

### Recommended Insights

1. **Purchase Funnel** - Track the conversion from `follower_package_selected` to `follower_package_purchased`
2. **Engagement Overview** - Count of `post_liked` events over time
3. **Navigation Patterns** - Breakdown of `navigation_clicked` by destination
4. **CTA Performance** - Breakdown of `cta_clicked` events by `cta_name`
5. **User Retention** - Track `user_followed` events as a retention metric

### Creating Your Dashboard

1. Log in to [PostHog](https://us.i.posthog.com)
2. Navigate to **Dashboards** > **New Dashboard**
3. Name it "Analytics Basics" or "CloutHub Analytics"
4. Add insights using the events listed above

### Environment Variables

Make sure these environment variables are set in your deployment environment:

```
VITE_PUBLIC_POSTHOG_KEY=sTMFPsFhdP1Ssg
VITE_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

## Additional Resources

- [PostHog React Documentation](https://posthog.com/docs/libraries/react)
- [PostHog Session Replay](https://posthog.com/docs/session-replay)
- [PostHog Feature Flags](https://posthog.com/docs/feature-flags)
- [PostHog Experiments](https://posthog.com/docs/experiments)
