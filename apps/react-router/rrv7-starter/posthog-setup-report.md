<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this React Router v7 (Framework mode) project — **CloutHub**, a satirical fake-influencer social network.

## What was set up

### Infrastructure
- **`app/entry.client.tsx`** (created) — Initialises `posthog-js` and wraps the app in `PostHogProvider`. Enables automatic session replay, autocapture, and passes tracing headers to the server so client and server events can be correlated.
- **`app/lib/posthog-middleware.ts`** (created) — React Router middleware that creates a `posthog-node` client per request, extracts `X-POSTHOG-SESSION-ID` / `X-POSTHOG-DISTINCT-ID` from request headers, and makes the client available via `context.posthog` for server-side event capture.
- **`app/root.tsx`** (edited) — Registers the PostHog middleware array and adds `posthog.captureException(error)` to the global `ErrorBoundary` so unhandled React Router errors are automatically tracked.
- **`react-router.config.ts`** (edited) — Adds `future: { v8_middleware: true }` to enable the middleware system.
- **`vite.config.ts`** (edited) — Adds `posthog-js` and `@posthog/react` to the dev SSR `noExternal` list so they are correctly bundled during development.
- **`.env`** (created) — Stores `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` (git-ignored).

### Events instrumented

| Event | Description | File |
|---|---|---|
| `buy_followers_viewed` | User viewed the Buy Followers page — top of purchase funnel | `app/routes/buy-followers.tsx` |
| `package_selected` | User selected a follower package (includes `amount`, `bonus`, `total_followers`, `price`) | `app/routes/buy-followers.tsx` |
| `followers_purchased` | User completed a fake follower purchase — key conversion (includes package details) | `app/routes/buy-followers.tsx` |
| `post_liked` | User liked a post in the feed (includes `post_id`, `post_username`) | `app/components/PostCard.tsx` |
| `post_unliked` | User unliked a post in the feed (includes `post_id`, `post_username`) | `app/components/PostCard.tsx` |
| `user_followed` | User followed back a bot follower on the profile page (includes `followed_username`) | `app/routes/profile.tsx` |

## Next steps

We've set up the events — here are suggested insights to build your "Analytics basics" dashboard in PostHog:

1. **Purchase conversion funnel** — Funnel: `buy_followers_viewed` → `package_selected` → `followers_purchased`
   Create at: https://us.posthog.com/project/238360/insights/new?insight=FUNNELS

2. **Followers purchased over time** — Trend: `followers_purchased` count per day
   Create at: https://us.posthog.com/project/238460/insights/new?insight=TRENDS

3. **Most popular packages** — Breakdown of `package_selected` by `package_index`
   Create at: https://us.posthog.com/project/238460/insights/new?insight=TRENDS

4. **Post engagement** — Trend: `post_liked` and `post_unliked` counts over time
   Create at: https://us.posthog.com/project/238460/insights/new?insight=TRENDS

5. **Total revenue (fake)** — Retention / property sum of `price` on `followers_purchased` events
   Create at: https://us.posthog.com/project/238460/insights/new?insight=TRENDS

Dashboard: https://us.posthog.com/project/238460/dashboards

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-react-react-router-7-framework/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
