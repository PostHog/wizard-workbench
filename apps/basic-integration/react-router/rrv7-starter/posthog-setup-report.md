# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your CloutHub React Router v7 (Framework mode) application. Here's a summary of every change made:

- **`app/entry.client.tsx`** (new): Client-side PostHog initialization using `posthog-js` with `PostHogProvider` wrapping `HydratedRouter`. Enables automatic pageview capture, session replay, and the `usePostHog` hook throughout the app. Tracing headers are set so client and server events are automatically correlated.
- **`app/lib/posthog-middleware.ts`** (new): Server-side PostHog middleware using `posthog-node`. Creates a per-request PostHog client, extracts `X-POSTHOG-SESSION-ID` and `X-POSTHOG-DISTINCT-ID` headers from the client SDK, and stores the client on the request context for use in route loaders and actions.
- **`app/root.tsx`**: Added `posthogMiddleware` to the root `middleware` export (so every route inherits it), and added `posthog.captureException(error)` in the `ErrorBoundary` for automatic unhandled error tracking.
- **`react-router.config.ts`**: Enabled `future.v8_middleware: true` to activate the React Router v7 middleware API.
- **`vite.config.ts`**: Added `posthog-js` and `@posthog/react` to `ssr.noExternal` for SSR compatibility, and added an ingest proxy (`/ingest/*`) so PostHog requests are routed through your own domain in development.
- **`app/routes/buy-followers.tsx`**: Instruments the two key conversion funnel events.
- **`app/components/PostCard.tsx`**: Instruments post engagement events.
- **`app/routes/profile.tsx`**: Instruments the follow-back social action.

## Events

| Event | Description | File |
|-------|-------------|------|
| `followers_purchased` | User completes a fake follower package purchase. Primary conversion event. | `app/routes/buy-followers.tsx` |
| `follower_package_selected` | User selects a follower package. Key funnel step before purchase. | `app/routes/buy-followers.tsx` |
| `post_liked` | User likes a post in the feed. | `app/components/PostCard.tsx` |
| `post_unliked` | User removes their like from a post in the feed. | `app/components/PostCard.tsx` |
| `follow_back_clicked` | User clicks 'Follow back' on a bot follower in their profile. | `app/routes/profile.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics dashboard](/dashboard/1313956)

To populate the dashboard with insights, open the link above and add the following:

1. **Follower purchase funnel** — Funnel from `follower_package_selected` → `followers_purchased` to measure conversion rate on the buy-followers page.
2. **Followers purchased over time** — Trends chart of `followers_purchased` to track purchase volume.
3. **Feed engagement** — Trends chart of `post_liked` and `post_unliked` to monitor content interaction.
4. **Follow-back rate** — Trends chart of `follow_back_clicked` to see social engagement on the profile page.
5. **Package selection breakdown** — Trends chart of `follower_package_selected` broken down by `package_amount` property to see which packages are most popular.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-react-react-router-7-framework/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
