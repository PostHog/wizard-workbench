<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Hacker News React Native Expo application. The following changes were made:

- **Installed** `posthog-react-native` SDK via npm
- **Created** `app.config.js` (converted from `app.json`) to expose PostHog configuration via `expo-constants` extras, reading API key and host from environment variables
- **Created** `src/config/posthog.ts` — the central PostHog client instance with lifecycle event capture, batching, and feature flag support
- **Updated** `app/_layout.tsx` — wrapped the app with `PostHogProvider` (with autocapture for touch events) and added manual screen tracking using `usePathname`/`useGlobalSearchParams` from Expo Router
- **Updated** `app/index.tsx` — captures `story_type_changed` when users switch between Top, Best, Ask, and Show story feeds
- **Updated** `components/posts/Post.tsx` — captures `post_clicked`, `post_external_link_opened`, and `post_comments_viewed` on user interaction with post items
- **Updated** `app/[itemId].tsx` — captures `item_external_link_opened` and `parent_item_navigated` events from the item detail screen
- **Updated** `components/comments/comment.tsx` — captures `user_profile_viewed` when a user taps a commenter's username
- **Updated** `components/posts/Posts.tsx` — captures `posts_next_page_loaded` on infinite scroll pagination
- **Updated** `components/comments/comments.tsx` — captures `comments_next_page_loaded` on infinite scroll pagination
- **Set** environment variables `EXPO_PUBLIC_POSTHOG_KEY` and `EXPO_PUBLIC_POSTHOG_HOST` in `.env`

## Events instrumented

| Event Name | Description | File |
|---|---|---|
| `post_clicked` | User taps on a post title to navigate to the item detail screen | `components/posts/Post.tsx` |
| `post_external_link_opened` | User taps the external link button on a post to open the URL in the browser | `components/posts/Post.tsx` |
| `post_comments_viewed` | User taps the comments button on a post to view its comment thread | `components/posts/Post.tsx` |
| `story_type_changed` | User changes the story feed type (e.g. top, best, ask, show) using the filter selector | `app/index.tsx` |
| `item_external_link_opened` | User opens the external link from the item detail screen | `app/[itemId].tsx` |
| `parent_item_navigated` | User taps the 'commented on' link to navigate to the parent item | `app/[itemId].tsx` |
| `user_profile_viewed` | User taps on a username to view the user's profile page | `components/comments/comment.tsx` |
| `posts_next_page_loaded` | User scrolls to the end of the post list, triggering the next page of posts to load | `components/posts/Posts.tsx` |
| `comments_next_page_loaded` | User scrolls to the end of the comments list, triggering the next page of comments to load | `components/comments/comments.tsx` |

## Next steps

To explore these events in PostHog, we recommend creating an **"Analytics basics"** dashboard with the following insights:

1. **Post engagement funnel** — Funnel from `post_clicked` → `post_comments_viewed` to see what % of post clicks lead to reading comments
2. **External link clicks** — Trend of `post_external_link_opened` + `item_external_link_opened` to see which posts drive the most outbound traffic
3. **Story type popularity** — Breakdown of `story_type_changed` by `new_story_type` property to see which feed type users prefer
4. **User profile exploration** — Trend of `user_profile_viewed` to understand how often users explore author profiles
5. **Content depth engagement** — Trend of `comments_next_page_loaded` and `posts_next_page_loaded` to measure how deeply users engage with content

You can create these insights at: https://us.posthog.com/project/2/insights

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
