<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your CloutHub React Router v7 (Framework mode) application. Here's what was done:

## Summary of Changes

**New files created:**
- `app/entry.client.tsx` — Initializes the PostHog JavaScript SDK (`posthog-js`) and wraps the React app with `<PostHogProvider>` for global access via `usePostHog()` hooks. Includes `__add_tracing_headers` for client-server session correlation.

**Updated files:**
- `vite.config.ts` — Added `posthog-js` and `@posthog/react` to the `ssr.noExternal` dev list to prevent SSR bundling issues.
- `app/root.tsx` — Integrated `usePostHog()` in the `ErrorBoundary` component to automatically capture all unhandled React Router errors via `posthog.captureException()`.
- `app/routes/buy-followers.tsx` — Tracks the full follower purchase conversion funnel: page view → package selection → purchase initiation → purchase completion.
- `app/routes/home.tsx` — Tracks homepage CTA clicks ("View Feed" and "Buy Fake Followers") to measure top-of-funnel traffic flow.
- `app/routes/profile.tsx` — Tracks "Follow back" actions from the profile page with the followed username as a property.
- `app/components/PostCard.tsx` — Tracks post like and unlike interactions with post ID and author username.
- `app/components/header.tsx` — Tracks clicks on the "Buy Followers" CTA button in the navigation header.

**Environment variables set (`.env.local`):**
- `VITE_PUBLIC_POSTHOG_KEY` — PostHog project API key
- `VITE_PUBLIC_POSTHOG_HOST` — PostHog ingestion host (`https://us.i.posthog.com`)

**Packages installed:**
- `posthog-js` — Client-side PostHog SDK
- `@posthog/react` — React bindings with `usePostHog()` hook and `<PostHogProvider>`

## Event Tracking Table

| Event Name | Description | File |
|---|---|---|
| `buy_followers_page_viewed` | User viewed the Buy Followers page — top of the conversion funnel | `app/routes/buy-followers.tsx` |
| `follower_package_selected` | User clicked on a follower package card to select it, with package details (amount, price) | `app/routes/buy-followers.tsx` |
| `follower_purchase_initiated` | User clicked the purchase button to start a fake follower purchase, with selected package details | `app/routes/buy-followers.tsx` |
| `follower_purchase_completed` | Fake follower purchase completed successfully, with total followers added and price | `app/routes/buy-followers.tsx` |
| `post_liked` | User liked a post in the feed, with post ID and author username | `app/components/PostCard.tsx` |
| `post_unliked` | User unliked a previously liked post in the feed, with post ID and author username | `app/components/PostCard.tsx` |
| `follow_back_clicked` | User clicked 'Follow back' on a follower in their profile, with the followed username | `app/routes/profile.tsx` |
| `header_buy_followers_clicked` | User clicked the 'Buy Followers' CTA button in the navigation header | `app/components/header.tsx` |
| `home_view_feed_clicked` | User clicked the 'View Feed' CTA on the homepage | `app/routes/home.tsx` |
| `home_buy_followers_clicked` | User clicked the 'Buy Fake Followers' CTA on the homepage | `app/routes/home.tsx` |
| `error_boundary_triggered` | The app's error boundary was triggered due to an unhandled error (via `captureException`) | `app/root.tsx` |

## Next steps

We recommend building the following insights and an "Analytics basics" dashboard in PostHog to monitor your key metrics:

1. **Follower Purchase Conversion Funnel** — Track `buy_followers_page_viewed` → `follower_package_selected` → `follower_purchase_initiated` → `follower_purchase_completed`
2. **Post Engagement Trend** — Count of `post_liked` events over time
3. **Homepage CTA Comparison** — Compare `home_view_feed_clicked` vs `home_buy_followers_clicked` to understand intent
4. **Header CTA Clicks** — Trend of `header_buy_followers_clicked` for navigation-driven conversions
5. **Follow Back Rate** — Count of `follow_back_clicked` events to measure social engagement

You can build these insights in your PostHog project:

- **PostHog Project Dashboard**: [https://us.posthog.com/project/238460/dashboard](https://us.posthog.com/project/238460/dashboard)
- **Create New Insight**: [https://us.posthog.com/project/238460/insights/new](https://us.posthog.com/project/238460/insights/new)
- **Activity Feed** (to verify events are arriving): [https://us.posthog.com/project/238460/activity/explore](https://us.posthog.com/project/238460/activity/explore)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-react-react-router-7-framework/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
