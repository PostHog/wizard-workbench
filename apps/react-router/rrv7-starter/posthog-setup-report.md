<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the CloutHub React Router v7 (Framework mode) project. Here is a summary of all changes made:

- **`app/entry.client.tsx`** (created): Initialises the PostHog JS SDK with the project token and host from environment variables, wraps the `HydratedRouter` in `PostHogProvider`, and enables tracing headers for session/user correlation. Automatic pageview capture is active.
- **`app/root.tsx`** (edited): Added `usePostHog` import and `posthog.captureException(error)` call inside the `ErrorBoundary` component to automatically capture all unhandled React Router errors.
- **`vite.config.ts`** (edited): Added `posthog-js` and `@posthog/react` to the `ssr.noExternal` list for dev builds, and added a `/ingest` proxy for local development to route PostHog requests through the dev server.
- **`app/routes/buy-followers.tsx`** (edited): Added `buy_followers_page_viewed` on mount, `follower_package_selected` when a package card is clicked (with package details), and `follower_purchase_completed` when a fake purchase finishes (with full package and follower count data).
- **`app/routes/feed.tsx`** (edited): Added `feed_viewed` on mount, capturing the number of posts shown — top of the engagement funnel.
- **`app/routes/profile.tsx`** (edited): Added `follower_followed_back` when a user follows a follower back, capturing the followed username and new total following count.
- **`app/components/PostCard.tsx`** (edited): Added `post_liked` on every like/unlike action, capturing the post ID, author username, and whether the action was a like or unlike.
- **`.env`** (created): Stores `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` — referenced in code via `import.meta.env`.

| Event | Description | File |
|---|---|---|
| `buy_followers_page_viewed` | User views the buy followers page (top of purchase funnel) | `app/routes/buy-followers.tsx` |
| `follower_package_selected` | User selects a follower package, with package details | `app/routes/buy-followers.tsx` |
| `follower_purchase_completed` | User completes a fake follower purchase with full package data | `app/routes/buy-followers.tsx` |
| `feed_viewed` | User views the feed page (top of engagement funnel) | `app/routes/feed.tsx` |
| `follower_followed_back` | User follows back a follower on their profile | `app/routes/profile.tsx` |
| `post_liked` | User likes or unlikes a post in the feed | `app/components/PostCard.tsx` |

## Next steps

We recommend creating the following insights in your PostHog dashboard to track key user behavior. Visit [https://us.posthog.com/project/2/insights/new](https://us.posthog.com/project/2/insights/new) to create them:

1. **Follower Purchase Funnel** — Funnel: `buy_followers_page_viewed` → `follower_package_selected` → `follower_purchase_completed`. Shows conversion rate through your fake purchase flow.

2. **Package Selection Trends** — Trends: `follower_package_selected` broken down by `package_index`. Shows which packages are most popular.

3. **Post Engagement Rate** — Trends: `post_liked` (liked=true) over time. Tracks how often users engage with feed content.

4. **Follow-Back Activity** — Trends: `follower_followed_back` daily. A retention signal — users who follow back are more engaged.

5. **Feed vs Purchase Intent** — Trends: `feed_viewed` vs `buy_followers_page_viewed`. Shows the split between engagement-focused and purchase-focused visits.

You can build a dashboard from these insights at [https://us.posthog.com/project/2/dashboards](https://us.posthog.com/project/2/dashboards).

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-react-react-router-7-framework/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
