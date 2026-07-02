<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Hacker News reader (Hacker Native) Expo app. The integration adds the `posthog-react-native` SDK with full autocapture, manual screen tracking via Expo Router's `usePathname`/`useGlobalSearchParams` hooks, and 10 custom events covering all major user interactions: feed filtering, post/link navigation, comments browsing, and user profile exploration.

Key changes:
- **`app.config.js`** (new): Converts from `app.json` to JavaScript config so `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` can be injected via environment variables and exposed through `expo-constants`.
- **`src/config/posthog.ts`** (new): Initializes the PostHog singleton with production-ready batching and timeout configuration.
- **`app/_layout.tsx`**: Wraps the app with `PostHogProvider` (touch autocapture enabled, screen autocapture disabled) and manually tracks screen changes via a `useEffect` on `pathname`.
- **`app/index.tsx`**: Captures `story_feed_changed` when the user switches between Top/Best/Ask/Show story types.
- **`components/posts/Post.tsx`**: Captures `post_opened` on internal navigation and `external_link_opened` when the user opens an external URL.
- **`components/posts/Posts.tsx`**: Captures `posts_paginated` when the infinite scroll loads a new page.
- **`app/[itemId].tsx`**: Captures `user_profile_viewed` when the user taps the post author and `external_link_opened` when the user opens the article URL from the detail page.
- **`components/comments/comment.tsx`**: Captures `comment_author_tapped` when a comment author is tapped and `comment_thread_opened` when the user navigates into a comment's replies.
- **`components/comments/comments.tsx`**: Captures `comments_paginated` on infinite scroll.
- **`components/posts/user-activities/UserActivities.tsx`**: Captures `user_activities_paginated` on infinite scroll.
- **`.env`**: Added `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST`.

| Event | Description | File |
|-------|-------------|------|
| `story_feed_changed` | User switches between story types (top, best, ask, show) on the home feed | `app/index.tsx` |
| `post_opened` | User taps a post title to navigate to its detail page | `components/posts/Post.tsx` |
| `external_link_opened` | User opens an external URL from a post in the story list | `components/posts/Post.tsx` |
| `posts_paginated` | User scrolls to the end of the post list triggering next page load | `components/posts/Posts.tsx` |
| `external_link_opened` | User opens an external URL from the item detail page | `app/[itemId].tsx` |
| `user_profile_viewed` | User taps the post author name to navigate to their profile | `app/[itemId].tsx` |
| `comment_author_tapped` | User taps a comment author name to view their profile | `components/comments/comment.tsx` |
| `comment_thread_opened` | User taps the comments button to navigate into a comment thread | `components/comments/comment.tsx` |
| `comments_paginated` | User scrolls to the end of the comments list triggering next page load | `components/comments/comments.tsx` |
| `user_activities_paginated` | User scrolls to the end of user activities triggering next page load | `components/posts/user-activities/UserActivities.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) Dashboard](https://us.i.posthog.com/project/483112/dashboard/1792546)
  - [Daily Active Users (App Opens)](https://us.i.posthog.com/project/483112/insights/9775285)
  - [Most Popular Story Types](https://us.i.posthog.com/project/483112/insights/9775294)
  - [External Link Engagement](https://us.i.posthog.com/project/483112/insights/9775295)
  - [Content Engagement Funnel](https://us.i.posthog.com/project/483112/insights/9775297)
  - [User Exploration (Profile Views)](https://us.i.posthog.com/project/483112/insights/9775301)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names (`POSTHOG_PROJECT_TOKEN`, `POSTHOG_HOST`) to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
