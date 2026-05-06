<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Hacker Native Expo app. Here is a summary of all changes made:

**New files created:**
- `app.config.js` — Converts the static `app.json` to a dynamic JS config that injects PostHog credentials from `.env` into the Expo app via `expo-constants`. Values are exposed as `Constants.expoConfig.extra.posthogProjectToken` and `posthogHost`.
- `src/config/posthog.ts` — Initializes the PostHog client with app lifecycle event capture, batching settings, and graceful disabling when no token is configured.

**Modified files:**
- `app/_layout.tsx` — Wraps the app in `PostHogProvider` with touch autocapture enabled and manual screen tracking via a `ScreenTracker` component (required for expo-router).
- `components/posts/Post.tsx` — Tracks post opens, external link clicks, and upvote taps.
- `components/posts/Posts.tsx` — Tracks infinite scroll page loads.
- `components/Select.tsx` — Tracks story feed type changes.
- `app/[itemId].tsx` — Tracks author profile taps, external link opens from item details, and parent item navigation.
- `app/users/[userId].tsx` — Tracks user profile views.

| Event | Description | File |
|-------|-------------|------|
| `post_opened` | User taps a post title or comments button to open item details | `components/posts/Post.tsx` |
| `external_link_opened` | User opens an external source URL from a post | `components/posts/Post.tsx` |
| `post_upvoted` | User taps the upvote button on a post | `components/posts/Post.tsx` |
| `story_type_changed` | User switches the feed type (top, new, ask, show, jobs, best) | `components/Select.tsx` |
| `more_stories_loaded` | User scrolls to trigger infinite scroll next page | `components/posts/Posts.tsx` |
| `item_link_opened` | User taps the external link button on the item details screen | `app/[itemId].tsx` |
| `author_profile_tapped` | User taps an author's username to view their profile | `app/[itemId].tsx` |
| `parent_item_opened` | User taps the "Commented on" banner to navigate to the parent story | `app/[itemId].tsx` |
| `user_profile_viewed` | User navigates to view a HN user's profile | `app/users/[userId].tsx` |

## Next steps

Build an "Analytics basics" dashboard in PostHog with these recommended insights:

1. **Content engagement funnel** — Funnel from `post_opened` → `item_link_opened` to measure how many users who open a post also visit the source link.
2. **Post opens trend** — Trends chart for `post_opened` over time to track overall reading engagement.
3. **Story type breakdown** — Breakdown of `story_type_changed` by the `to` property to see which feed types are most popular.
4. **External link clicks** — Trends chart for `external_link_opened` grouped by `url` to see which domains drive the most click-outs.
5. **Feed pagination depth** — Trends chart for `more_stories_loaded` with `story_type` breakdown to understand how deep users scroll per feed.

Create the dashboard at: https://us.posthog.com/project/2/dashboard/new

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-expo/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
