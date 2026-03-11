<wizard-report>
# PostHog post-wizard report

The wizard has completed a full PostHog integration for the CloutHub React Router v7 (Framework mode) application. The following changes were made:

- **`app/entry.client.tsx`** (new file): Initializes the PostHog JS SDK with `VITE_PUBLIC_POSTHOG_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` environment variables. Wraps the hydrated React app in `<PostHogProvider>` to make PostHog accessible via React hooks throughout the app. Enables tracing headers (`__add_tracing_headers`) to correlate client and server-side events by session/distinct ID.

- **`app/lib/posthog-middleware.ts`** (new file): Server-side PostHog middleware using `posthog-node`. Creates a PostHog Node client per request, extracts `X-POSTHOG-SESSION-ID` and `X-POSTHOG-DISTINCT-ID` headers from the client, and uses `withContext()` to associate all server-side events with the correct user session.

- **`app/root.tsx`**: Added `middleware` export to register the PostHog server-side middleware on every route. Added `captureException` call in the `ErrorBoundary` component to automatically send unhandled React errors to PostHog error tracking.

- **`react-router.config.ts`**: Added `future.v8_middleware: true` flag to enable React Router v8 middleware support (required for the PostHog server middleware).

- **`vite.config.ts`**: Added `posthog-js` and `@posthog/react` to `ssr.noExternal` to prevent SSR bundling errors.

- **`.env`**: Created with `VITE_PUBLIC_POSTHOG_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` environment variables.

- **`app/routes/buy-followers.tsx`**: Added `follower_package_selected` event (fires when a user clicks on a package card, with package details) and `follower_package_purchased` event (fires when the purchase completes, with package amount, bonus, total followers, and price).

- **`app/components/PostCard.tsx`**: Added `post_liked` event (fires on like/unlike, with post ID, username, and liked state).

- **`app/routes/profile.tsx`**: Added `follower_followed_back` event (fires when user clicks "Follow back" on a follower, with the follower's username).

- **`app/routes/feed.tsx`**: Added `feed_viewed` event (fires when the feed page mounts, with post count — marks the top of the content engagement funnel).

- **`app/routes/analytics.tsx`**: Added `analytics_dashboard_viewed` event (fires when analytics page mounts, with current follower count and purchased follower count).

| Event | Description | File |
|-------|-------------|------|
| `feed_viewed` | User views the feed page — top of content engagement funnel | `app/routes/feed.tsx` |
| `post_liked` | User likes or unlikes a post in the feed | `app/components/PostCard.tsx` |
| `follower_package_selected` | User selects a follower package on the buy page | `app/routes/buy-followers.tsx` |
| `follower_package_purchased` | User completes a fake follower purchase | `app/routes/buy-followers.tsx` |
| `follower_followed_back` | User clicks Follow back on a follower in their profile | `app/routes/profile.tsx` |
| `analytics_dashboard_viewed` | User views the analytics dashboard page | `app/routes/analytics.tsx` |

## Next steps

To get the most out of these events, create an **"Analytics basics"** dashboard in PostHog with the following insights:

1. **Follower purchase conversion funnel** — Steps: `feed_viewed` → `follower_package_selected` → `follower_package_purchased`. Reveals where users drop off in the purchase flow.

2. **Follower packages purchased over time** — Trend of `follower_package_purchased` broken down by `package_index` or `price`. Shows which packages are most popular.

3. **Post engagement rate** — Count of `post_liked` events relative to `feed_viewed` events. Indicates how engaging the feed content is.

4. **Analytics dashboard adoption** — Trend of `analytics_dashboard_viewed` vs `feed_viewed`. Shows what percentage of users explore their analytics.

5. **Follow-back engagement** — Trend of `follower_followed_back`. Indicates retention signal — users following back are more invested.

Create these in PostHog at: https://us.posthog.com/project/2/insights/new

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-react-react-router-7-framework/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
