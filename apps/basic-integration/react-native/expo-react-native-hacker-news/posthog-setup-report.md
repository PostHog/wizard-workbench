<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of your Expo React Native app with PostHog. It installed the `posthog-react-native` SDK and required Expo peer dependencies, added Expo config wiring for PostHog environment variables, created a shared PostHog client, wrapped the app with `PostHogProvider`, enabled manual Expo Router screen tracking plus touch autocapture, and instrumented key engagement events across feed browsing, story opens, comment exploration, and profile viewing. It also added user identification when Hacker News profiles are viewed, created a live PostHog dashboard, and saved five related insights for ongoing analysis.

| Event name | Description | File |
| --- | --- | --- |
| `story_feed_loaded` | Captures when a story feed page loads with a selected Hacker News feed type. | `components/posts/Posts.tsx` |
| `story_feed_scrolled` | Captures when the user reaches the end of a story feed and requests more stories. | `components/posts/Posts.tsx` |
| `story_opened` | Captures when a user opens a story either externally or in the in-app detail view. | `components/posts/Post.tsx` |
| `story_comments_opened` | Captures when a user opens the comments thread for a story. | `components/posts/Post.tsx` |
| `story_link_opened` | Captures when a user opens the external link for a story from a story card or detail page. | `components/posts/Post.tsx`, `app/[itemId].tsx` |
| `item_detail_viewed` | Captures when a story or comment detail screen is viewed. | `app/[itemId].tsx` |
| `comment_thread_loaded` | Captures when a comment thread is loaded for an item. | `components/comments/comments.tsx` |
| `comment_opened` | Captures when a user opens a comment detail view from a comment row. | `components/comments/comment.tsx`, `app/[itemId].tsx` |
| `comment_author_opened` | Captures when a user opens an author profile from a comment or item detail. | `components/comments/comment.tsx`, `app/[itemId].tsx` |
| `user_profile_viewed` | Captures when a Hacker News user profile is viewed. | `app/users/[userId].tsx` |
| `user_activity_loaded` | Captures when a user's activity feed is loaded. | `components/posts/user-activities/UserActivities.tsx` |
| `story_feed_changed` | Captures when the user switches between story feed types on the home screen. | `app/index.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://us.posthog.com/project/483112/dashboard/1831071)
- [Story feed loads (wizard)](https://us.posthog.com/project/483112/insights/iCsQ6WkF)
- [Story opens by destination (wizard)](https://us.posthog.com/project/483112/insights/U50agPBH)
- [Profile engagement funnel (wizard)](https://us.posthog.com/project/483112/insights/OHiNkr8Y)
- [Comment thread loads (wizard)](https://us.posthog.com/project/483112/insights/2F09rJjR)
- [Feed switching by story type (wizard)](https://us.posthog.com/project/483112/insights/tilyRVrU)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
