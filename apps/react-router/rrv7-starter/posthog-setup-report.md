<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the CloutHub React Router v7 (Framework mode) project. The integration covers client-side event tracking, server-side middleware, error boundary capture, and PostHog provider initialization.

## Summary of changes

### New files created
- **`app/entry.client.tsx`** — Initializes the PostHog JS SDK with the `VITE_PUBLIC_POSTHOG_KEY` and `VITE_PUBLIC_POSTHOG_HOST` env vars, wraps the app in `PostHogProvider`, and enables cross-domain tracing headers (`__add_tracing_headers`) to correlate client and server events.
- **`app/lib/posthog-middleware.ts`** — Server-side middleware that creates a PostHog Node client per request, extracts `X-POSTHOG-SESSION-ID` and `X-POSTHOG-DISTINCT-ID` headers from the client, and calls `posthog.withContext()` to associate server events with the correct user session. Shuts down cleanly after each request.
- **`.env.local`** — Created with `VITE_PUBLIC_POSTHOG_KEY` and `VITE_PUBLIC_POSTHOG_HOST` environment variables. Automatically added to `.gitignore`.

### Modified files
- **`app/root.tsx`** — Added `middleware` export to register the PostHog server-side middleware on all routes. Added `usePostHog()` + `posthog?.captureException(error)` in the `ErrorBoundary` for automatic unhandled error tracking.
- **`react-router.config.ts`** — Enabled the `v8_middleware: true` future flag required for middleware support.
- **`vite.config.ts`** — Added `posthog-js` and `@posthog/react` to `ssr.noExternal` to prevent SSR module errors.
- **`app/routes/home.tsx`** — Added `view_feed_cta_clicked` and `buy_followers_cta_clicked` events on the hero section CTA buttons.
- **`app/routes/buy-followers.tsx`** — Added `follower_package_selected` event when a user picks a package, and `follower_package_purchased` event when a purchase completes (with package details as properties).
- **`app/components/PostCard.tsx`** — Added `post_liked` event in the like handler, capturing the post ID, author username, and like/unlike action.
- **`app/routes/profile.tsx`** — Added `follower_followed_back` event in the `FollowButton` component when a user follows back a bot follower.
- **`app/routes/analytics.tsx`** — Added `analytics_dashboard_viewed` event on mount, capturing current follower counts.

### Packages installed
- `posthog-js` — Client-side PostHog SDK
- `@posthog/react` — React hooks and `PostHogProvider` for PostHog JS
- `posthog-node` — Server-side PostHog Node SDK for middleware

## Events instrumented

| Event Name | Description | File |
|---|---|---|
| `view_feed_cta_clicked` | User clicks "View Feed" CTA on home page — top of feed funnel | `app/routes/home.tsx` |
| `buy_followers_cta_clicked` | User clicks "Buy Fake Followers" CTA on home page — top of purchase funnel | `app/routes/home.tsx` |
| `follower_package_selected` | User selects a follower package (properties: package_index, package_amount, package_bonus, total_followers, price) | `app/routes/buy-followers.tsx` |
| `follower_package_purchased` | User completes a fake follower purchase (properties: package_index, package_amount, package_bonus, total_followers, price) | `app/routes/buy-followers.tsx` |
| `post_liked` | User likes or unlikes a post in the feed (properties: post_id, post_username, action) | `app/components/PostCard.tsx` |
| `follower_followed_back` | User follows back one of their bot followers (properties: follower_username) | `app/routes/profile.tsx` |
| `analytics_dashboard_viewed` | User views the analytics dashboard — top of analytics engagement funnel (properties: current_followers, purchased_followers) | `app/routes/analytics.tsx` |

## Next steps

To explore your analytics data, create a dashboard in PostHog with these recommended insights:

1. **Follower Purchase Funnel** — `buy_followers_cta_clicked` → `follower_package_selected` → `follower_package_purchased`
2. **Follower Packages Purchased Over Time** — Daily trend of `follower_package_purchased`
3. **Feed Engagement** — Daily trend of `post_liked`
4. **Home Page CTA Clicks** — Combined trend of `view_feed_cta_clicked` and `buy_followers_cta_clicked`
5. **Analytics Dashboard Views** — Daily trend of `analytics_dashboard_viewed`

You can build these at [https://us.posthog.com/project/2/insights/new](https://us.posthog.com/project/2/insights/new).

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-react-react-router-7-framework/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
