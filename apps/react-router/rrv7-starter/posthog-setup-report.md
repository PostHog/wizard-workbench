<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the CloutHub React Router v7 (Framework mode) application. Here's a summary of all changes made:

## Integration Summary

- **`app/entry.client.tsx`** *(new file)* — Created the React Router client entry point. Initializes `posthog-js` with environment variables and wraps the `HydratedRouter` in `<PostHogProvider>` so PostHog is available everywhere in the app.
- **`app/root.tsx`** — Added `usePostHog` import and `posthog.captureException(error)` call in `ErrorBoundary` for automatic error/exception tracking.
- **`app/routes/buy-followers.tsx`** — Added `buy_followers_page_viewed` on mount, `follower_package_selected` when a package card is clicked, and `followers_purchased` when the purchase is confirmed. These form the core conversion funnel.
- **`app/components/PostCard.tsx`** — Added `post_liked` event whenever a user likes or unlikes a post in the feed.
- **`app/routes/profile.tsx`** — Added `follower_followed_back` event when the user clicks "Follow back" on a bot follower.
- **`app/routes/analytics.tsx`** — Added `analytics_dashboard_viewed` event on page mount, including total followers and purchased followers as properties.
- **`env.d.ts`** — Added `VITE_PUBLIC_POSTHOG_KEY` and `VITE_PUBLIC_POSTHOG_HOST` to `ImportMetaEnv` for TypeScript coverage.
- **`vite.config.ts`** — Added `posthog-js` and `@posthog/react` to `ssr.noExternal` for server-side rendering compatibility.
- **`.env`** — Populated `VITE_PUBLIC_POSTHOG_KEY` and `VITE_PUBLIC_POSTHOG_HOST` (gitignore-protected).
- **`package.json`** — Added `posthog-js`, `@posthog/react`, and `posthog-node` dependencies.

## Events Table

| Event Name | Description | File |
|---|---|---|
| `buy_followers_page_viewed` | User views the Buy Fake Followers page (top of purchase conversion funnel) | `app/routes/buy-followers.tsx` |
| `follower_package_selected` | User selects a follower package (props: `package_index`, `amount`, `bonus`, `total_followers`, `price`) | `app/routes/buy-followers.tsx` |
| `followers_purchased` | User completes a fake follower purchase — key conversion event (props: `package_index`, `amount`, `bonus`, `total_followers`, `price`) | `app/routes/buy-followers.tsx` |
| `post_liked` | User likes or unlikes a post in the feed (props: `post_id`, `post_username`, `liked`) | `app/components/PostCard.tsx` |
| `follower_followed_back` | User follows back a bot follower on their profile page (props: `follower_username`) | `app/routes/profile.tsx` |
| `analytics_dashboard_viewed` | User views the analytics dashboard page (props: `total_followers`, `purchased_followers`) | `app/routes/analytics.tsx` |

## Next steps

Once you have a PostHog account with dashboard write access, you can create insights for these recommended queries:

**Follower Purchase Funnel** — Funnels insight tracking:
`buy_followers_page_viewed` → `follower_package_selected` → `followers_purchased`

**Followers Purchased Daily Trend** — Trends insight for `followers_purchased` over time

**Post Engagement - Likes Over Time** — Trends insight for `post_liked` over time

**Package Selection Breakdown** — Trends insight for `follower_package_selected` broken down by `package_index` property

**User Engagement Overview** — Multi-series trend: `post_liked` + `follower_followed_back` + `analytics_dashboard_viewed`

Visit [PostHog](https://us.posthog.com) to create your "Analytics basics" dashboard with these insights.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-react-react-router-7-framework/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
