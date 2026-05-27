<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Hacker Native Expo app. Here's what was set up:

- **`app.config.js`** — Created to replace `app.json` as the dynamic Expo config. Reads `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from environment variables and exposes them via `expo-constants` extras. Added `expo-localization` to the plugins list.
- **`.env`** — Created with `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` values (covered by `.gitignore`).
- **`lib/posthog.ts`** — New PostHog client singleton initialized from `Constants.expoConfig?.extra`, with app lifecycle capture and batching configured.
- **`app/_layout.tsx`** — Wrapped the root layout with `PostHogProvider` (touch autocapture enabled, manual screen tracking). Added a `LayoutWithTracking` component that calls `posthog.screen()` on every route change using `usePathname` and `useGlobalSearchParams`.
- **`components/Select.tsx`** — Captures `story_feed_changed` when the user switches between story feed types.
- **`components/posts/Post.tsx`** — Captures `post_tapped` (navigate to details), `post_link_opened` (open external URL), and `post_upvoted` (upvote button tap).
- **`app/[itemId].tsx`** — Captures `item_upvoted`, `item_link_opened`, and `item_author_tapped` on the story/item detail screen.
- **`app/users/[userId].tsx`** — Captures `user_profile_viewed` when a user profile screen mounts.
- **`components/comments/comment.tsx`** — Captures `comment_author_tapped` when a user taps a comment author's name.

**Dependencies installed:** `posthog-react-native`, `expo-file-system`, `expo-application`, `expo-device`, `expo-localization`

| Event | Description | File |
|---|---|---|
| `story_feed_changed` | User switches the story feed type (top, best, ask, show) | `components/Select.tsx` |
| `post_tapped` | User taps a post title to navigate to its detail screen | `components/posts/Post.tsx` |
| `post_link_opened` | User opens the external URL associated with a post | `components/posts/Post.tsx` |
| `post_upvoted` | User taps the upvote button on a post in the feed | `components/posts/Post.tsx` |
| `item_upvoted` | User taps the upvote button on an item's detail screen | `app/[itemId].tsx` |
| `item_link_opened` | User opens the external URL from an item's detail screen | `app/[itemId].tsx` |
| `item_author_tapped` | User taps the author name on an item's detail screen | `app/[itemId].tsx` |
| `user_profile_viewed` | User navigates to a Hacker News user's profile page | `app/users/[userId].tsx` |
| `comment_author_tapped` | User taps a comment author's username to view their profile | `components/comments/comment.tsx` |

## Next steps

We've instrumented 9 key events across the app. You can build insights and a dashboard in PostHog to monitor user behavior:

- [PostHog Dashboards](https://us.posthog.com/project/2/dashboard) — Create an "Analytics basics" dashboard
- [New Insight — Trends](https://us.posthog.com/project/2/insights/new) — Track `story_feed_changed` over time to see which feed types are most popular
- [New Insight — Trends](https://us.posthog.com/project/2/insights/new) — Compare `post_tapped` vs `post_link_opened` to understand internal vs external content preference
- [New Insight — Funnel](https://us.posthog.com/project/2/insights/new) — Build a funnel from `post_tapped` → `item_upvoted` to measure engagement depth
- [New Insight — Trends](https://us.posthog.com/project/2/insights/new) — Track `user_profile_viewed` to measure community engagement
- [Data Management](https://us.posthog.com/project/2/data-management/events) — Review all captured events

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-expo/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
