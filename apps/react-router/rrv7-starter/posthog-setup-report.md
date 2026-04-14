<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the CloutHub React Router v7 application. Here is a summary of all changes made:

- **`app/entry.client.tsx`** (created): Initializes the PostHog client with your project token and host from environment variables, and wraps the React Router app with `PostHogProvider` for access throughout the component tree.
- **`app/root.tsx`** (edited): Added `usePostHog` import and `captureException` call inside the `ErrorBoundary` component so unhandled errors are automatically sent to PostHog.
- **`app/components/PostCard.tsx`** (edited): Added `post_liked` and `post_unliked` events in `handleLike`, capturing post ID and username properties.
- **`app/routes/buy-followers.tsx`** (edited): Added `follower_package_selected` event when a user selects a package (with package details), and `followers_purchased` event upon purchase completion (with total followers and price).
- **`app/routes/profile.tsx`** (edited): Added `follow_back_clicked` event in the `FollowButton` component when a user follows back a bot follower.
- **`app/routes/home.tsx`** (edited): Added `view_feed_cta_clicked` and `buy_followers_cta_clicked` events on the hero CTA buttons.
- **`vite.config.ts`** (edited): Added `posthog-js` and `@posthog/react` to the dev SSR `noExternal` list so they are correctly bundled during development.
- **`env.d.ts`** (edited): Added TypeScript declarations for `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST`.
- **`.env`** (created/updated): Set `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` via the wizard-tools MCP.

| Event | Description | File |
|-------|-------------|------|
| `post_liked` | User likes a post in the feed | `app/components/PostCard.tsx` |
| `post_unliked` | User unlikes a previously liked post | `app/components/PostCard.tsx` |
| `follower_package_selected` | User selects a follower package on the buy page | `app/routes/buy-followers.tsx` |
| `followers_purchased` | User completes a fake follower purchase | `app/routes/buy-followers.tsx` |
| `follow_back_clicked` | User clicks follow back on a bot follower | `app/routes/profile.tsx` |
| `view_feed_cta_clicked` | User clicks the View Feed CTA on home | `app/routes/home.tsx` |
| `buy_followers_cta_clicked` | User clicks the Buy Fake Followers CTA on home | `app/routes/home.tsx` |

## Next steps

We've set up the events above. Head to PostHog to explore your data and build insights:

- [PostHog Project Dashboard](https://us.posthog.com/project/2/dashboards)
- [New Insight: Follower Purchase Funnel](https://us.posthog.com/project/2/insights/new#insight=FUNNELS&events=[{"id":"buy_followers_cta_clicked","type":"events","order":0},{"id":"follower_package_selected","type":"events","order":1},{"id":"followers_purchased","type":"events","order":2}])
- [New Insight: Post Engagement (Likes) Over Time](https://us.posthog.com/project/2/insights/new#insight=TRENDS&events=[{"id":"post_liked","type":"events"},{"id":"post_unliked","type":"events"}])
- [New Insight: Follow Back Clicks Over Time](https://us.posthog.com/project/2/insights/new#insight=TRENDS&events=[{"id":"follow_back_clicked","type":"events"}])
- [New Insight: CTA Clicks Over Time](https://us.posthog.com/project/2/insights/new#insight=TRENDS&events=[{"id":"view_feed_cta_clicked","type":"events"},{"id":"buy_followers_cta_clicked","type":"events"}])
- [Live Events Stream](https://us.posthog.com/project/2/activity/explore)

### Suggested "Analytics basics" dashboard contents

1. **Follower Purchase Funnel** — `buy_followers_cta_clicked` → `follower_package_selected` → `followers_purchased` (conversion funnel)
2. **Post Engagement** — `post_liked` and `post_unliked` trends over time
3. **CTA Performance** — `view_feed_cta_clicked` vs `buy_followers_cta_clicked` trends
4. **Follow Back Activity** — `follow_back_clicked` trends over time
5. **Package Selection Breakdown** — `follower_package_selected` breakdown by `package_amount` property

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
