<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into CloutHub, a satirical fake influencer social network built with React Router v7 (Framework mode).

## Changes made

- **`app/entry.client.tsx`** (created): Initialises `posthog-js` and wraps `HydratedRouter` in `PostHogProvider`. This is the client-side entry point that enables all PostHog features — analytics, session replay, and error tracking — across the entire app.
- **`app/root.tsx`**: Added `usePostHog()` to the `ErrorBoundary` and called `posthog?.captureException(error)` so unhandled route errors are automatically reported to PostHog Error Tracking.
- **`app/routes/buy-followers.tsx`**: Added `follower_package_selected` (on card click) and `followers_purchased` (on purchase completion) events with package price, amount, and bonus properties — covering the full conversion funnel.
- **`app/components/PostCard.tsx`**: Added `post_liked` event (with `liked: true/false`) whenever a user toggles a like on any feed post.
- **`app/routes/profile.tsx`**: Added `follow_back_clicked` event inside `FollowButton`, fired once when the user clicks "Follow back" on a bot follower.
- **`vite.config.ts`**: Added `posthog-js` and `@posthog/react` to `ssr.noExternal` for the dev server, and configured a `/ingest` proxy so PostHog requests are routed through the app server in development.
- **`.env`**: Set `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` (gitignore coverage ensured).

## Tracked events

| Event | Description | File |
|-------|-------------|------|
| `follower_package_selected` | User selects a follower package on the buy-followers page | `app/routes/buy-followers.tsx` |
| `followers_purchased` | User completes a fake follower purchase (key conversion event) | `app/routes/buy-followers.tsx` |
| `post_liked` | User likes or unlikes a post in the feed | `app/components/PostCard.tsx` |
| `follow_back_clicked` | User clicks the Follow Back button on a fake follower in the profile page | `app/routes/profile.tsx` |

## Next steps

We've set up the events — here's how to build the recommended insights in your PostHog project:

**Suggested "Analytics basics" dashboard insights:**

1. **Follower purchase funnel** — Funnel from `follower_package_selected` → `followers_purchased`. Shows conversion rate of users who click a package to those who complete the purchase.
   - [Create funnel insight](https://us.posthog.com/project/2/insights/new#funnel)

2. **Followers purchased over time** — Trend of `followers_purchased` events per day/week. Your primary growth metric.
   - [Create trends insight](https://us.posthog.com/project/2/insights/new#trends)

3. **Revenue by package** — Trend of `followers_purchased` broken down by `price` property. Shows which packages are most popular.
   - [Create trends insight](https://us.posthog.com/project/2/insights/new#trends)

4. **Feed engagement — post likes** — Trend of `post_liked` events, filtered by `liked = true`. Shows how active users are in the feed.
   - [Create trends insight](https://us.posthog.com/project/2/insights/new#trends)

5. **Follow-back engagement** — Trend of `follow_back_clicked` events. Measures how often users interact with their fake follower list.
   - [Create trends insight](https://us.posthog.com/project/2/insights/new#trends)

Once created, add all five to a new dashboard:
- [Create dashboard](https://us.posthog.com/project/2/dashboard/new)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-react-react-router-7-framework/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
