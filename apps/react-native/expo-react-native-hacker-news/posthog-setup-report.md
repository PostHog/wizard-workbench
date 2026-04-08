<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Hacker Native Expo app. The integration covers SDK initialization, automatic screen tracking via Expo Router, autocapture of touch events, and manual event tracking for key user interactions across 5 files.

## Summary of changes

- **`app.config.js`** — Created to replace `app.json`, adding `extra.posthogProjectToken` and `extra.posthogHost` from environment variables so the token is never hardcoded.
- **`.env`** — Created with `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` (covered by `.gitignore`).
- **`src/config/posthog.ts`** — New PostHog client singleton reading config from `expo-constants`.
- **`app/_layout.tsx`** — Wrapped the app in `PostHogProvider` with autocapture enabled (touch events, `testID` props). Added a `ScreenTracker` component for manual screen tracking using `usePathname` and `useGlobalSearchParams` from Expo Router.
- **`components/Select.tsx`** — Tracks `story_type_changed` when the user picks a story category.
- **`components/posts/Post.tsx`** — Tracks `post_opened` (internal navigation) and `post_external_link_opened` (external URL taps).
- **`app/[itemId].tsx`** — Tracks `item_upvoted` (upvote button tap) and `item_external_link_opened` (external link on item detail).
- **`app/users/[userId].tsx`** — Tracks `user_profile_viewed` on mount when a user navigates to another user's profile.
- **`components/comments/comment.tsx`** — Tracks `comment_thread_opened` when navigating into a comment sub-thread.

## Events

| Event | Description | File |
|---|---|---|
| `story_type_changed` | User switches the story category filter (top, best, ask, show stories) | `components/Select.tsx` |
| `post_opened` | User taps a post to open its detail/comments view | `components/posts/Post.tsx` |
| `post_external_link_opened` | User opens the external URL linked to a post from the post list | `components/posts/Post.tsx` |
| `item_upvoted` | User taps the upvote button on an item detail page | `app/[itemId].tsx` |
| `item_external_link_opened` | User opens the external URL linked to an item on the detail page | `app/[itemId].tsx` |
| `user_profile_viewed` | User navigates to another user's profile page | `app/users/[userId].tsx` |
| `comment_thread_opened` | User navigates into a comment's sub-thread from a comment in the list | `components/comments/comment.tsx` |

## Next steps

We recommend building an "Analytics basics" dashboard in PostHog with the following insights:

1. **Posts opened over time** — Trends on `post_opened`, daily over the last 30 days. Tracks core content engagement.
2. **Story type popularity** — Trends on `story_type_changed` broken down by `story_type` property. Shows which feed categories users prefer.
3. **Content engagement funnel** — Funnel: `post_opened` → `item_upvoted`. Measures how often readers engage deeply with content.
4. **External link click rate** — Trends on `post_external_link_opened` and `item_external_link_opened` combined. Shows outbound traffic intent.
5. **User profile exploration** — Trends on `user_profile_viewed`. Indicates social browsing behavior.

You can create this dashboard here: https://us.posthog.com/project/2/dashboard

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
