<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the CloutHub React Router v7 (Framework mode) application.

## What was done

**Client-side SDK setup** (`app/entry.client.tsx`): Created a new entry client file that initializes the PostHog JS SDK with the `PostHogProvider`, enabling automatic pageview tracking, session replay, and access to the `usePostHog()` hook throughout the app. The `__add_tracing_headers` option is set to forward `X-POSTHOG-SESSION-ID` and `X-POSTHOG-DISTINCT-ID` headers to the server for session correlation.

**Server-side middleware** (`app/lib/posthog-middleware.ts`): Created a PostHog Node middleware that initializes a server-side PostHog client per request, extracts session/user context from request headers, and uses `withContext()` to associate server-side events with the correct user and session.

**Root configuration** (`app/root.tsx`): Registered the PostHog middleware for the entire application and added `captureException()` to the global `ErrorBoundary` so all unhandled React Router errors are tracked automatically.

**Vite/Router config**: Updated `vite.config.ts` to include `posthog-js` and `@posthog/react` in `noExternal` (dev mode), and updated `react-router.config.ts` to enable `v8_middleware: true` (required for middleware support).

**Event tracking**: Added `posthog.capture()` calls for 7 business-critical events across 5 files.

## Events instrumented

| Event Name | Description | File |
|---|---|---|
| `follower_package_selected` | User selects a follower package on the buy followers page | `app/routes/buy-followers.tsx` |
| `follower_purchase_completed` | User completes a fake follower purchase (conversion event) | `app/routes/buy-followers.tsx` |
| `post_liked` | User likes a post in the feed | `app/components/PostCard.tsx` |
| `post_unliked` | User unlikes a post in the feed | `app/components/PostCard.tsx` |
| `follower_followed_back` | User follows back a fake follower on the profile page | `app/routes/profile.tsx` |
| `feed_viewed` | User views the feed page (top of engagement funnel, server-side) | `app/routes/feed.tsx` |
| `analytics_dashboard_viewed` | User views the analytics dashboard page (server-side) | `app/routes/analytics.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented. Log in to PostHog and create an **"Analytics basics"** dashboard with these recommended insights:

1. **Feed to Purchase Funnel** — Funnel: `feed_viewed` → `follower_package_selected` → `follower_purchase_completed`
2. **Follower Purchase Completions** — Trend: `follower_purchase_completed` count over time
3. **Post Engagement** — Trend: `post_liked` and `post_unliked` over time
4. **Package Selection Rate** — Funnel: `follower_package_selected` → `follower_purchase_completed` (purchase conversion rate)
5. **Social Engagement** — Trend: `follower_followed_back` over time

You can access PostHog at: https://us.posthog.com/project/2

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
