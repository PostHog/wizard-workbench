<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the CloutHub React Router v7 (Framework mode) application.

## Changes made

- **`app/entry.client.tsx`** *(created)*: Initializes `posthog-js` and wraps `HydratedRouter` in `PostHogProvider`. Enables cross-origin tracing headers for client-server event correlation.
- **`app/lib/posthog-middleware.ts`** *(created)*: Server-side PostHog middleware that creates a `posthog-node` client per request, extracts session and distinct IDs from request headers, and attaches the PostHog client to the request context.
- **`app/root.tsx`** *(edited)*: Added `middleware` export to register the PostHog middleware, added error tracking via `posthog.captureException(error)` in the `ErrorBoundary`.
- **`app/routes/buy-followers.tsx`** *(edited)*: Tracks `follower_package_selected` when a user picks a package, and `followers_purchased` upon completing a fake purchase.
- **`app/components/PostCard.tsx`** *(edited)*: Tracks `post_liked` whenever a user likes or unlikes a post in the feed.
- **`app/routes/profile.tsx`** *(edited)*: Tracks `follower_followed_back` when a user follows back a fake bot follower.
- **`react-router.config.ts`** *(edited)*: Added `future.v8_middleware: true` to enable the React Router v7 middleware feature.
- **`vite.config.ts`** *(edited)*: Added `posthog-js` and `@posthog/react` to SSR `noExternal` list for dev mode compatibility.

## Events instrumented

| Event | Description | File |
|-------|-------------|------|
| `follower_package_selected` | User selects a follower package to purchase | `app/routes/buy-followers.tsx` |
| `followers_purchased` | User completes a fake follower purchase (main conversion event) | `app/routes/buy-followers.tsx` |
| `post_liked` | User likes or unlikes a post in the feed | `app/components/PostCard.tsx` |
| `follower_followed_back` | User follows back a fake follower on their profile | `app/routes/profile.tsx` |

## Next steps

We've prepared insights for an "Analytics basics" dashboard to monitor user behavior. Create it in PostHog with these recommended insights:

1. **Purchase Funnel** — Funnel from `follower_package_selected` → `followers_purchased` to measure conversion rate
2. **Total Followers Purchased** — Total count of `followers_purchased` events over time
3. **Average Package Price** — Average of the `price` property on `followers_purchased` events
4. **Post Engagement** — Total count of `post_liked` events where `liked = true`
5. **Follow-back Rate** — Count of `follower_followed_back` events over time

Visit [PostHog Project 2](https://us.posthog.com/project/2) to create these insights on your dashboard.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
