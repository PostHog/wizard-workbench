<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Hacker Native Expo app. The integration includes the PostHog React Native SDK (`posthog-react-native`), manual screen tracking via Expo Router's `usePathname`, autocapture for touch events, and nine custom events covering the core user interactions in the app.

**Files created or modified:**

- `app.config.js` — Converts `app.json` to a dynamic config that reads `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from environment variables and exposes them via `expo-constants` extras.
- `.env` — Created with `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` values.
- `src/config/posthog.ts` — PostHog client singleton configured using `expo-constants` extras.
- `app/_layout.tsx` — Wrapped the app in `PostHogProvider` (with touch autocapture) and added manual screen tracking with `usePathname`/`useGlobalSearchParams`.
- `components/Select.tsx` — Captures `story_type_changed` when the user switches feed filters.
- `components/posts/Post.tsx` — Captures `post_opened`, `external_link_opened`, and `item_upvoted`.
- `components/comments/comment.tsx` — Captures `comment_upvoted`, `user_profile_viewed`, and `comment_thread_opened`.
- `app/[itemId].tsx` — Captures `item_external_link_opened` and `parent_item_navigated`.

## Events instrumented

| Event name | Description | File |
|---|---|---|
| `story_type_changed` | User switches the feed between Top, Best, Ask, or Show stories | `components/Select.tsx` |
| `post_opened` | User taps a post title or comment button to open its detail view | `components/posts/Post.tsx` |
| `external_link_opened` | User opens an external URL from a post in the browser (from feed) | `components/posts/Post.tsx` |
| `item_upvoted` | User taps the upvote button on a post in the feed | `components/posts/Post.tsx` |
| `comment_upvoted` | User taps the upvote button on a comment | `components/comments/comment.tsx` |
| `user_profile_viewed` | User navigates to a HN user's profile by tapping their username | `components/comments/comment.tsx` |
| `comment_thread_opened` | User navigates to a nested comment thread from within a comment | `components/comments/comment.tsx` |
| `item_external_link_opened` | User opens the external URL from the item detail view | `app/[itemId].tsx` |
| `parent_item_navigated` | User taps 'Commented on' to navigate to the parent item of a comment | `app/[itemId].tsx` |

## Next steps

The PostHog MCP API key used during setup lacked the `dashboard:write`, `insight:write`, and `query:read` scopes needed to create the "Analytics basics" dashboard automatically. To create it manually, go to [Dashboards](/dashboards) in your PostHog project and add the following insights:

1. **Post engagement over time** — Trends chart with `post_opened` and `external_link_opened` events to track read vs. click-through behavior.
2. **Story type popularity** — Trends chart of `story_type_changed` broken down by `story_type` property to see which feed (Top/Best/Ask/Show) users prefer.
3. **Upvote activity** — Trends chart comparing `item_upvoted` and `comment_upvoted` to gauge engagement depth.
4. **User profile exploration** — Trends chart of `user_profile_viewed` to understand how often users explore author profiles.
5. **Comment thread engagement funnel** — Funnel from `post_opened` → `comment_thread_opened` to measure how many readers dive into comment threads.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-expo/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
