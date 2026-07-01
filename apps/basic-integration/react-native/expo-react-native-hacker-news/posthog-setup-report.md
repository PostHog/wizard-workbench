<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Hacker News React Native (Expo) app. Here is a summary of what was done:

- **Installed** `posthog-react-native` and required Expo peer dependencies (`expo-file-system`, `expo-application`, `expo-device`, `expo-localization`).
- **Created** `app.config.js` (replacing `app.json`) to expose `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` as Expo config extras via `process.env`.
- **Created** `src/config/posthog.ts` — a shared PostHog client instance that reads credentials from `Constants.expoConfig.extra`.
- **Updated** `app/_layout.tsx` — added `PostHogProvider` wrapping the app with autocapture (touches enabled, manual screen tracking). Added screen tracking via `posthog.screen(pathname, params)` in a `useEffect` that fires on route change.
- **Added event capture** to five files covering the full user journey through the app.

| Event Name | Description | File |
|---|---|---|
| `story_type_changed` | User switches the feed type (top, best, ask, show) | `components/Select.tsx` |
| `story_tapped` | User taps on a story to open it (internal or external) | `components/posts/Post.tsx` |
| `external_link_opened` | User opens an external URL from a story in the post list | `components/posts/Post.tsx` |
| `comments_opened` | User taps the comments button on a post | `components/posts/Post.tsx` |
| `story_upvoted` | User taps the upvote button on a post in the story list | `components/posts/Post.tsx` |
| `more_stories_loaded` | Infinite scroll loads the next page of stories | `components/posts/Posts.tsx` |
| `story_details_viewed` | User views a story's detail page | `app/[itemId].tsx` |
| `item_external_link_opened` | User opens the external URL from a story's detail page | `app/[itemId].tsx` |
| `item_upvoted` | User taps the upvote button on the story detail page | `app/[itemId].tsx` |
| `user_profile_tapped` | User taps on a story author's username to view their profile | `app/[itemId].tsx` |
| `comment_thread_opened` | User navigates into a sub-comment thread from a comment | `components/comments/comment.tsx` |
| `comment_user_tapped` | User taps on a commenter's username to view their profile | `components/comments/comment.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) Dashboard](https://us.i.posthog.com/project/483112/dashboard/1787478)
  - Story engagement funnel (story_tapped → story_details_viewed → comments_opened)
  - Content type preference (story_type_changed breakdown by feed type)
  - External link clicks (external_link_opened vs item_external_link_opened)
  - Engagement depth (comments_opened, comment_thread_opened, comment_user_tapped)
  - Story discovery (more_stories_loaded vs story_tapped)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
