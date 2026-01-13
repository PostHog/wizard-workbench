# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into your React Router v7 (Framework mode) project. The integration includes:

- **Client-side SDK initialization** via `entry.client.tsx` with PostHogProvider wrapping the app
- **Server-side middleware** via `posthog-middleware.ts` for correlating server and client events with session/user context
- **Error tracking** in the ErrorBoundary component for automatic exception capture
- **Event tracking** for key business actions including follower purchases, post interactions, and CTA clicks

## Environment Variables

PostHog is configured using the following environment variables in `.env`:

| Variable | Description |
|----------|-------------|
| `VITE_PUBLIC_POSTHOG_KEY` | Your PostHog project API key |
| `VITE_PUBLIC_POSTHOG_HOST` | PostHog API host URL |

## Events Implemented

| Event Name | Description | File |
|------------|-------------|------|
| `follower_package_selected` | User selects a follower package to purchase | `app/routes/buy-followers.tsx` |
| `follower_package_purchased` | User completes a follower package purchase (conversion event) | `app/routes/buy-followers.tsx` |
| `post_liked` | User likes a post in the feed | `app/components/PostCard.tsx` |
| `post_unliked` | User unlikes a previously liked post | `app/components/PostCard.tsx` |
| `user_followed` | User follows back another user from profile page | `app/routes/profile.tsx` |
| `cta_clicked` | User clicks a call-to-action button on home page | `app/routes/home.tsx` |
| `buy_followers_header_clicked` | User clicks Buy Followers button in header navigation | `app/components/header.tsx` |
| `error_occurred` | Application error captured by error boundary (via `captureException`) | `app/root.tsx` |

## Files Modified/Created

| File | Change Type | Description |
|------|-------------|-------------|
| `.env` | Created | PostHog environment variables |
| `app/entry.client.tsx` | Created | Client-side PostHog initialization with PostHogProvider |
| `app/lib/posthog-middleware.ts` | Created | Server-side middleware for session/user context |
| `react-router.config.ts` | Modified | Added `v8_middleware: true` future flag |
| `vite.config.ts` | Modified | Added PostHog packages to SSR noExternal |
| `app/root.tsx` | Modified | Added middleware export and error tracking |
| `app/routes/buy-followers.tsx` | Modified | Added package selection and purchase events |
| `app/components/PostCard.tsx` | Modified | Added like/unlike events |
| `app/routes/profile.tsx` | Modified | Added user follow events |
| `app/routes/home.tsx` | Modified | Added CTA click events |
| `app/components/header.tsx` | Modified | Added header CTA click event |

## Next Steps

### Recommended Dashboard: "Analytics basics"

Create a dashboard in PostHog with the following insights to track key business metrics:

1. **Follower Purchase Funnel** (Funnel)
   - Step 1: `cta_clicked` or `buy_followers_header_clicked` (funnel entry)
   - Step 2: `follower_package_selected` (consideration)
   - Step 3: `follower_package_purchased` (conversion)

2. **Engagement Overview** (Trends)
   - Track `post_liked`, `post_unliked`, and `user_followed` events over time

3. **Revenue by Package** (Trends with breakdown)
   - Event: `follower_package_purchased`
   - Breakdown by: `total_followers` or `price`

4. **CTA Click Performance** (Trends)
   - Event: `cta_clicked`
   - Breakdown by: `cta_name`

5. **Error Rate** (Trends)
   - Event: `$exception` (automatically captured by `captureException`)

### Create Dashboard

1. Go to your PostHog dashboard: https://us.i.posthog.com
2. Click "New Dashboard" and name it "Analytics basics"
3. Add insights using the events documented above

### Session Replay

Session replay is automatically enabled with the default settings. View recordings at:
- https://us.i.posthog.com/replay

### Useful Links

- [PostHog Dashboard](https://us.i.posthog.com)
- [PostHog Docs](https://posthog.com/docs)
- [React Integration Guide](https://posthog.com/docs/libraries/react)
