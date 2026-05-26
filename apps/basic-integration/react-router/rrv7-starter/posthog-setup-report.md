<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into CloutHub, a React Router v7 Framework-mode application. The following changes were made:

- **`app/entry.client.tsx`** (new file): PostHog is initialized here with the project token and host from environment variables. The `PostHogProvider` wraps the `HydratedRouter` so every component in the app can access PostHog via `usePostHog()`.
- **`vite.config.ts`**: Added `posthog-js` and `@posthog/react` to the SSR `noExternal` list (dev mode) and configured a Vite dev-server proxy so PostHog requests route through `/ingest` during local development.
- **`app/root.tsx`**: The `ErrorBoundary` now calls `posthog.captureException(error)` to send unhandled React Router errors to PostHog Error Tracking.
- **`app/routes/buy-followers.tsx`**: Captures `package_selected` when a user clicks a follower package, and `purchase_completed` after the fake checkout completes — the core conversion funnel.
- **`app/components/PostCard.tsx`**: Captures `post_liked` and `post_unliked` in the feed's like button handler.
- **`app/routes/profile.tsx`**: Captures `follow_back_clicked` when the user follows back a bot follower.
- **`app/routes/feed.tsx`**: Captures `feed_viewed` on mount to mark the entry point of the content engagement funnel.
- **`.env`**: Created with `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` (already covered by `.gitignore`).

| Event | Description | File |
|-------|-------------|------|
| `package_selected` | User selects a follower package on the buy-followers page. Top of conversion funnel. | `app/routes/buy-followers.tsx` |
| `purchase_completed` | User completes a fake follower package purchase. Key conversion event. | `app/routes/buy-followers.tsx` |
| `post_liked` | User likes a post in the feed. | `app/components/PostCard.tsx` |
| `post_unliked` | User unlikes a post in the feed. | `app/components/PostCard.tsx` |
| `follow_back_clicked` | User clicks Follow back on a follower listed on the profile page. | `app/routes/profile.tsx` |
| `feed_viewed` | User views the social feed. Top of content engagement funnel. | `app/routes/feed.tsx` |

## Next steps

To see your events in PostHog, visit your project and create an **"Analytics basics"** dashboard. Suggested insights:

- **Conversion funnel** — `package_selected` → `purchase_completed`: shows how many users who select a package actually complete the checkout.
- **Follower package breakdown** — Trends of `purchase_completed` broken down by `package_index` or `total_followers`: reveals which tier is most popular.
- **Feed engagement** — Trends of `post_liked` and `post_unliked` over time: tracks content engagement.
- **Feed-to-purchase funnel** — `feed_viewed` → `package_selected` → `purchase_completed`: full top-of-funnel view.
- **Social follow-back rate** — Trends of `follow_back_clicked`: measures how actively users engage with their fake followers.

Open [your PostHog project dashboard](https://us.posthog.com/project/2/dashboards) to build these.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
