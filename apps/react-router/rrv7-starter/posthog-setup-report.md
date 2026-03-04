<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the CloutHub React Router v7 (Framework mode) application. The following changes were made:

- **`app/entry.client.tsx`** (new file): PostHog SDK initialized with `posthog-js` and the app wrapped in `PostHogProvider` for React context access throughout the component tree. Tracing headers are enabled to correlate client/server sessions.
- **`vite.config.ts`**: Added `posthog-js` and `@posthog/react` to `ssr.noExternal` for dev-mode SSR compatibility.
- **`app/root.tsx`**: Added `captureException` in the `ErrorBoundary` so unhandled React Router errors are automatically tracked.
- **`app/components/header.tsx`**: Tracks `buy_followers_cta_clicked` when the header "Buy Followers" button is clicked.
- **`app/routes/home.tsx`**: Tracks `view_feed_clicked` and `buy_followers_link_clicked` on the home page hero CTAs.
- **`app/routes/buy-followers.tsx`**: Tracks `follower_package_selected` (with package details) when a user selects a package, and `followers_purchased` (with total followers and price) when a purchase completes — the primary conversion event.
- **`app/components/PostCard.tsx`**: Tracks `post_liked` and `post_unliked` with `post_id` and `post_username` properties.
- **`app/routes/profile.tsx`**: Tracks `follower_followed_back` with the followed username when a user follows a bot follower back.
- **`app/routes/analytics.tsx`**: Tracks `analytics_page_viewed` (top of conversion funnel) with purchased follower count context.

## Environment variables

The following variables were added to `.env`:

```
VITE_PUBLIC_POSTHOG_KEY=<your_project_api_key>
VITE_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

## Events instrumented

| Event | Description | File |
|-------|-------------|------|
| `buy_followers_cta_clicked` | User clicks the 'Buy Followers' button in the header navigation bar | `app/components/header.tsx` |
| `buy_followers_link_clicked` | User clicks the 'Buy Fake Followers' CTA link on the home page | `app/routes/home.tsx` |
| `view_feed_clicked` | User clicks the 'View Feed' button on the home page | `app/routes/home.tsx` |
| `follower_package_selected` | User selects a follower package (amount, bonus, price captured) | `app/routes/buy-followers.tsx` |
| `followers_purchased` | User completes a purchase — main conversion event (total followers, price) | `app/routes/buy-followers.tsx` |
| `post_liked` | User likes a post in the feed (post_id, post_username) | `app/components/PostCard.tsx` |
| `post_unliked` | User unlikes a post in the feed (post_id, post_username) | `app/components/PostCard.tsx` |
| `follower_followed_back` | User clicks 'Follow back' on a bot follower (followed_username) | `app/routes/profile.tsx` |
| `analytics_page_viewed` | User views the analytics dashboard (top of conversion funnel) | `app/routes/analytics.tsx` |

## Next steps

To monitor user behavior, create an **"Analytics basics"** dashboard in PostHog with the following insights:

1. **Follower Purchase Conversion Funnel** — Funnel: `buy_followers_cta_clicked` → `follower_package_selected` → `followers_purchased`. Reveals drop-off at each stage of the purchase flow.
2. **Purchase Volume & Revenue** — Trend of `followers_purchased` over time, broken down by `price` or `total_followers_added`. Shows purchase velocity.
3. **Feed Engagement** — Trend of `post_liked` and `post_unliked` over time. Reveals how engaged users are with the content feed.
4. **Top Entry Points to Buy Followers** — Bar chart of `buy_followers_cta_clicked` (by `location`) and `buy_followers_link_clicked`. Shows which CTAs drive the most traffic.
5. **Analytics Dashboard Visitors who Purchased** — Funnel: `analytics_page_viewed` → `followers_purchased`. Tests the hypothesis that users who see their low stats are more likely to buy followers.

You can create this dashboard at: https://us.posthog.com/project/2/dashboard

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-react-react-router-7-framework/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
