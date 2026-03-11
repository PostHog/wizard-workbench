# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Hacker Native app (an Expo React Native Hacker News reader). The integration covers SDK installation, provider setup, screen tracking, and six custom event capture points across the app's core user interactions.

**Changes made:**

- `app.config.js` — Converted from `app.json`; added `extra` field to expose `EXPO_PUBLIC_POSTHOG_API_KEY` and `EXPO_PUBLIC_POSTHOG_HOST` to the app at runtime via `expo-constants`.
- `src/config/posthog.ts` — New file. Configures and exports the PostHog singleton client. Reads API key and host from `Constants.expoConfig.extra`. Automatically disables analytics if the key is not set, with a warning.
- `app/_layout.tsx` — Wraps the entire app in `PostHogProvider` for context access via `usePostHog()`. Implements manual screen tracking using `usePathname` and `useGlobalSearchParams` from expo-router (required because expo-router uses react-navigation v7+, which is incompatible with PostHog's built-in `captureScreens` autocapture).
- `components/posts/Post.tsx` — Captures `post_opened` and `external_link_opened` events on user tap interactions.
- `components/Select.tsx` — Captures `story_type_changed` when the user switches between story feed categories (top, best, ask, show).
- `app/[itemId].tsx` — Captures `item_link_opened` when the user opens an external link on the item detail screen, and `parent_item_navigated` when navigating to the parent post.
- `app/users/[userId].tsx` — Captures `user_profile_viewed` once the user profile data is loaded.
- `.env` — Added `EXPO_PUBLIC_POSTHOG_API_KEY` and `EXPO_PUBLIC_POSTHOG_HOST`.

**Packages installed:** `posthog-react-native`, `expo-file-system`, `expo-application`, `expo-device`, `expo-localization`

| Event | Description | File |
|---|---|---|
| `post_opened` | User tapped on a post to view its details | `components/posts/Post.tsx` |
| `external_link_opened` | User tapped the external link on a post to open it in the browser | `components/posts/Post.tsx` |
| `story_type_changed` | User switched the story feed category (top, best, ask, show) | `components/Select.tsx` |
| `user_profile_viewed` | User navigated to a HN user's profile page | `app/users/[userId].tsx` |
| `item_link_opened` | User tapped the external URL link on an item detail page | `app/[itemId].tsx` |
| `parent_item_navigated` | User tapped the 'Commented on' card to navigate to the parent post | `app/[itemId].tsx` |

## Next steps

We've designed insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented. Create an **"Analytics basics"** dashboard in PostHog at https://us.posthog.com/project/2/dashboard and add the following insights:

1. **Daily post views (Trends)** — Trend of `post_opened` over time. Shows daily reading activity.
2. **Content engagement funnel (Funnel)** — Conversion from `post_opened` → `external_link_opened`. Shows how many users go from browsing to clicking through to source articles.
3. **Feed category distribution (Pie/Bar)** — Breakdown of `story_type_changed` by `to_story_type` property. Shows which feed categories (top/best/ask/show) are most popular.
4. **User profile curiosity (Trends)** — Trend of `user_profile_viewed` over time, alongside `post_opened`. Shows whether users explore authors after reading posts.
5. **Navigation depth (Trends)** — Trend of `parent_item_navigated` over time. A churn signal — users who navigate to parent posts are deeply engaged; a drop here may indicate content quality issues.

Dashboard: https://us.posthog.com/project/2/dashboard

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-expo/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
