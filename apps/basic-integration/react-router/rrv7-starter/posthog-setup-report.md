<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this React Router v7 Framework mode application (CloutHub). Here is a summary of all changes made:

- **`app/entry.client.tsx`** *(created)*: Initializes `posthog-js` with the project token and host from environment variables, wraps `HydratedRouter` in `PostHogProvider`, and enables tracing headers (`__add_tracing_headers`) so server-side events are correlated with the correct client session.
- **`app/lib/posthog-middleware.ts`** *(created)*: Server-side PostHog middleware that creates a `posthog-node` client per request, extracts `X-POSTHOG-SESSION-ID` and `X-POSTHOG-DISTINCT-ID` headers from the client, and uses `withContext()` so all server-side events are automatically associated with the correct user session.
- **`app/root.tsx`** *(edited)*: Exports the `posthogMiddleware` in the `middleware` array so it runs on every server request. Adds `posthog.captureException(error)` to the `ErrorBoundary` for automatic error tracking.
- **`react-router.config.ts`** *(edited)*: Enabled the `v8_middleware: true` future flag to support the middleware API.
- **`vite.config.ts`** *(edited)*: Added `posthog-js` and `@posthog/react` to the dev-mode `ssr.noExternal` list to prevent SSR module resolution errors in development.
- **`env.d.ts`** *(edited)*: Added TypeScript types for `VITE_PUBLIC_POSTHOG_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` environment variables.
- **`.env`** *(created)*: Added `VITE_PUBLIC_POSTHOG_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` with project values.

## Event tracking

| Event | Description | File |
|-------|-------------|------|
| `follower_package_selected` | User selects a follower package on the buy followers page. Properties: `amount`, `bonus`, `price`, `total_followers`. | `app/routes/buy-followers.tsx` |
| `follower_package_purchased` | User completes a fake follower purchase. Properties: `amount`, `bonus`, `price`, `total_followers`. | `app/routes/buy-followers.tsx` |
| `post_liked` | User likes or unlikes a post in the feed. Properties: `post_id`, `username`, `liked` (true/false). | `app/components/PostCard.tsx` |
| `follower_followed_back` | User clicks 'Follow back' on a bot follower in their profile. Properties: `username`. | `app/routes/profile.tsx` |
| `cta_clicked` | User clicks a homepage CTA link (View Feed or Buy Fake Followers). Properties: `destination`. | `app/routes/home.tsx` |

## Next steps

We've configured an "Analytics basics" dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard**: [Analytics basics](https://us.posthog.com/project/2/dashboard/1346453)

Suggested insights to add to your dashboard:

1. **Purchase Conversion Funnel** — Funnel: `cta_clicked` → `follower_package_selected` → `follower_package_purchased`. Shows how many users who land on the homepage convert to a purchase.
2. **Follower Purchases Over Time** — Trend of `follower_package_purchased` events. Track purchase volume and revenue patterns.
3. **CTA Click Breakdown** — `cta_clicked` broken down by `destination` property. See which homepage CTAs drive more traffic.
4. **Feed Engagement** — Trend of `post_liked` events. Gauge how engaged users are with the feed.
5. **Follower Follow-backs** — Trend of `follower_followed_back` events. Understand social engagement depth on the profile page.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
