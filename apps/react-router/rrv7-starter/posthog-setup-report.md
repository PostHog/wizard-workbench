<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this React Router v7 (Framework mode) application — "CloutHub", a satirical fake influencer social network.

## Changes made

### New files created

- **`app/entry.client.tsx`** — Client entry point that initializes PostHog (`posthog-js`) with `PostHogProvider` wrapping `HydratedRouter`. Enables automatic pageview tracking, session replay, and cross-request header tracing (`__add_tracing_headers`).
- **`app/lib/posthog-middleware.ts`** — Server-side React Router middleware using `posthog-node`. Creates a PostHog client per request, extracts `X-POSTHOG-SESSION-ID` and `X-POSTHOG-DISTINCT-ID` headers sent automatically by the client SDK, and stores the client on the request context for use in route handlers.

### Modified files

- **`react-router.config.ts`** — Added `future.v8_middleware: true` to enable React Router v7 middleware support.
- **`vite.config.ts`** — Added `posthog-js` and `@posthog/react` to `noExternal` in dev mode for SSR compatibility.
- **`app/root.tsx`** — Added `middleware` export using `posthogMiddleware`, and `captureException` in the `ErrorBoundary` component to capture unhandled React Router errors.
- **`app/routes/buy-followers.tsx`** — Added `followers_package_selected` (on package click) and `followers_purchased` (on purchase completion) events.
- **`app/components/PostCard.tsx`** — Added `post_liked` and `post_unliked` events in the like toggle handler.
- **`app/routes/profile.tsx`** — Added `user_followed` event when a user follows back a follower.
- **`app/routes/feed.tsx`** — Added `feed_viewed` event on mount (top of conversion funnel).
- **`app/routes/analytics.tsx`** — Added `analytics_viewed` event on mount.

### Environment variables

Set in `.env`:
- `VITE_PUBLIC_POSTHOG_KEY` — PostHog project API key
- `VITE_PUBLIC_POSTHOG_HOST` — PostHog host (`https://us.i.posthog.com`)

### Packages installed

- `posthog-js` — Client-side analytics SDK
- `@posthog/react` — React hooks and `PostHogProvider`
- `posthog-node` — Server-side analytics SDK

## Events instrumented

| Event | Description | File |
|-------|-------------|------|
| `followers_package_selected` | User selects a fake follower package on the buy-followers page | `app/routes/buy-followers.tsx` |
| `followers_purchased` | User completes a fake follower purchase (conversion event) | `app/routes/buy-followers.tsx` |
| `post_liked` | User likes a post in the feed | `app/components/PostCard.tsx` |
| `post_unliked` | User unlikes a post in the feed | `app/components/PostCard.tsx` |
| `user_followed` | User clicks follow back on a follower in the profile page | `app/routes/profile.tsx` |
| `feed_viewed` | User views the feed page (top of conversion funnel) | `app/routes/feed.tsx` |
| `analytics_viewed` | User views the analytics dashboard page | `app/routes/analytics.tsx` |

## Next steps

We recommend building the following insights in PostHog to monitor user behavior:

1. **Purchase conversion funnel** — `feed_viewed` → `followers_package_selected` → `followers_purchased` — shows where users drop off in the buy-followers flow
2. **Follower purchase trend** — Total count of `followers_purchased` over time, with breakdown by `total_followers` property
3. **Feed engagement** — `post_liked` and `post_unliked` events over time — tracks content engagement
4. **Social graph growth** — `user_followed` events over time — shows viral/social growth signals
5. **Analytics page reach** — `analytics_viewed` count — shows how many users explore their stats

Create an "Analytics basics" dashboard in PostHog and add these insights:
[https://us.posthog.com/project/2/dashboard/new](https://us.posthog.com/project/2/dashboard/new)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-react-react-router-7-framework/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
