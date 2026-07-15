# PostHog post-wizard report

PostHog was added to the Expo Hacker News client using `posthog-react-native`. The SDK is initialized from Expo config extras populated by `EXPO_PUBLIC_POSTHOG_PROJECT_TOKEN` and `EXPO_PUBLIC_POSTHOG_HOST`, then provided at the application root. Reader interactions now capture story selection, story opening, external link opening, upvotes, and comment-thread opening.

| Event | Description | File |
|---|---|---|
| `story_type_selected` | A reader changes the Hacker News story feed type. | `app/index.tsx` |
| `story_opened` | A reader opens a story or comment detail view. | `components/posts/Post.tsx` |
| `external_link_opened` | A reader opens a story's external link. | `components/posts/Post.tsx` |
| `item_upvoted` | A reader taps the upvote control for a story or comment. | `components/posts/Post.tsx`, `components/comments/comment.tsx` |
| `comment_thread_opened` | A reader opens a story or comment discussion thread. | `components/posts/Post.tsx`, `components/comments/comment.tsx` |

## Next steps

Dashboard creation was unavailable because the PostHog MCP server could not connect in this run.

## Verify before merging

- [ ] Run a full production build and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — instrumented call sites may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names (`EXPO_PUBLIC_POSTHOG_PROJECT_TOKEN` and `EXPO_PUBLIC_POSTHOG_HOST`) to `.env.example` and any bootstrap scripts.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code.
