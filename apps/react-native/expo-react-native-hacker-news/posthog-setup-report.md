# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the **Hacker Native** Expo React Native app. Here's what was done:

- **Installed** `posthog-react-native` and its Expo peer dependencies (`expo-file-system`, `expo-application`, `expo-device`, `expo-localization`)
- **Created** `app.config.js` to expose `POSTHOG_API_KEY` and `POSTHOG_HOST` from `.env` as Expo `extra` config at build time
- **Created** `src/config/posthog.ts` — a singleton PostHog client configured with app lifecycle capture, batching, and debug mode in development
- **Wrapped** the app in `PostHogProvider` inside `app/_layout.tsx`, with `captureTouches` autocapture enabled and **manual screen tracking** implemented using Expo Router's `usePathname` hook (required for Expo Router)
- **Instrumented 11 custom events** across 6 files, covering every meaningful user interaction in the app

| Event | Description | File |
|---|---|---|
| `story_category_changed` | User changes the story feed category (top, best, ask, show) | `components/Select.tsx` |
| `story_opened` | User taps on a story to open its detail view (discussion page) | `components/posts/Post.tsx` |
| `story_link_opened` | User taps the external URL link on a story | `components/posts/Post.tsx` |
| `story_upvoted` | User taps the upvote button on a story | `components/posts/Post.tsx` |
| `comment_upvoted` | User taps the upvote button on a comment | `components/comments/comment.tsx` |
| `comment_thread_opened` | User taps the comments button to navigate to a comment's thread | `components/comments/comment.tsx` |
| `user_profile_viewed` | User views a Hacker News user's profile page | `app/users/[userId].tsx` |
| `item_link_opened` | User taps the external URL link on an item detail page | `app/[itemId].tsx` |
| `item_upvoted` | User taps the upvote button on the item detail page | `app/[itemId].tsx` |
| `parent_item_navigated` | User taps the 'Commented on' section to navigate to the parent post | `app/[itemId].tsx` |
| `feed_page_loaded` | User scrolls to load the next page of stories in the feed | `components/posts/Posts.tsx` |

## Next steps

To start analyzing user behavior, create these recommended insights in your PostHog dashboard:

1. **Story Engagement Funnel** — `story_opened` → `story_upvoted` or `story_link_opened`
2. **Daily Active Story Interactions** — Trend of `story_opened` + `story_upvoted` + `comment_upvoted`
3. **Content Discovery** — Breakdown of `story_category_changed` by `category` property
4. **Deep Engagement Rate** — Trend of `comment_thread_opened` + `parent_item_navigated`
5. **Daily Active Users** — Unique users over time using any event

Visit [PostHog Insights](https://us.posthog.com/project/2/insights) to create these insights.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-expo/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
