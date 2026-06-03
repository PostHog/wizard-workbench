<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Hacker Native (Expo React Native) app. Here is a summary of all changes made:

- **`app.config.js`** (new) — Converted `app.json` to a dynamic JS config that reads `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from environment variables and exposes them via `Constants.expoConfig.extra`.
- **`.env`** (new) — Environment file with `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` values (already gitignored).
- **`src/config/posthog.ts`** (new) — PostHog client singleton configured via `expo-constants`, with lifecycle event capture, batching, and a graceful disabled mode when the token is missing.
- **`app/_layout.tsx`** (updated) — Added `PostHogProvider` wrapping the app tree with autocapture for touches. Manual screen tracking using `posthog.screen()` fires on every pathname change via `useEffect`.
- **`components/posts/Post.tsx`** (updated) — Tracks story_opened, story_external_link_opened, story_upvoted, and story_comments_opened on user interactions.
- **`components/Select.tsx`** (updated) — Tracks story_feed_changed when the user switches between Top/Best/Ask/Show story feeds.
- **`app/[itemId].tsx`** (updated) — Tracks item_upvoted, item_external_link_opened, user_profile_viewed, and parent_item_navigated on the item detail screen.
- **`components/posts/Posts.tsx`** (updated) — Tracks more_stories_loaded when the user reaches the end of the feed and triggers pagination.

Packages installed: `posthog-react-native`, `expo-file-system`, `expo-application`, `expo-device`, `expo-localization`.

## Events

| Event | Description | File |
|---|---|---|
| `story_feed_changed` | User switches the story feed type (top, best, ask, show) | `components/Select.tsx` |
| `story_opened` | User taps a story to open its details/comments view | `components/posts/Post.tsx` |
| `story_external_link_opened` | User opens a story's external URL from the feed | `components/posts/Post.tsx` |
| `story_upvoted` | User taps the upvote button on a story card in the feed | `components/posts/Post.tsx` |
| `story_comments_opened` | User taps the comments button on a story card in the feed | `components/posts/Post.tsx` |
| `item_external_link_opened` | User opens the external URL of an item from its detail screen | `app/[itemId].tsx` |
| `item_upvoted` | User taps the upvote button on the item detail screen | `app/[itemId].tsx` |
| `user_profile_viewed` | User taps on an author's username to view their HN profile | `app/[itemId].tsx` |
| `parent_item_navigated` | User taps the 'Commented on' breadcrumb to navigate to the parent item | `app/[itemId].tsx` |
| `more_stories_loaded` | User scrolls to the bottom and triggers loading the next page of stories | `components/posts/Posts.tsx` |

## Next steps

The PostHog API key used during setup lacked `dashboard:write` and `insight:write` scopes, so the dashboard could not be created automatically. You can build it manually in PostHog — here are the recommended insights:

1. **Story feed engagement** — Trends of `story_opened` + `story_external_link_opened` over time, broken down by feed type (`story_feed_changed` property `feed_type`).
2. **Story upvote funnel** — Funnel: `story_opened` → `story_upvoted` to measure what % of users who open a story also upvote it.
3. **Content engagement by type** — Trend of `story_opened` vs `item_external_link_opened` to see whether users prefer reading discussions or visiting external links.
4. **Pagination / scroll depth** — Trend of `more_stories_loaded` with breakdown by `feed_type` to understand which feeds drive deeper browsing sessions.
5. **User profile curiosity** — Trend of `user_profile_viewed` to measure interest in author profiles over time.

You can create these in [PostHog Insights](/insights) and group them into a new dashboard named "Analytics basics" at [/dashboard](/dashboard).

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-expo/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
