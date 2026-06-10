<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Hacker Native Expo app. Here is a summary of what was added:

- **`src/config/posthog.ts`** — New PostHog client configured via `expo-constants` and `app.config.js` extras. Reads `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from environment variables. Disables tracking gracefully when the token is not set.
- **`app.config.js`** — New config file (replaces `app.json` as the active Expo config) that exposes `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` as `extra` fields accessible via `Constants.expoConfig?.extra`.
- **`.env`** — Created with `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` values.
- **`app/_layout.tsx`** — Added `PostHogProvider` wrapping the app tree with autocapture (touch events enabled, screen autocapture disabled for manual tracking). Added `useEffect` with `usePathname` / `useGlobalSearchParams` to manually track screen views via `posthog.screen()` on every route change.
- **`app/index.tsx`** — Captures `story_type_changed` when the user switches between story feeds.
- **`components/posts/Post.tsx`** — Captures `story_clicked`, `external_link_opened`, `story_upvoted`, and `comments_button_tapped`.
- **`components/posts/Posts.tsx`** — Captures `more_stories_loaded` on infinite scroll pagination.
- **`app/[itemId].tsx`** — Captures `item_upvoted`, `item_external_link_opened`, and `parent_item_viewed`.
- **`app/users/[userId].tsx`** — Captures `user_profile_viewed` on mount.
- **`components/posts/user-activities/UserActivities.tsx`** — Captures `more_user_activities_loaded` on infinite scroll pagination.

## Events

| Event name | Description | File |
|---|---|---|
| `story_type_changed` | User switches between Top Stories, Best Stories, Ask Stories, or Show Stories feeds | `app/index.tsx` |
| `story_clicked` | User taps a story title to view its details and comments | `components/posts/Post.tsx` |
| `external_link_opened` | User opens the external URL of a story from the post list | `components/posts/Post.tsx` |
| `story_upvoted` | User taps the upvote button on a story in the post list | `components/posts/Post.tsx` |
| `comments_button_tapped` | User taps the comments count button on a post to navigate to its detail/comments view | `components/posts/Post.tsx` |
| `more_stories_loaded` | User scrolls to the end of the story list and the next page is fetched | `components/posts/Posts.tsx` |
| `item_upvoted` | User taps the upvote button on an item in its detail view | `app/[itemId].tsx` |
| `item_external_link_opened` | User opens the external URL of a story from the item detail screen | `app/[itemId].tsx` |
| `parent_item_viewed` | User taps the 'Commented on' banner to navigate to the parent item | `app/[itemId].tsx` |
| `user_profile_viewed` | User navigates to view a HN user's profile | `app/users/[userId].tsx` |
| `more_user_activities_loaded` | User scrolls to load the next page of a user's submitted activities | `components/posts/user-activities/UserActivities.tsx` |

## Next steps

We recommend creating an **"Analytics basics (wizard)"** dashboard in PostHog with these insights:

1. **Story engagement over time** — Trends of `story_clicked` + `external_link_opened` to understand daily content engagement.
2. **Story type preferences** — Breakdown of `story_type_changed` by `to_type` property to see which feed is most popular.
3. **Upvote engagement** — Trends of `story_upvoted` + `item_upvoted` combined to measure voting activity.
4. **Deep-reading funnel** — Funnel from `story_clicked` → `comments_button_tapped` → `item_external_link_opened` to measure how deep users go.
5. **User profile discovery** — Trends of `user_profile_viewed` to measure community exploration.

To create this dashboard, go to [PostHog Dashboards](https://us.posthog.com/project/2/dashboards) and click **New dashboard**.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-expo/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
