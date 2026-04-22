<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Hacker Native Expo app. Here is a summary of all changes made:

- **`app.config.js`** (new): Replaces `app.json` as the Expo config entrypoint. Adds an `extra` block that reads `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from environment variables at build time and makes them available via `expo-constants`.
- **`.env`** (new): Contains `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` values (gitignored).
- **`src/config/posthog.ts`** (new): Creates and exports the PostHog client instance, configured via `Constants.expoConfig.extra`. Enables app lifecycle capture, batched flushing, and debug mode in dev.
- **`app/_layout.tsx`** (updated): Wraps the app in `PostHogProvider` with autocapture enabled. Adds a `ScreenTracker` component that fires `posthog.screen()` on each route change using `usePathname` and `useGlobalSearchParams`.
- **`components/posts/Post.tsx`** (updated): Tracks `post_tapped`, `post_upvoted`, and `post_external_link_opened` events with relevant properties (`post_id`, `post_title`, `score`, `url`, `host`).
- **`components/Select.tsx`** (updated): Tracks `story_type_changed` event when the user switches feed categories, including the previous and new story type.
- **`app/[itemId].tsx`** (updated): Tracks `item_comments_viewed` on page load (once per item), `item_upvoted`, and `item_external_link_opened`.
- **`app/users/[userId].tsx`** (updated): Tracks `user_profile_viewed` when a user profile loads, including karma and submitted count.

## Events

| Event | Description | File |
|---|---|---|
| `story_type_changed` | User switches the story feed type (top, best, ask, show) | `components/Select.tsx` |
| `post_tapped` | User taps a post title to open it (in-app or external URL) | `components/posts/Post.tsx` |
| `post_upvoted` | User taps the upvote button on a post in the feed | `components/posts/Post.tsx` |
| `post_external_link_opened` | User taps the external link button on a post in the feed | `components/posts/Post.tsx` |
| `item_comments_viewed` | User opens the item detail page with comments | `app/[itemId].tsx` |
| `item_upvoted` | User taps the upvote button on the item detail page | `app/[itemId].tsx` |
| `item_external_link_opened` | User taps the external URL link on the item detail page | `app/[itemId].tsx` |
| `user_profile_viewed` | User navigates to a Hacker News user's profile page | `app/users/[userId].tsx` |

## Next steps

To view your analytics, log in to PostHog and build insights using the events above. Recommended insights:

- **Content engagement funnel**: `post_tapped` → `item_comments_viewed` (measures how many users read comments after seeing a post)
- **Feed type popularity**: `story_type_changed` broken down by `story_type` property (shows which feeds users prefer)
- **Upvote trend**: `post_upvoted` + `item_upvoted` over time (tracks engagement momentum)
- **External link clicks**: `post_external_link_opened` + `item_external_link_opened` over time (tracks outbound traffic)
- **Profile exploration**: `user_profile_viewed` over time (shows community curiosity)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
