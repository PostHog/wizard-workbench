<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your Hacker Native Expo app. Here's a summary of what was added:

## What changed

- **`app.config.js`** — Converted from `app.json` to a JS config that reads `POSTHOG_API_KEY` and `POSTHOG_HOST` from environment variables and exposes them via `extra` to the app at build time.
- **`src/config/posthog.ts`** — New PostHog client singleton configured via `expo-constants` extras, with app lifecycle capture, batched flushing, and graceful degradation when no API key is set.
- **`app/_layout.tsx`** — Wrapped the app in `PostHogProvider` with autocapture (touch events enabled, screen capture disabled for manual tracking). A `ScreenTracker` component uses `usePathname` and `useGlobalSearchParams` to manually track screen views with Expo Router.
- **`.env`** — Created with `EXPO_PUBLIC_POSTHOG_API_KEY` and `EXPO_PUBLIC_POSTHOG_HOST` (read by `app.config.js`).
- **`components/Select.tsx`** — Captures `story_type_changed` when the user switches between story categories.
- **`components/posts/Post.tsx`** — Captures `post_tapped` (navigate to detail), `post_external_link_opened` (open URL from list), and `item_comments_viewed` (open comments).
- **`components/posts/Posts.tsx`** — Captures `more_stories_loaded` when the user scrolls to the bottom and loads the next page.
- **`app/[itemId].tsx`** — Captures `user_profile_viewed` (tap author name) and `item_external_link_opened` (open URL from detail screen).
- **`components/comments/comments.tsx`** — Captures `more_comments_loaded` when the user scrolls to load more comments.
- **`components/comments/comment.tsx`** — Captures `comment_author_profile_viewed` when the user taps an author name in a comment.

## Events instrumented

| Event | Description | File |
|-------|-------------|------|
| `story_type_changed` | User switched between story categories (Top, Best, Ask, Show) | `components/Select.tsx` |
| `post_tapped` | User tapped a post title to navigate to details | `components/posts/Post.tsx` |
| `post_external_link_opened` | User opened an external URL from the post list | `components/posts/Post.tsx` |
| `item_comments_viewed` | User navigated to item detail/comments via the comments button | `components/posts/Post.tsx` |
| `more_stories_loaded` | User scrolled to load next page of stories | `components/posts/Posts.tsx` |
| `item_external_link_opened` | User opened the external link from item detail screen | `app/[itemId].tsx` |
| `user_profile_viewed` | User tapped an author name to view their profile | `app/[itemId].tsx` |
| `more_comments_loaded` | User scrolled to load next page of comments | `components/comments/comments.tsx` |
| `comment_author_profile_viewed` | User tapped an author name in a comment | `components/comments/comment.tsx` |

## Next steps

We've outlined the key insights to build in your PostHog dashboard. Create an **"Analytics basics"** dashboard at [https://us.posthog.com/project/2/dashboard](https://us.posthog.com/project/2/dashboard) and add these five insights:

1. **Story type preference** — Trend of `story_type_changed` grouped by `story_type` property. Understand which feed categories users prefer.

2. **Content engagement funnel** — Funnel: `post_tapped` → `item_comments_viewed`. Shows what percentage of post views lead to reading comments.

3. **External link click rate** — Trend comparing `post_external_link_opened` + `item_external_link_opened` vs `post_tapped`. Reveals whether users prefer reading discussion or visiting the original source.

4. **User profile engagement** — Trend of `user_profile_viewed` + `comment_author_profile_viewed`. Shows how often readers explore author profiles, a signal of community interest.

5. **Scroll depth / pagination** — Trend of `more_stories_loaded` and `more_comments_loaded`. Shows how engaged users are — frequent next-page loads indicate high retention.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
