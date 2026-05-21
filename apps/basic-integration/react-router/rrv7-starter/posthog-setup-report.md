<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the CloutHub React Router v7 (Framework mode) application. Here is a summary of all changes made:

**`app/entry.client.tsx`** (new file) — Initializes PostHog with the project token and host from environment variables, wraps the hydrated React Router app in `PostHogProvider` so all components have access to `usePostHog()`. Also enables `__add_tracing_headers` to correlate client and server sessions.

**`app/root.tsx`** — Added `usePostHog` import and `posthog?.captureException(error)` call inside the `ErrorBoundary` component so unhandled route errors are automatically sent to PostHog.

**`app/routes/buy-followers.tsx`** — Added `follower_package_selected` event (fires when a user clicks a package, with `package_amount`, `package_bonus`, `package_price`, and `total_followers` properties) and `follower_purchase_completed` event (fires after the fake purchase completes, with the same properties).

**`app/components/PostCard.tsx`** — Added `post_liked` and `post_unliked` events in the `handleLike` handler, including `post_id` and `post_username` properties.

**`app/routes/profile.tsx`** — Added `follower_followed_back` event inside the `FollowButton` component when a user follows back a fake follower, with `follower_username` property.

**`vite.config.ts`** — Added PostHog reverse proxy configuration (routes `/ingest/*` to PostHog), and added `posthog-js` and `@posthog/react` to `ssr.noExternal` for correct SSR bundling.

**`env.d.ts`** — Added `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` to the `ImportMetaEnv` interface for TypeScript support.

**`.env`** — PostHog project token and host written via `set_env_values` (covered by `.gitignore`).

## Events

| Event | Description | File |
|---|---|---|
| `follower_package_selected` | User selects a fake follower package on the buy followers page | `app/routes/buy-followers.tsx` |
| `follower_purchase_completed` | User completes a fake follower purchase (conversion event) | `app/routes/buy-followers.tsx` |
| `post_liked` | User likes a post in the feed | `app/components/PostCard.tsx` |
| `post_unliked` | User unlikes a post in the feed | `app/components/PostCard.tsx` |
| `follower_followed_back` | User clicks 'Follow back' on a fake follower in the profile page | `app/routes/profile.tsx` |

## Next steps

We've set up a dashboard and insights to keep an eye on user behavior based on the events we just instrumented:

- **Analytics basics dashboard**: https://us.posthog.com/project/2/dashboard/1346453
- **Purchase Conversion Funnel** (`follower_package_selected` → `follower_purchase_completed`): https://us.posthog.com/project/2/insights/new#insight=FUNNELS
- **Follower Purchases Over Time** (`follower_purchase_completed` trend): https://us.posthog.com/project/2/insights/new#insight=TRENDS
- **Post Engagement** (`post_liked` + `post_unliked` trend): https://us.posthog.com/project/2/insights/new#insight=TRENDS
- **Social Actions** (`follower_followed_back` trend): https://us.posthog.com/project/2/insights/new#insight=TRENDS

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
