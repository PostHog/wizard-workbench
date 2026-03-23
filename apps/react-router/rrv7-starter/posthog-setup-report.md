<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the CloutHub React Router v7 (Framework mode) application. The following changes were made:

- **`app/entry.client.tsx`** (created): Initializes `posthog-js` with the project token and host from environment variables, wraps the `HydratedRouter` in `PostHogProvider` to make PostHog available throughout the app. Enables session/user correlation with the `__add_tracing_headers` option.
- **`vite.config.ts`** (edited): Added `posthog-js` and `@posthog/react` to the SSR `noExternal` list for dev builds to prevent module compatibility errors.
- **`app/root.tsx`** (edited): Imported `usePostHog` and added `posthog?.captureException(error)` to the `ErrorBoundary` component for automatic error tracking.
- **`app/routes/buy-followers.tsx`** (edited): Added `package_selected` event when a user clicks a follower package, and `followers_purchased` event (with price and follower count properties) when a purchase completes.
- **`app/components/PostCard.tsx`** (edited): Added `post_liked` and `post_unliked` events (with post ID and username) when users toggle the like button on feed posts.
- **`app/routes/profile.tsx`** (edited): Added `follower_followed_back` event (with followed username) in the `FollowButton` component when a user follows back a fake follower.
- **`app/routes/home.tsx`** (edited): Added `cta_clicked` events on the "View Feed" and "Buy Fake Followers" hero CTA links, with a `cta` property to distinguish which button was clicked.
- **`.env`** (created): Populated `VITE_PUBLIC_POSTHOG_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` environment variables.

| Event | Description | File |
|---|---|---|
| `followers_purchased` | User completes a fake follower package purchase | `app/routes/buy-followers.tsx` |
| `package_selected` | User selects a follower package on the buy followers page | `app/routes/buy-followers.tsx` |
| `post_liked` | User likes a post in the feed | `app/components/PostCard.tsx` |
| `post_unliked` | User unlikes a post in the feed | `app/components/PostCard.tsx` |
| `follower_followed_back` | User follows back a fake follower on the profile page | `app/routes/profile.tsx` |
| `cta_clicked` | User clicks a CTA on the home page (View Feed or Buy Fake Followers) | `app/routes/home.tsx` |

## Next steps

We've set up event tracking for key user actions. You can now build insights and a dashboard in PostHog to monitor user behavior. Here are some recommended insights based on the events we instrumented:

1. **Purchase conversion funnel** — Funnel: `cta_clicked` (cta=buy_fake_followers) → `package_selected` → `followers_purchased`
2. **Daily followers purchased** — Trend: `followers_purchased` events over time
3. **Feed engagement** — Trend: `post_liked` and `post_unliked` events over time
4. **CTA click breakdown** — Bar chart: `cta_clicked` broken down by `cta` property
5. **Follow-back rate** — Trend: `follower_followed_back` events over time

Visit your PostHog project to build these insights and create a dashboard:

- [PostHog Project Dashboards](https://us.posthog.com/project/238460/dashboard)
- [New Insight](https://us.posthog.com/project/238460/insights/new)
- [Activity (live events)](https://us.posthog.com/project/238460/activity/explore)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-react-react-router-7-framework/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
