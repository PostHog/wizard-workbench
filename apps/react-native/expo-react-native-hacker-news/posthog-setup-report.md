<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Hacker News React Native (Expo) app. Here is a summary of every change made:

- **`app.config.js`** (new): Converts the static `app.json` to a dynamic config that injects `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from environment variables into `Constants.expoConfig.extra` at build time. Also registers the `expo-localization` plugin.
- **`.env`** (new): Stores `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` locally. Covered by `.gitignore`.
- **`src/config/posthog.ts`** (new): Initialises the `PostHog` client from `expo-constants`, with lifecycle event capture, batching, and feature-flag preloading. Analytics are automatically disabled when no token is configured.
- **`app/_layout.tsx`**: Wraps the app in `PostHogProvider` (with touch autocapture enabled). A `ScreenTracker` component tracks every route change via `usePathname` + `useEffect`, emitting `posthog.screen()` calls for manual screen tracking compatible with Expo Router.
- **`components/posts/Post.tsx`**: Tracks `post_opened`, `upvote_tapped`, `post_comments_opened`, and `external_link_opened`.
- **`components/Select.tsx`**: Tracks `story_type_changed` when the user picks a different feed category.
- **`app/[itemId].tsx`**: Tracks `item_external_link_opened` when the user opens an item's external URL from the detail page.
- **`app/users/[userId].tsx`**: Tracks `user_profile_viewed` on mount.
- **`components/comments/comment.tsx`**: Tracks `comment_thread_opened` when the user navigates into a comment's thread.

## Events

| Event | Description | File |
|---|---|---|
| `story_type_changed` | User switches the story feed type (top, best, ask, show) using the filter selector | `components/Select.tsx` |
| `post_opened` | User taps a post title to open it — either navigates to item details or opens external URL | `components/posts/Post.tsx` |
| `external_link_opened` | User opens an external URL from the post link button in the feed | `components/posts/Post.tsx` |
| `post_comments_opened` | User taps the comments button on a post in the feed to view the comment thread | `components/posts/Post.tsx` |
| `item_external_link_opened` | User opens the external URL from the item detail page | `app/[itemId].tsx` |
| `user_profile_viewed` | User navigates to a user's profile page | `app/users/[userId].tsx` |
| `comment_thread_opened` | User taps the comments button on a comment to view its thread | `components/comments/comment.tsx` |
| `upvote_tapped` | User taps the upvote button on a post (intent signal — no actual vote is cast) | `components/posts/Post.tsx` |

## Next steps

Create an **"Analytics basics"** dashboard at https://us.posthog.com/project/2/dashboard with these recommended insights:

1. **Post engagement funnel** — Funnel: `post_opened` → `post_comments_opened` — measures how many users go from viewing a post to reading its comments.
2. **External link click rate** — `external_link_opened` + `item_external_link_opened` event count over time — shows how often users leave the app to read full articles.
3. **Story type popularity** — Breakdown of `story_type_changed` by `story_type` property — reveals which feed (top/best/ask/show) users prefer.
4. **User profile engagement** — `user_profile_viewed` unique users over time — tracks how often users explore author profiles.
5. **Upvote intent** — `upvote_tapped` event count trend — measures voting engagement even though no vote is submitted to HN.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-expo/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
