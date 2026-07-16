# PostHog post-wizard report

PostHog has been integrated into this Expo React Native app. The React Native SDK is installed and initialized from Expo public environment variables, app lifecycle events are enabled, and Expo Router screens are tracked manually. Product interactions across feed selection, story navigation, external-link opens, discussion opens, and profile navigation are captured with non-PII event properties.

| Event name | Description | File |
| --- | --- | --- |
| `story_type_selected` | Captures when a reader changes the Hacker News story feed. | `app/index.tsx` |
| `story_opened` | Captures when a reader opens a story or its discussion from the feed. | `components/posts/Post.tsx` |
| `external_story_opened` | Captures when a reader opens an external story link. | `components/posts/Post.tsx`, `app/[itemId].tsx` |
| `story_discussion_opened` | Captures when a reader opens a story discussion or a nested comment thread. | `app/[itemId].tsx` |
| `user_profile_opened` | Captures when a reader opens a Hacker News user profile. | `app/[itemId].tsx` |

## Next steps

A dashboard and notebook could not be created because the configured PostHog MCP server was unreachable during setup. Once the MCP server is available, create **Analytics basics (wizard)** with trends for the events above.

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
