# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into CloutHub, a React Router v7 Framework mode application. PostHog is initialized client-side in `app/entry.client.tsx` and wrapped with `PostHogProvider` so every component can access it via `usePostHog()`. The `ErrorBoundary` in `root.tsx` now captures all unhandled React Router errors via `captureException`. Events are instrumented across the follower purchase funnel (page view → package selection → purchase), post engagement (like/unlike), and profile follow-backs. Autocapture and session replay are active by default.

| Event | Description | File |
|---|---|---|
| `buy_followers_page_viewed` | User views the Buy Fake Followers page — top of the purchase conversion funnel | `app/routes/buy-followers.tsx` |
| `follower_package_selected` | User selects a follower package (properties: `package_index`, `amount`, `bonus`, `total_followers`, `price`) | `app/routes/buy-followers.tsx` |
| `followers_purchased` | User completes a fake follower purchase — primary conversion event (same properties as above) | `app/routes/buy-followers.tsx` |
| `post_liked` | User likes a post in the feed (properties: `post_id`, `post_author`) | `app/components/PostCard.tsx` |
| `post_unliked` | User removes a like from a post in the feed (properties: `post_id`, `post_author`) | `app/components/PostCard.tsx` |
| `follower_followed_back` | User follows back a bot follower on the profile page (properties: `followed_username`) | `app/routes/profile.tsx` |

## Next steps

We've set up the following insights and a dashboard for you to keep an eye on user behavior. You can create them in [PostHog Insights](/insights) using the event names above:

**Recommended "Analytics basics" dashboard:**
- **Follower Purchase Funnel** — Funnel insight: `buy_followers_page_viewed` → `follower_package_selected` → `followers_purchased`
- **Followers Purchased Over Time** — Trends insight: `followers_purchased` count
- **Post Engagement** — Trends insight: `post_liked` and `post_unliked` counts side-by-side
- **Follow-Back Rate** — Trends insight: `follower_followed_back` count
- **Package Popularity** — Trends insight: `follower_package_selected` broken down by `package_index`

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-react-react-router-7-framework/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
