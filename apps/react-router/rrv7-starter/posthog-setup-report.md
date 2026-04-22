<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into CloutHub, a React Router v7 (framework mode) application. The integration covers client-side event tracking, server-side middleware, error boundary exception capture, and environment variable configuration.

## Changes made

### New files
- **`app/entry.client.tsx`** — Initializes the PostHog SDK (`posthog-js`) and wraps the app with `PostHogProvider` so all components can access PostHog via the `usePostHog` hook.
- **`app/lib/posthog-middleware.ts`** — Server-side PostHog middleware that creates a `posthog-node` client per request, extracts `X-POSTHOG-SESSION-ID` and `X-POSTHOG-DISTINCT-ID` tracing headers, and shuts down cleanly after each request.

### Modified files
- **`app/root.tsx`** — Added `middleware` export to register the PostHog server middleware, and added `posthog.captureException(error)` to the `ErrorBoundary` for automatic error tracking.
- **`vite.config.ts`** — Added `posthog-js` and `@posthog/react` to SSR `noExternal` list to prevent SSR build issues.
- **`react-router.config.ts`** — Added `future.v8_middleware: true` to enable the React Router v8 middleware API.
- **`env.d.ts`** — Added TypeScript types for `VITE_PUBLIC_POSTHOG_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST`.
- **`.env`** — Set `VITE_PUBLIC_POSTHOG_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` with project values.

### Packages installed
- `posthog-js` — Client-side analytics SDK
- `@posthog/react` — React hooks and provider for PostHog
- `posthog-node` — Server-side Node.js SDK for middleware event capture

## Event tracking

| Event | Description | File |
|---|---|---|
| `view_feed_cta_clicked` | User clicks the "View Feed" CTA button on the home page | `app/routes/home.tsx` |
| `buy_followers_cta_clicked` | User clicks the "Buy Fake Followers" CTA button on the home page | `app/routes/home.tsx` |
| `followers_package_selected` | User selects a follower package (with package amount, bonus, price) | `app/routes/buy-followers.tsx` |
| `followers_purchased` | User completes a fake follower purchase (with total followers, price) | `app/routes/buy-followers.tsx` |
| `post_liked` | User likes a post in the feed (with post_id, post_username) | `app/components/PostCard.tsx` |
| `post_unliked` | User unlikes a previously liked post (with post_id, post_username) | `app/components/PostCard.tsx` |
| `follow_back_clicked` | User clicks "Follow back" on a fake follower (with follower_username) | `app/routes/profile.tsx` |
| `buy_followers_nav_clicked` | User clicks "Buy Followers" in the site header | `app/components/header.tsx` |

## Next steps

We recommend building the following insights in PostHog to monitor user behavior:

1. **Purchase conversion funnel** — Track the path from `buy_followers_cta_clicked` or `buy_followers_nav_clicked` → `followers_package_selected` → `followers_purchased` to understand drop-off in your purchase flow.

2. **Package popularity** — Use a breakdown of `followers_package_selected` by `package_amount` to see which package tiers are most selected.

3. **Post engagement** — Trend of `post_liked` events over time to measure feed engagement.

4. **CTA effectiveness** — Compare `view_feed_cta_clicked` vs `buy_followers_cta_clicked` to understand which hero CTA drives more conversions.

5. **Follow-back rate** — Count of `follow_back_clicked` events per session to measure profile engagement.

You can create these insights and a dashboard directly in your PostHog project:
- **PostHog project**: https://us.posthog.com/project/2/insights

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-react-react-router-7-framework/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
