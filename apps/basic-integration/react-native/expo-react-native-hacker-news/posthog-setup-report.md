<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Hacker Native Expo app. The following changes were made:

- **`app.config.js`** — Created dynamic Expo config (replacing static `app.json`) to expose PostHog credentials via `Constants.expoConfig.extra`. Adds the `expo-localization` plugin required by the PostHog SDK.
- **`src/config/posthog.ts`** — New PostHog client module initialized with SDK options including app lifecycle capture, batching, and debug mode in development. Reads credentials from `expo-constants`.
- **`.env`** — Created with `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` environment variables.
- **`app/_layout.tsx`** — Wraps the app with `PostHogProvider` (autocapture for touches, manual screen tracking) and manually tracks screen changes via `posthog.screen()` on every route transition using expo-router's `usePathname`.
- **`components/Select.tsx`** — Captures `story_category_changed` when the user switches between story types.
- **`components/posts/Post.tsx`** — Captures `post_opened`, `external_link_opened`, `post_upvote_tapped`, and `post_comments_opened`.
- **`app/[itemId].tsx`** — Captures `item_details_viewed` on mount, `item_upvote_tapped`, and `item_external_link_opened`.
- **`app/users/[userId].tsx`** — Captures `user_profile_viewed` when a profile loads.
- **`components/comments/comment.tsx`** — Captures `comment_upvote_tapped` and `comment_thread_opened`.
- **`components/posts/Posts.tsx`** — Captures `more_stories_loaded` on infinite scroll pagination.

| Event | Description | File |
|---|---|---|
| `story_category_changed` | User switches between story categories (top, best, ask, show) | `components/Select.tsx` |
| `post_opened` | User navigates to the internal details page of a post | `components/posts/Post.tsx` |
| `external_link_opened` | User taps an external URL on a post to open in browser | `components/posts/Post.tsx` |
| `post_upvote_tapped` | User taps the upvote button on a post in the list | `components/posts/Post.tsx` |
| `post_comments_opened` | User taps the comments button on a post | `components/posts/Post.tsx` |
| `item_details_viewed` | User views the item details screen | `app/[itemId].tsx` |
| `item_external_link_opened` | User opens the external URL from the item details screen | `app/[itemId].tsx` |
| `item_upvote_tapped` | User taps the upvote button on the item details screen | `app/[itemId].tsx` |
| `user_profile_viewed` | User navigates to another user's profile page | `app/users/[userId].tsx` |
| `comment_thread_opened` | User navigates into a nested comment thread | `components/comments/comment.tsx` |
| `comment_upvote_tapped` | User taps the upvote button on a comment | `components/comments/comment.tsx` |
| `more_stories_loaded` | User scrolls to end of list triggering pagination | `components/posts/Posts.tsx` |

## Next steps

Create an "Analytics basics" dashboard in PostHog with insights based on these events:

- **[Content Engagement Funnel](/insights/new?insight=FUNNELS)** — `post_opened` → `item_details_viewed` → `item_external_link_opened` to measure how many users progress from browsing to reading to clicking through.
- **[Story Category Popularity](/insights/new?insight=TRENDS)** — Trend of `story_category_changed` broken down by `category` property to see which story types users prefer.
- **[External Links Opened](/insights/new?insight=TRENDS)** — Combined trend of `external_link_opened` + `item_external_link_opened` to track outbound click volume over time.
- **[Comment Engagement](/insights/new?insight=TRENDS)** — `comment_upvote_tapped` and `comment_thread_opened` trends to measure comment section engagement.
- **[Pagination Depth](/insights/new?insight=TRENDS)** — `more_stories_loaded` trend to understand how deeply users scroll through story lists.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-expo/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
