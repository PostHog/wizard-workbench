# PostHog post-wizard report

The wizard integrated PostHog into this Expo React Native app. It installed `posthog-react-native`, configured the SDK at the root of the Expo Router tree using `EXPO_PUBLIC_POSTHOG_PROJECT_TOKEN` and `EXPO_PUBLIC_POSTHOG_HOST`, preserved default autocapture and session recording behavior, and added focused product events for feed selection, story engagement, comment engagement, outbound links, and profile discovery. The app has no authentication flow or instrumentable server-side routes, so user identification and server capture were not added.

| Event | Description | File |
| --- | --- | --- |
| `story_type_selected` | A reader changes the story feed category. | `app/index.tsx` |
| `story_opened` | A reader opens a story or text post from a feed. | `components/posts/Post.tsx` |
| `story_comments_opened` | A reader opens the discussion for a story. | `components/posts/Post.tsx` |
| `external_link_opened` | A reader opens an external story URL. | `components/posts/Post.tsx` |
| `story_upvote_tapped` | A reader taps the upvote control on a story. | `components/posts/Post.tsx` |
| `comment_opened` | A reader opens a comment thread. | `components/comments/comment.tsx` |
| `comment_upvote_tapped` | A reader taps the upvote control on a comment. | `components/comments/comment.tsx` |
| `user_profile_opened` | A reader opens an author's public profile. | `app/[itemId].tsx` |

## Next steps

Dashboard and notebook creation could not be completed because the PostHog MCP server was unavailable in this run. Once connectivity is restored, create **Analytics basics (wizard)** with trends for feed selection and engagement, plus a funnel from `story_opened` to `story_comments_opened` to `comment_opened`.

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `EXPO_PUBLIC_POSTHOG_PROJECT_TOKEN` and `EXPO_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Migrate the legacy ESLint configuration to ESLint 9 flat config, then rerun lint on the changed files.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
