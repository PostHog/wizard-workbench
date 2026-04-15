<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the CloutHub React Router v7 (framework mode) application.

## Summary of changes

- **`app/entry.client.tsx`** (new) — Initializes `posthog-js` with the project token and host from environment variables. Wraps the app in `PostHogProvider` so all components can access PostHog via `usePostHog()`. Adds `__add_tracing_headers` to correlate client-side and server-side events.
- **`app/lib/posthog-middleware.ts`** (new) — Server-side PostHog middleware using `posthog-node`. Creates a PostHog client per request, extracts `X-POSTHOG-SESSION-ID` / `X-POSTHOG-DISTINCT-ID` headers, and calls `withContext()` to associate server events with the correct user session.
- **`app/root.tsx`** — Added `usePostHog` error boundary for automatic exception capture (`posthog.captureException`). Registered `posthogMiddleware` as a root-level middleware.
- **`vite.config.ts`** — Added `posthog-js` and `@posthog/react` to the SSR `noExternal` list for dev mode compatibility.
- **`react-router.config.ts`** — Enabled `future.v8_middleware: true` to support React Router middleware.
- **`app/routes/feed.tsx`** — Wrapped page in `PostHogCaptureOnViewed` to fire `feed_viewed` when the feed enters the viewport.
- **`app/routes/buy-followers.tsx`** — Added `buy_followers_page_viewed` (viewport-based), `follower_package_selected` (on package click), and `fake_followers_purchased` (on purchase complete) events.
- **`app/routes/profile.tsx`** — Added `follow_back_clicked` event in the `FollowButton` handler.
- **`app/routes/analytics.tsx`** — Wrapped page in `PostHogCaptureOnViewed` to fire `analytics_dashboard_viewed`.
- **`app/components/PostCard.tsx`** — Added `post_liked` and `post_unliked` events in the like button handler.
- **`.env`** — Added `VITE_PUBLIC_POSTHOG_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` environment variables.

## Tracked events

| Event | Description | File |
|-------|-------------|------|
| `$element_viewed` (name: `feed_viewed`) | User views the fake social feed page — top of engagement funnel | `app/routes/feed.tsx` |
| `post_liked` | User likes a post in the feed | `app/components/PostCard.tsx` |
| `post_unliked` | User unlikes a post in the feed | `app/components/PostCard.tsx` |
| `$element_viewed` (name: `buy_followers_page_viewed`) | User views the buy fake followers page — top of purchase conversion funnel | `app/routes/buy-followers.tsx` |
| `follower_package_selected` | User selects a follower package on the buy-followers page | `app/routes/buy-followers.tsx` |
| `fake_followers_purchased` | User completes the fake follower purchase — key conversion event | `app/routes/buy-followers.tsx` |
| `follow_back_clicked` | User follows back a bot follower on the profile page | `app/routes/profile.tsx` |
| `$element_viewed` (name: `analytics_dashboard_viewed`) | User views the analytics dashboard page | `app/routes/analytics.tsx` |

## Next steps

We've set up an "Analytics basics" dashboard configuration for you to build in PostHog. Here are the recommended insights to create:

**1. Purchase conversion funnel** — Track drop-off from page view to purchase:
https://us.posthog.com/project/2/insights/new#funnel

Steps: `$element_viewed` (name=buy_followers_page_viewed) → `follower_package_selected` → `fake_followers_purchased`

**2. Post engagement trend** — Monitor `post_liked` and `post_unliked` volume over time:
https://us.posthog.com/project/2/insights/new#trends

**3. Feed to purchase conversion** — Compare `$element_viewed` (feed_viewed) vs `$element_viewed` (buy_followers_page_viewed) unique users:
https://us.posthog.com/project/2/insights/new#trends

**4. Follow-back engagement** — Track `follow_back_clicked` trend over time:
https://us.posthog.com/project/2/insights/new#trends

**5. Unique purchasers** — Count unique users firing `fake_followers_purchased`:
https://us.posthog.com/project/2/insights/new#trends

Visit your PostHog project to start building these:
https://us.posthog.com/project/2/dashboard

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
