<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the CloutHub React Router v7 (Framework mode) application. Here is a summary of every change made:

- **`app/entry.client.tsx`** *(new)* — Created the client entry point. Initialises `posthog-js` with the project token and host from environment variables, wraps `HydratedRouter` in `PostHogProvider`, and enables `__add_tracing_headers` so that client session/distinct IDs are automatically forwarded to the server on every fetch request.
- **`app/lib/posthog-middleware.ts`** *(new)* — Server-side PostHog middleware using `posthog-node`. Creates a fresh PostHog Node client per request, extracts `X-POSTHOG-SESSION-ID` / `X-POSTHOG-DISTINCT-ID` headers, and uses `withContext()` to correlate server-side events with the correct user session. Shuts down cleanly after each request.
- **`app/root.tsx`** — Exported the `middleware` array referencing `posthogMiddleware` (activates server-side tracking for all routes). Added `usePostHog` import and `posthog.captureException(error)` call inside `ErrorBoundary` for automatic unhandled error tracking.
- **`react-router.config.ts`** — Added `future.v8_middleware: true` to enable the middleware API required by the PostHog server middleware.
- **`vite.config.ts`** — Added `posthog-js` and `@posthog/react` to `ssr.noExternal` in dev mode so they are bundled correctly during SSR.
- **`env.d.ts`** — Added `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` to the `ImportMetaEnv` interface for full TypeScript coverage.
- **`.env`** — Set `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` via the wizard-tools MCP (values never hardcoded).

**Event tracking added:**

| Event | Description | File |
|---|---|---|
| `feed_viewed` | User navigated to and viewed the feed page — top of engagement funnel | `app/routes/feed.tsx` |
| `follower_package_selected` | User selected a follower package on the buy-followers page | `app/routes/buy-followers.tsx` |
| `followers_purchased` | User completed a fake follower purchase — key conversion event | `app/routes/buy-followers.tsx` |
| `post_liked` | User liked a post in the feed | `app/components/PostCard.tsx` |
| `post_unliked` | User unliked a previously liked post in the feed | `app/components/PostCard.tsx` |
| `follower_followed_back` | User followed back one of their fake followers on the profile page | `app/routes/profile.tsx` |

## Next steps

We've prepared recommended insights for an "Analytics basics" dashboard to keep an eye on user behavior. You can create them directly in your PostHog project:

- **Project home**: https://us.posthog.com/project/2/dashboards
- **Purchase conversion funnel** (feed_viewed → follower_package_selected → followers_purchased): https://us.posthog.com/project/2/insights/new?insight=FUNNELS
- **Followers purchased over time** (trend on `followers_purchased`): https://us.posthog.com/project/2/insights/new?insight=TRENDS
- **Post engagement** (trend on `post_liked` + `post_unliked`): https://us.posthog.com/project/2/insights/new?insight=TRENDS
- **Follow-back activity** (trend on `follower_followed_back`): https://us.posthog.com/project/2/insights/new?insight=TRENDS
- **Package popularity breakdown** (`follower_package_selected` broken down by `package_index`): https://us.posthog.com/project/2/insights/new?insight=TRENDS

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-react-react-router-7-framework/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
