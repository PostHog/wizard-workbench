<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Hacker Native Expo app. Here is a summary of all changes made:

- **Installed** `posthog-react-native` via `npx expo install`
- **Created** `app.config.js` to expose PostHog config via `expo-constants` extras (reads from `.env`)
- **Created** `src/config/posthog.ts` — the singleton PostHog client used throughout the app
- **Updated** `app/_layout.tsx` — wrapped the app in `PostHogProvider` and added a `ScreenTracker` component that calls `posthog.screen()` on every route change via `usePathname`/`useGlobalSearchParams`
- **Updated** `components/posts/Post.tsx` — tracks `story_tapped`, `comment_thread_opened`, and `external_link_opened`
- **Updated** `components/posts/Posts.tsx` — tracks `more_stories_loaded` on infinite scroll
- **Updated** `components/Select.tsx` — tracks `story_type_changed` when the user switches story category
- **Updated** `components/comments/comment.tsx` — tracks `user_profile_viewed` and `comment_thread_navigated`
- **Updated** `app/[itemId].tsx` — tracks `user_profile_viewed_from_item`, `item_external_link_opened`, and `parent_story_navigated`
- **Configured** `.env` with `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST`

## Events tracked

| Event | Description | File |
|-------|-------------|------|
| `story_type_changed` | User selects a different story category (top, best, ask, show) | `components/Select.tsx` |
| `story_tapped` | User taps on a story title to view its details or open external link | `components/posts/Post.tsx` |
| `external_link_opened` | User taps the external link button on a post to open it in the browser | `components/posts/Post.tsx` |
| `comment_thread_opened` | User taps the comments button on a post to view the comment thread | `components/posts/Post.tsx` |
| `more_stories_loaded` | User scrolls to the bottom triggering an infinite scroll page load | `components/posts/Posts.tsx` |
| `user_profile_viewed` | User navigates to a Hacker News user's profile from a comment | `components/comments/comment.tsx` |
| `comment_thread_navigated` | User taps the comments button on a comment to navigate into a nested thread | `components/comments/comment.tsx` |
| `item_external_link_opened` | User opens the external link from the item detail page | `app/[itemId].tsx` |
| `user_profile_viewed_from_item` | User taps on the author's name on the item detail page to view their profile | `app/[itemId].tsx` |
| `parent_story_navigated` | User taps the 'Commented on' card to navigate from a comment to its parent story | `app/[itemId].tsx` |

## Next steps

To create an **"Analytics basics"** dashboard in PostHog, go to your PostHog project and add the following insights:

1. **Story engagement funnel** — Funnel from `story_tapped` → `comment_thread_opened` to measure what proportion of tapped stories lead to reading comments
2. **External link click rate** — Trend of `external_link_opened` + `item_external_link_opened` grouped by `url_host` to see which domains get the most traffic
3. **Story type popularity** — Breakdown of `story_type_changed` by `to_type` property to understand which story categories users prefer
4. **Content depth** — Trend of `comment_thread_navigated` and `parent_story_navigated` to measure how deeply users explore nested discussions
5. **Scroll engagement** — Trend of `more_stories_loaded` grouped by `story_type` to see which categories drive the most scrolling

You can build these at: **https://us.posthog.com/project/2/insights**

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-expo/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
