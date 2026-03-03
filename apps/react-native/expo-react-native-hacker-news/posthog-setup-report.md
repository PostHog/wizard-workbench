<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Hacker Native Expo React Native app. The integration includes SDK setup, screen tracking, and 10 custom events covering the core user engagement flows.

## Changes summary

- **`app.config.js`** (new): Converts `app.json` to JS config, adds `extra.posthogApiKey` and `extra.posthogHost` read from environment variables.
- **`.env`** (new): Stores `POSTHOG_API_KEY` and `POSTHOG_HOST` (gitignore-covered).
- **`lib/posthog.ts`** (new): PostHog client singleton using `expo-constants` to read config extras. Enables lifecycle tracking and debug mode in development.
- **`app/_layout.tsx`** (edited): Wraps the app in `PostHogProvider` with autocapture enabled for touches. Adds manual screen tracking via `posthog.screen()` on route changes using `usePathname` + `useGlobalSearchParams`.
- **`components/posts/Post.tsx`** (edited): Captures `post_opened` (internal navigation) and `external_link_opened` (URL open).
- **`components/posts/Posts.tsx`** (edited): Captures `more_stories_loaded` when infinite scroll triggers the next page.
- **`components/Select.tsx`** (edited): Captures `story_type_changed` with `from_type` and `to_type` properties.
- **`components/comments/comment.tsx`** (edited): Captures `user_profile_viewed` and `comment_thread_opened`.
- **`components/comments/comments.tsx`** (edited): Captures `more_comments_loaded` when scrolling to load more comments.
- **`app/[itemId].tsx`** (edited): Captures `item_external_link_opened`, `item_author_viewed`, and `parent_item_navigated`.

## Events

| Event name | Description | File |
|---|---|---|
| `post_opened` | User taps a post title to view its detail page (internal navigation) | `components/posts/Post.tsx` |
| `external_link_opened` | User taps an external URL link on a post from the feed | `components/posts/Post.tsx` |
| `story_type_changed` | User selects a different story feed category (top, best, ask, show) | `components/Select.tsx` |
| `user_profile_viewed` | User taps on a username in a comment to view that user's profile | `components/comments/comment.tsx` |
| `comment_thread_opened` | User taps the comment count button to view a nested comment thread | `components/comments/comment.tsx` |
| `item_external_link_opened` | User taps the external URL link on the item detail page | `app/[itemId].tsx` |
| `item_author_viewed` | User taps the author name on the item detail page to navigate to their profile | `app/[itemId].tsx` |
| `parent_item_navigated` | User taps the parent item banner on a comment detail to navigate up the thread | `app/[itemId].tsx` |
| `more_stories_loaded` | User scrolls to the bottom of the feed, triggering the next page of stories | `components/posts/Posts.tsx` |
| `more_comments_loaded` | User scrolls to the bottom of the comments list, triggering more comments to load | `components/comments/comments.tsx` |

## Next steps

To monitor user behavior, create an **"Analytics basics"** dashboard in PostHog with these suggested insights:

1. **Post engagement trend** — Trend chart of `post_opened` over time, split by internal vs external (where `external_link_opened` is the external path).
2. **Story type popularity** — Bar chart of `story_type_changed` broken down by `to_type` property — shows which feed types users prefer.
3. **Content engagement funnel** — Funnel from `post_opened` → `comment_thread_opened` → `more_comments_loaded`, showing how deeply users engage with discussions.
4. **External link click rate** — Trend of `external_link_opened` and `item_external_link_opened` combined, showing how often users leave the app to read articles.
5. **User exploration** — Count of `user_profile_viewed` and `item_author_viewed` over time, indicating social curiosity and community engagement.

To create the dashboard, log in to PostHog at https://us.i.posthog.com and navigate to **Dashboards → New dashboard**.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-expo/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
