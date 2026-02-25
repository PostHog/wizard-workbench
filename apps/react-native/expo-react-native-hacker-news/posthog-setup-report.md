<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the **Hacker Native** React Native Expo app — a Hacker News client built with Expo Router, TanStack Query, and TypeScript.

## Summary of Changes

- **`app.config.js`** (new) — Dynamic Expo config that reads `POSTHOG_API_KEY` and `POSTHOG_HOST` from the environment at build time and exposes them via `expo-constants` extras. Replaces static `app.json` configuration.
- **`src/config/posthog.ts`** (new) — PostHog client singleton configured with lifecycle event capture, batching, feature flags, and graceful disabling when the API key is not set.
- **`app/_layout.tsx`** — Wrapped the app in `PostHogProvider` with autocapture (touches enabled, screens disabled for manual tracking). Added manual screen tracking via `usePathname` + `useGlobalSearchParams` in a `useEffect`.
- **`app/index.tsx`** — Added `story_list_viewed` event on mount and `story_type_changed` event when the user switches story types.
- **`components/posts/Post.tsx`** — Added `post_opened`, `external_link_opened`, and `comment_thread_opened` events with contextual properties (item ID, title, score, comment count, domain).
- **`components/posts/Posts.tsx`** — Added `more_stories_loaded` event with story type and current page number when the user triggers infinite scroll pagination.
- **`app/users/[userId].tsx`** — Added `user_profile_viewed` event once user data loads, with `profile_user_id` and `karma` properties.
- **`components/comments/comment.tsx`** — Added `upvote_tapped` event on the upvote button press (alongside existing haptic feedback), and `user_profile_viewed` when tapping a username in comments.
- **`.env`** — Created with `POSTHOG_API_KEY` and `POSTHOG_HOST` values (git-ignored).

## Events Instrumented

| Event Name | Description | File |
|---|---|---|
| `story_list_viewed` | User views the story list — top of the content funnel | `app/index.tsx` |
| `story_type_changed` | User switches between story types (Top, Best, Ask, Show) | `app/index.tsx` |
| `post_opened` | User taps a post title to view its details and comments | `components/posts/Post.tsx` |
| `external_link_opened` | User opens an external URL from a post | `components/posts/Post.tsx` |
| `comment_thread_opened` | User taps the comments button to view a post's thread | `components/posts/Post.tsx` |
| `user_profile_viewed` | User views a HN user's profile page | `app/users/[userId].tsx`, `components/comments/comment.tsx` |
| `upvote_tapped` | User taps the upvote button on a comment | `components/comments/comment.tsx` |
| `more_stories_loaded` | User scrolls to trigger loading of additional stories | `components/posts/Posts.tsx` |

## Next Steps

We've designed insights and a dashboard for you to keep an eye on user engagement, based on the events we just instrumented. Create an **"Analytics basics"** dashboard at https://us.posthog.com/project/238460/dashboard with the following 5 insights:

### Suggested Insights

1. **Content Engagement Funnel** — Funnel: `story_list_viewed` → `post_opened` → `comment_thread_opened`
   - Shows how many users go from browsing to reading to engaging with comments
   - https://us.posthog.com/project/238460/insights/new#funnel

2. **Story Type Popularity** — Trend of `story_type_changed` broken down by `story_type` property
   - Shows which story categories (Top, Best, Ask, Show) users navigate to most
   - https://us.posthog.com/project/238460/insights/new#trends

3. **External vs Internal Content Preference** — Trends: `external_link_opened` vs `post_opened`
   - Shows whether users prefer external articles or internal discussion threads
   - https://us.posthog.com/project/238460/insights/new#trends

4. **Engagement Actions Over Time** — Trends: `upvote_tapped` + `comment_thread_opened`
   - Tracks active user engagement (upvoting, comment reading) day by day
   - https://us.posthog.com/project/238460/insights/new#trends

5. **User Profile Exploration** — Trend of `user_profile_viewed`
   - Monitors how often users explore community member profiles
   - https://us.posthog.com/project/238460/insights/new#trends

### Dashboard
- Project: https://us.posthog.com/project/238460/dashboard

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-expo/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
