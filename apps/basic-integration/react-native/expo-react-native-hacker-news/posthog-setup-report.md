<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of your Expo React Native project. PostHog was installed and initialized with a shared client in `lib/posthog.ts`, wrapped with `PostHogProvider` in the root layout, and configured for manual Expo Router screen tracking plus touch autocapture. Product analytics events were then added across story feed loading, story interactions, comment exploration, and user profile activity flows. Environment variables were written to `.env` using Expo-safe public names so no PostHog credentials are hardcoded in source.

| Event name | Description | File |
| --- | --- | --- |
| `story_list_loaded` | Tracks when a story feed is loaded for a selected Hacker News category. | `components/posts/Posts.tsx` |
| `story_feed_paginated` | Tracks when a user loads another page of stories in a feed. | `components/posts/Posts.tsx` |
| `story_type_selected` | Tracks when a user changes the active story category filter. | `components/Select.tsx` |
| `story_opened` | Tracks when a user opens a story from a list item. | `components/posts/Post.tsx` |
| `story_link_opened` | Tracks when a user opens an external story URL. | `components/posts/Post.tsx` |
| `story_details_loaded` | Tracks when a story or comment details screen successfully loads its item. | `app/[itemId].tsx` |
| `story_author_opened` | Tracks when a user opens an author profile from a story or comment. | `app/[itemId].tsx` |
| `comment_thread_loaded` | Tracks when a comment thread is loaded for a story or comment. | `components/comments/comments.tsx` |
| `comment_thread_paginated` | Tracks when a user loads more comments in a thread. | `components/comments/comments.tsx` |
| `comment_replied_context_opened` | Tracks when a user opens the parent item from a comment detail view. | `app/[itemId].tsx` |
| `comment_opened` | Tracks when a user opens a nested comment from a comment row. | `components/comments/comment.tsx` |
| `user_profile_loaded` | Tracks when a Hacker News user profile screen successfully loads. | `app/users/[userId].tsx` |
| `user_activities_loaded` | Tracks when a user's activity feed is loaded. | `components/posts/user-activities/UserActivities.tsx` |
| `user_activities_paginated` | Tracks when a user loads more activity items from a profile. | `components/posts/user-activities/UserActivities.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- Dashboard: https://us.posthog.com/project/483112/dashboard/1807680
- Insight: Story feed loads by type (wizard) — https://us.posthog.com/project/483112/insights/8m9IoWNo
- Insight: Story type selection rate (wizard) — https://us.posthog.com/project/483112/insights/R5IPAIOS
- Insight: Story opens vs external links (wizard) — https://us.posthog.com/project/483112/insights/p8eI8FWg
- Insight: Comment engagement depth (wizard) — https://us.posthog.com/project/483112/insights/di4BabTq
- Insight: User profile exploration (wizard) — https://us.posthog.com/project/483112/insights/Fr5ALdJV

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
