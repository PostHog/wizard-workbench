<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Hacker Native Expo app. The following changes were made:

- **`src/config/posthog.ts`** (new): PostHog client singleton configured via `expo-constants` / `app.config.js` extras. Reads `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from environment variables at build time.
- **`app.config.js`** (new): Replaces `app.json` as the Expo config entry point; injects PostHog token and host from `.env` into `Constants.expoConfig.extra`.
- **`.env`** (new): Stores `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` values (git-ignored).
- **`app/_layout.tsx`** (modified): Wraps the app with `PostHogProvider`, enables autocapture for touch events, and manually tracks screen changes with `posthog.screen()` using Expo Router's `usePathname`.
- **`components/posts/Post.tsx`** (modified): Captures `post_opened`, `external_link_opened`, `upvote_tapped`, and `comments_opened` events.
- **`components/posts/Posts.tsx`** (modified): Captures `story_list_paginated` when infinite scroll loads a new page.
- **`components/Select.tsx`** (modified): Captures `story_type_changed` when the user switches feed categories.
- **`app/[itemId].tsx`** (modified): Captures `user_profile_viewed` when tapping an author name, and `item_external_link_opened` when opening a post's external URL from the detail screen.

## Events instrumented

| Event | Description | File |
|---|---|---|
| `story_type_changed` | User changed the story feed type (top, best, ask, show) | `components/Select.tsx` |
| `post_opened` | User navigated to a post's detail view | `components/posts/Post.tsx` |
| `external_link_opened` | User opened an external URL from a post in the list | `components/posts/Post.tsx` |
| `upvote_tapped` | User tapped the upvote button on a post | `components/posts/Post.tsx` |
| `comments_opened` | User tapped the comments button to view discussion | `components/posts/Post.tsx` |
| `story_list_paginated` | Infinite scroll triggered to load more stories | `components/posts/Posts.tsx` |
| `item_external_link_opened` | User opened an external URL from the item detail screen | `app/[itemId].tsx` |
| `user_profile_viewed` | User navigated to view a Hacker News user profile | `app/[itemId].tsx` |

## Next steps

### Dashboard setup

Create a dashboard named **"Analytics basics"** in your PostHog project at https://us.posthog.com/project/238460/dashboard and add the following insights:

1. **Content engagement funnel** — Funnel: `post_opened` → `comments_opened` → `external_link_opened`. Shows what percentage of users who open a post go on to read comments or visit the source link.

2. **Story type popularity** — Trend of `story_type_changed` broken down by `story_type` property. Shows which feed categories (top/best/ask/show) users prefer.

3. **Upvote engagement rate** — Trend of `upvote_tapped` vs `post_opened`. Measures how often users engage with the upvote button relative to story views.

4. **User profile discovery** — Trend of `user_profile_viewed` broken down by `username`. Highlights which HN authors drive the most profile visits.

5. **Pagination depth** — Trend of `story_list_paginated` broken down by `page` property. Shows how deep users scroll into story feeds.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
