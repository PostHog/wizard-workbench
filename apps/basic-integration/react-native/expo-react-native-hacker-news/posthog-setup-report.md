# PostHog post-wizard report

The wizard has completed a full PostHog integration for the Hacker Native Expo app. Changes include:

- **Installed** `posthog-react-native` plus required Expo peer dependencies (`expo-file-system`, `expo-application`, `expo-device`, `expo-localization`).
- **Created** `app.config.js` to expose `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from `.env` via `expo-constants`.
- **Created** `src/config/posthog.ts` — a singleton PostHog client loaded with the project token from `Constants.expoConfig.extra`.
- **Updated** `app/_layout.tsx` — wrapped the app with `PostHogProvider` (autocapture touches enabled, manual screen tracking) and added `useEffect`-based screen tracking via `posthog.screen()` on every pathname change.
- **Added** `posthog.capture()` calls across five files covering 13 distinct user actions (see table below).

| Event name | Description | File |
|---|---|---|
| `story_type_changed` | User changes the story feed type (top, best, ask, or show stories). | `app/index.tsx` |
| `post_opened` | User taps a post title in the feed to navigate to its detail page. | `components/posts/Post.tsx` |
| `post_external_link_opened` | User taps the external URL link on a post in the feed. | `components/posts/Post.tsx` |
| `post_upvoted` | User taps the upvote button on a post in the feed. | `components/posts/Post.tsx` |
| `post_comments_tapped` | User taps the comments button on a post in the feed to view discussions. | `components/posts/Post.tsx` |
| `story_viewed` | User opens a story detail page, marking the start of the reading funnel. | `app/[itemId].tsx` |
| `story_upvoted` | User taps the upvote button on a story from the detail view. | `app/[itemId].tsx` |
| `story_external_link_opened` | User opens the external URL from a story's detail view. | `app/[itemId].tsx` |
| `parent_story_tapped` | User taps the parent story link to navigate up from a comment detail page. | `app/[itemId].tsx` |
| `user_profile_viewed` | User navigates to a Hacker News user's profile page. | `app/users/[userId].tsx` |
| `comment_author_tapped` | User taps a comment author's name to view their profile. | `components/comments/comment.tsx` |
| `comment_upvoted` | User taps the upvote button on a comment. | `components/comments/comment.tsx` |
| `comment_thread_tapped` | User taps to open a nested comment thread from a comment. | `components/comments/comment.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1818274)
- [Story reading funnel (wizard)](https://us.posthog.com/project/483112/insights/bjBbtJSt) — Conversion from `story_viewed` → `story_upvoted`
- [Story engagement trends (wizard)](https://us.posthog.com/project/483112/insights/K12p0Dhk) — Daily trend of story views, post opens, and upvotes
- [Story type popularity (wizard)](https://us.posthog.com/project/483112/insights/UZG4w1A9) — Story feed type switches broken down by type
- [Comment engagement trends (wizard)](https://us.posthog.com/project/483112/insights/OYKyXFLt) — Daily comment upvotes, thread opens, and author profile taps
- [External link click-through funnel (wizard)](https://us.posthog.com/project/483112/insights/6K1cMFsA) — Conversion from `story_viewed` → `story_external_link_opened`

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
