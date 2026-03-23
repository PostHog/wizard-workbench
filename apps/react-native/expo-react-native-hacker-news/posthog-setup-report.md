<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Hacker Native Expo app (React Native 0.81.5 / Expo SDK 54 / Expo Router 6).

## Summary of changes

- **`app.config.js`** — Created to replace static `app.json`, adds `extra.posthogProjectToken` and `extra.posthogHost` from environment variables for use with `expo-constants`.
- **`src/config/posthog.ts`** — Created the PostHog client singleton, reading config from `Constants.expoConfig.extra`, with lifecycle event capture and graceful no-op when unconfigured.
- **`app/_layout.tsx`** — Wrapped the app tree with `PostHogProvider`, added a `ScreenTracker` component for manual screen tracking via `posthog.screen()` on pathname changes (compatible with Expo Router).
- **`.env`** — Created with `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` (covered by `.gitignore`).
- **`components/Select.tsx`** — Added `story_type_changed` event when user selects a story category.
- **`components/posts/Post.tsx`** — Added `post_tapped`, `external_link_opened`, and `comments_viewed` events.
- **`components/posts/Posts.tsx`** — Added `stories_page_loaded` event on infinite scroll page load.
- **`components/comments/comments.tsx`** — Added `comments_page_loaded` event on infinite scroll page load.
- **`app/[itemId].tsx`** — Added `item_upvoted`, `user_profile_viewed`, and `external_link_opened` events.

## Events instrumented

| Event Name | Description | File |
|---|---|---|
| `story_type_changed` | User switches between story categories (Top, Best, Ask, Show) | `components/Select.tsx` |
| `post_tapped` | User taps a post title to open it | `components/posts/Post.tsx` |
| `external_link_opened` | User opens an external URL from a post or item detail | `components/posts/Post.tsx`, `app/[itemId].tsx` |
| `comments_viewed` | User navigates to the item detail view to read comments | `components/posts/Post.tsx` |
| `item_upvoted` | User taps the upvote button on a post or item detail | `app/[itemId].tsx` |
| `user_profile_viewed` | User navigates to a Hacker News user profile page | `app/[itemId].tsx` |
| `stories_page_loaded` | User scrolls to bottom of story list, triggering next page | `components/posts/Posts.tsx` |
| `comments_page_loaded` | User scrolls to bottom of comments list, triggering next page | `components/comments/comments.tsx` |

## Next steps

Visit your PostHog project to build dashboards and insights based on the events above:

- [PostHog Project Dashboard](https://us.posthog.com/project/238460/dashboard)
- [Insights — story_type_changed](https://us.posthog.com/project/238460/insights?insight=TRENDS&events=%5B%7B%22id%22%3A%22story_type_changed%22%7D%5D)
- [Insights — post_tapped](https://us.posthog.com/project/238460/insights?insight=TRENDS&events=%5B%7B%22id%22%3A%22post_tapped%22%7D%5D)
- [Insights — external_link_opened](https://us.posthog.com/project/238460/insights?insight=TRENDS&events=%5B%7B%22id%22%3A%22external_link_opened%22%7D%5D)
- [Insights — item_upvoted](https://us.posthog.com/project/238460/insights?insight=TRENDS&events=%5B%7B%22id%22%3A%22item_upvoted%22%7D%5D)

Suggested funnel to create: **Post Engagement Funnel** — `post_tapped` → `comments_viewed` → `item_upvoted`. This shows how many users go from discovering a post to engaging with it.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-expo/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
