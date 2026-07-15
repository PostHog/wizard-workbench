# PostHog post-wizard report

The wizard integrated PostHog product analytics into the Expo React Native Hacker News reader. The React Native SDK is initialized once at the application root using environment-provided configuration, touch autocapture remains enabled, and Expo Router routes are tracked manually. Custom events cover feed changes, story engagement, external-link opens, profile navigation, and comment interactions. No user authentication flow exists in this project, so no identify call was added.

| Event name | Description | Files |
| --- | --- | --- |
| `story_feed_changed` | Captures when a reader changes the Hacker News story feed. | `app/index.tsx` |
| `story_opened` | Captures when a reader opens an internal Hacker News story or its discussion. | `components/posts/Post.tsx` |
| `external_story_opened` | Captures when a reader opens a linked story in an external browser. | `components/posts/Post.tsx`, `app/[itemId].tsx` |
| `story_upvote_tapped` | Captures when a reader taps the visual upvote control on a story. | `components/posts/Post.tsx`, `app/[itemId].tsx` |
| `comment_upvote_tapped` | Captures when a reader taps the visual upvote control on a comment. | `components/comments/comment.tsx` |
| `comment_thread_opened` | Captures when a reader opens a nested comment thread. | `components/comments/comment.tsx` |
| `profile_opened` | Captures when a reader opens a Hacker News author profile. | `app/[itemId].tsx` |

## Next steps

A dashboard and a shareable PostHog notebook could not be created because the configured PostHog MCP server was unavailable during this run. Once connectivity is restored, create an **Analytics basics (wizard)** dashboard using the event names above and add trends for feed changes, story opens, external-link opens, and comment-thread opens.

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.

### Agent skill

An agent skill folder remains in the project at `.claude/skills/integration-expo` for future PostHog integration work.
