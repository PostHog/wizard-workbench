<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the **Hacker Native** Expo app. Here is a summary of all changes made.

## What was set up

- **`posthog-react-native`** package installed (v4.45.11)
- **`app.config.js`** created (converted from `app.json`) to inject PostHog credentials from environment variables via `expo-constants`
- **`.env`** created with `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST`
- **`src/config/posthog.ts`** created — PostHog singleton client with batching, lifecycle tracking, and graceful disabled-mode when no token is set
- **`app/_layout.tsx`** updated — `PostHogProvider` wraps the app with autocapture (touch events) enabled; manual screen tracking via `usePathname` + `useGlobalSearchParams` fires `posthog.screen()` on every route change
- **Event tracking** added to 5 files covering all key user interactions

## Events instrumented

| Event | Description | File |
|-------|-------------|------|
| `story_type_changed` | User switches the story feed type (Top, Best, Ask, Show) | `components/Select.tsx` |
| `post_opened` | User taps a post title to navigate to the detail/comments screen | `components/posts/Post.tsx` |
| `external_link_opened` | User opens the external URL of a post | `components/posts/Post.tsx` |
| `post_upvoted` | User taps the upvote button on a post in the list | `components/posts/Post.tsx` |
| `comments_opened` | User taps the comments button to navigate to item detail | `components/posts/Post.tsx` |
| `item_upvoted` | User taps the upvote button on the item detail screen | `app/[itemId].tsx` |
| `item_external_link_opened` | User opens the external URL from the item detail screen | `app/[itemId].tsx` |
| `user_profile_viewed` | User views another user's profile page | `app/users/[userId].tsx` |
| `more_stories_loaded` | User scrolls to load the next page of stories (pagination) | `components/posts/Posts.tsx` |

## Next steps

We've suggested 5 insights for a **"Analytics basics"** dashboard. Create them in PostHog using the links below:

1. **Post engagement funnel** — Track the conversion from `post_opened` → `comments_opened` to see how many users dive into discussions:
   [Create funnel insight](https://us.posthog.com/project/2/insights/new#eyJpbnNpZ2h0IjoiRlVOTkVMUyIsImV2ZW50cyI6W3siaWQiOiJwb3N0X29wZW5lZCIsIm5hbWUiOiJwb3N0X29wZW5lZCIsInR5cGUiOiJldmVudHMiLCJvcmRlciI6MH0seyJpZCI6ImNvbW1lbnRzX29wZW5lZCIsIm5hbWUiOiJjb21tZW50c19vcGVuZWQiLCJ0eXBlIjoiZXZlbnRzIiwib3JkZXIiOjF9XX0=)

2. **Story type popularity** — Trend of `story_type_changed` broken down by `story_type` property to see which feed type users prefer:
   [Create trend insight](https://us.posthog.com/project/2/insights/new)

3. **External link clicks** — Total count of `external_link_opened` + `item_external_link_opened` over time to measure content engagement:
   [Create trend insight](https://us.posthog.com/project/2/insights/new)

4. **Pagination depth** — Trend of `more_stories_loaded` events to understand how deep users scroll into feeds:
   [Create trend insight](https://us.posthog.com/project/2/insights/new)

5. **User profile exploration** — Trend of `user_profile_viewed` to measure community engagement and social browsing:
   [Create trend insight](https://us.posthog.com/project/2/insights/new)

[Go to PostHog Dashboards →](https://us.posthog.com/project/2/dashboards)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-expo/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
