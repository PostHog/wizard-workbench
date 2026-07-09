<wizard-report>
# PostHog post-wizard report

The wizard has completed a full PostHog integration for the Hacker Native Expo app — a read-only Hacker News client. The integration installs the `posthog-react-native` SDK with required Expo peer dependencies, configures environment-variable-based initialization via `app.config.js` and `expo-constants`, wraps the app in `PostHogProvider` with autocapture enabled for touches, adds manual screen tracking via `expo-router`'s `usePathname` hook in the root layout, and instruments all key user interactions with `posthog.capture()` calls.

| Event name | Description | File |
|---|---|---|
| `story_type_changed` | User switches between story feed types (top, best, ask, show). | `components/Select.tsx` |
| `story_opened` | User taps a story title to open it, distinguishing internal and external stories. | `components/posts/Post.tsx` |
| `story_link_opened` | User taps the external URL link on a story to open it in the browser. | `components/posts/Post.tsx` |
| `story_upvoted` | User taps the upvote button on a story in the feed. | `components/posts/Post.tsx` |
| `story_comments_opened` | User taps the comments button on a story to navigate to the comments view. | `components/posts/Post.tsx` |
| `item_upvoted` | User taps the upvote button on a story in the detail view. | `app/[itemId].tsx` |
| `item_link_opened` | User taps the external URL link on a story in the detail view to open it in the browser. | `app/[itemId].tsx` |
| `parent_item_navigated` | User taps the 'Commented on' banner to navigate to the parent story. | `app/[itemId].tsx` |
| `comment_upvoted` | User taps the upvote button on a comment. | `components/comments/comment.tsx` |
| `comment_thread_opened` | User taps the replies button on a comment to navigate to that comment's thread. | `components/comments/comment.tsx` |
| `user_profile_viewed` | User taps on a username to view that user's profile page. | `app/users/[userId].tsx` |

## Next steps

We've built a dashboard and five insights for you to monitor user behavior:

- **Dashboard**: [Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1824587)
- **Story opens by type**: [wf8bMKBk](https://us.posthog.com/project/483112/insights/wf8bMKBk) — tracks how many stories are opened, broken down by internal vs external type
- **Story type filter usage**: [GNT6V7Dc](https://us.posthog.com/project/483112/insights/GNT6V7Dc) — shows which story feeds (top, best, ask, show) users navigate to most
- **Story engagement funnel**: [eL9AV8pt](https://us.posthog.com/project/483112/insights/eL9AV8pt) — conversion from story open to external link click
- **Comment engagement trend**: [CcOFYrON](https://us.posthog.com/project/483112/insights/CcOFYrON) — comment upvotes vs thread opens over time
- **Deep engagement funnel**: [YM5eZh6T](https://us.posthog.com/project/483112/insights/YM5eZh6T) — full engagement depth: story open → comments opened → comment upvote

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-expo/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
</wizard-report>
