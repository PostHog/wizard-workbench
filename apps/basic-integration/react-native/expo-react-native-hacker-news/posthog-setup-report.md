<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Expo/React Native Hacker News reader app. Here is a summary of the changes made:

- **`app.config.js`** (new) — Replaced the static `app.json` with a dynamic JS config that reads `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from environment variables and exposes them via `extra`, accessible at runtime through `expo-constants`.
- **`.env`** (new) — PostHog project token and host written as environment variables.
- **`lib/posthog.ts`** (new) — Singleton PostHog client configured with batching, feature flags, retry settings, and lifecycle event capture. Reads credentials from `Constants.expoConfig.extra`.
- **`app/_layout.tsx`** — Wrapped the app with `PostHogProvider` (with autocapture enabled for touch events) and added manual screen tracking using `posthog.screen()` on every route change, following the Expo Router pattern.
- **`components/Select.tsx`** — Captures `story_type_changed` when the user switches between Top, Best, Ask, or Show story feeds.
- **`components/posts/Post.tsx`** — Captures `post_tapped`, `post_external_link_opened`, `post_upvoted`, and `post_comments_opened` on the relevant user interactions.
- **`app/[itemId].tsx`** — Captures `item_upvoted`, `item_external_link_opened`, `item_author_profile_viewed`, and `parent_item_navigated` on the item detail screen.
- **`components/comments/comment.tsx`** — Captures `comment_upvoted`, `comment_thread_opened`, and `comment_author_profile_viewed` on comment interactions.

| Event name | Description | File |
|---|---|---|
| `story_type_changed` | User switches the story feed between Top, Best, Ask, or Show stories. | `components/Select.tsx` |
| `post_tapped` | User taps a post title to open its detail/comment view. | `components/posts/Post.tsx` |
| `post_external_link_opened` | User opens an external URL linked from a post in the story list. | `components/posts/Post.tsx` |
| `post_upvoted` | User taps the upvote button on a post in the story list. | `components/posts/Post.tsx` |
| `post_comments_opened` | User taps the comments button on a post to navigate to its detail view. | `components/posts/Post.tsx` |
| `item_external_link_opened` | User opens the external URL from an item's detail screen. | `app/[itemId].tsx` |
| `item_upvoted` | User taps the upvote button on an item in the detail screen. | `app/[itemId].tsx` |
| `item_author_profile_viewed` | User taps the author name on an item detail page to view their profile. | `app/[itemId].tsx` |
| `parent_item_navigated` | User taps the 'Commented on' banner to navigate to the parent item. | `app/[itemId].tsx` |
| `comment_upvoted` | User taps the upvote button on a comment. | `components/comments/comment.tsx` |
| `comment_thread_opened` | User taps the reply count on a comment to open its nested thread. | `components/comments/comment.tsx` |
| `comment_author_profile_viewed` | User taps a comment author's name to view their profile. | `components/comments/comment.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard:** [Analytics basics (wizard)](https://us.i.posthog.com/project/483112/dashboard/1777475)
- **Story type preference:** [https://us.i.posthog.com/project/483112/insights/3RRsHTlB](https://us.i.posthog.com/project/483112/insights/3RRsHTlB)
- **Post engagement funnel:** [https://us.i.posthog.com/project/483112/insights/XGwEtDsv](https://us.i.posthog.com/project/483112/insights/XGwEtDsv)
- **External link clicks:** [https://us.i.posthog.com/project/483112/insights/JBRU6hMk](https://us.i.posthog.com/project/483112/insights/JBRU6hMk)
- **Comment engagement:** [https://us.i.posthog.com/project/483112/insights/2CxgrS3k](https://us.i.posthog.com/project/483112/insights/2CxgrS3k)
- **User profile exploration:** [https://us.i.posthog.com/project/483112/insights/kvGtcQFS](https://us.i.posthog.com/project/483112/insights/kvGtcQFS)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names (`POSTHOG_PROJECT_TOKEN`, `POSTHOG_HOST`) to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
