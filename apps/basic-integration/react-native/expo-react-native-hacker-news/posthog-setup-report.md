# PostHog post-wizard report

The wizard completed a PostHog analytics integration for this Expo React Native app by installing the React Native SDK, adding Expo environment wiring, initializing PostHog at the app root, enabling touch autocapture plus manual screen tracking, and instrumenting key reading and engagement flows across feed selection, story opens, comment exploration, and author profile views.

| Event name | Description | File |
| --- | --- | --- |
| `story_feed_selected` | Captured when a user changes the active Hacker News story feed. | `app/index.tsx` |
| `story_opened` | Captured when a user opens a story from the feed or detail screen. | `components/posts/Post.tsx` |
| `story_comments_opened` | Captured when a user opens a story or comment thread for deeper reading. | `components/posts/Post.tsx`, `app/[itemId].tsx` |
| `story_upvote_pressed` | Captured when a user presses an upvote affordance on a story. | `components/posts/Post.tsx`, `app/[itemId].tsx` |
| `comment_reply_thread_opened` | Captured when a user opens a nested comment thread from a comment card. | `components/comments/comment.tsx` |
| `comment_upvote_pressed` | Captured when a user presses an upvote affordance on a comment. | `components/comments/comment.tsx` |
| `author_profile_opened` | Captured when a user navigates to an author profile from a story or comment. | `app/[itemId].tsx`, `components/comments/comment.tsx` |
| `story_outbound_link_opened` | Captured when a user opens a story's external link. | `app/[itemId].tsx` |
| `parent_story_opened` | Captured when a user opens the parent story or parent comment context from a detail page. | `app/[itemId].tsx` |
| `user_profile_opened` | Captured when a user opens a Hacker News user profile page. | `app/users/[userId].tsx` |
| `user_activity_loaded` | Captured when a user activity list loads for a profile page. | `components/posts/user-activities/UserActivities.tsx` |
| `comments_loaded` | Captured when a comment list loads for a story or comment detail page. | `components/comments/comments.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://us.posthog.com/project/483112/dashboard/1846813)
- [Feed selections over time (wizard)](https://us.posthog.com/project/483112/insights/xfLW1J4Z)
- [Story opens by destination (wizard)](https://us.posthog.com/project/483112/insights/MIF7fcGm)
- [Comment engagement mix (wizard)](https://us.posthog.com/project/483112/insights/MN7aYO7V)
- [Author profile interest (wizard)](https://us.posthog.com/project/483112/insights/ZLRew6NN)
- [Reading-to-comments funnel (wizard)](https://us.posthog.com/project/483112/insights/Rqj8Hysa)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
