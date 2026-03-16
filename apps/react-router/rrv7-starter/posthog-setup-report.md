<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the CloutHub React Router v7 (Framework mode) application. The following changes were made:

- **`app/entry.client.tsx`** (new): PostHog client is initialized and the entire app is wrapped in `<PostHogProvider>`, enabling `usePostHog()` throughout the component tree. Session replay, autocapture, and tracing headers are all enabled.
- **`app/root.tsx`**: The `ErrorBoundary` component now calls `posthog?.captureException(error)` to automatically report all unhandled React Router errors to PostHog error tracking.
- **`app/routes/home.tsx`**: Fires `buy_followers_cta_clicked` when a user clicks the "Buy Fake Followers" CTA in the hero section.
- **`app/routes/buy-followers.tsx`**: Fires `package_selected` (with package details and price) when a user selects a follower package, and `followers_purchased` (with full purchase details) when the purchase is completed — the primary conversion event.
- **`app/components/PostCard.tsx`**: Fires `post_liked` when a user likes or unlikes a post in the feed.
- **`app/routes/profile.tsx`**: Fires `follower_followed_back` when a user follows back a bot follower.
- **`app/routes/analytics.tsx`**: Fires `analytics_dashboard_viewed` on mount, capturing the user's current follower and purchase counts.
- **`vite.config.ts`**: Added `posthog-js` and `@posthog/react` to `ssr.noExternal` for dev mode compatibility.
- **`env.d.ts`**: Added TypeScript types for `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST`.
- **`.env`**: PostHog token and host written via `wizard-tools` (never hardcoded in source).

| Event | Description | File |
|-------|-------------|------|
| `buy_followers_cta_clicked` | User clicks the "Buy Fake Followers" CTA on the home page (top of conversion funnel) | `app/routes/home.tsx` |
| `package_selected` | User selects a follower package on the buy-followers page | `app/routes/buy-followers.tsx` |
| `followers_purchased` | User completes a fake follower purchase (key conversion event) | `app/routes/buy-followers.tsx` |
| `post_liked` | User likes or unlikes a post in the feed | `app/components/PostCard.tsx` |
| `follower_followed_back` | User follows back a follower bot on the profile page | `app/routes/profile.tsx` |
| `analytics_dashboard_viewed` | User views the analytics dashboard | `app/routes/analytics.tsx` |

## Next steps

We recommend creating an **"Analytics basics"** dashboard in PostHog with the following insights to track key business metrics:

1. **Purchase Conversion Funnel** — Funnel from `buy_followers_cta_clicked` → `package_selected` → `followers_purchased`. Reveals where users drop off in the purchase flow.
   - [Create funnel insight](https://us.posthog.com/project/2/insights/new?insight=FUNNELS)

2. **Followers Purchased Over Time** — Trend of `followers_purchased` events grouped by day. Tracks monetization velocity.
   - [Create trend insight](https://us.posthog.com/project/2/insights/new?insight=TRENDS)

3. **Package Popularity** — Breakdown of `package_selected` by `package_index` or `total_followers` property. Shows which packages users prefer.
   - [Create breakdown insight](https://us.posthog.com/project/2/insights/new?insight=TRENDS)

4. **Feed Engagement Rate** — Count of `post_liked` events over time. Tracks content engagement.
   - [Create trend insight](https://us.posthog.com/project/2/insights/new?insight=TRENDS)

5. **Error Tracking** — Monitor uncaught exceptions captured by the error boundary.
   - [View error tracking](https://us.posthog.com/project/2/error_tracking)

Create a new dashboard at: https://us.posthog.com/project/2/dashboard/new

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
