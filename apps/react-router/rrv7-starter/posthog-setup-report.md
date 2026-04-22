<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the CloutHub React Router v7 (Framework mode) application. PostHog is initialized in `app/entry.client.tsx` with the `PostHogProvider` wrapping the app, enabling automatic pageview tracking, session replay, and feature flags. Error tracking was added to the `ErrorBoundary` in `app/root.tsx`. Six key user action events are now captured across the app's core conversion and engagement flows.

| Event Name | Description | File |
|---|---|---|
| `follower_package_selected` | User selects a follower package on the buy-followers page | `app/routes/buy-followers.tsx` |
| `follower_purchase_completed` | User completes a fake follower purchase | `app/routes/buy-followers.tsx` |
| `post_liked` | User likes or unlikes a post in the feed | `app/components/PostCard.tsx` |
| `follower_followed_back` | User clicks "Follow back" on a fake follower in the profile page | `app/routes/profile.tsx` |
| `buy_followers_cta_clicked` | User clicks the "Buy Fake Followers" CTA on the home page | `app/routes/home.tsx` |
| `view_feed_cta_clicked` | User clicks the "View Feed" CTA on the home page | `app/routes/home.tsx` |

## Next steps

To monitor user behavior with these events, create an **"Analytics basics"** dashboard in PostHog with the following insights:

1. **Purchase conversion funnel** — Funnel: `buy_followers_cta_clicked` → `follower_package_selected` → `follower_purchase_completed`
2. **Follower purchases over time** — Trend: `follower_purchase_completed` (volume over time)
3. **Most popular packages** — Breakdown of `follower_package_selected` by `package_index` property
4. **Feed engagement** — Trend: `post_liked` (volume over time)
5. **Home page CTA clicks** — Trend comparing `view_feed_cta_clicked` vs `buy_followers_cta_clicked`

Visit [https://us.posthog.com/project/2/dashboard](https://us.posthog.com/project/2/dashboard) to create these insights.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
