# PostHog setup report

PostHog 4.61.0 was installed and initialized in the Expo React Native Hacker News reader, with five personless product events, global React error tracking, and a starter dashboard.

## What was installed and initialized

- Installed `posthog-react-native` `^4.61.0`; `react-native-svg` was already present as its peer dependency.
- Added a single environment-backed PostHog client in `lib/posthog.ts`, using `EXPO_PUBLIC_POSTHOG_PROJECT_TOKEN` and `EXPO_PUBLIC_POSTHOG_HOST`.
- Mounted the shared client through `PostHogProvider` in `app/_layout.tsx`.
- Added the real environment keys locally through the wizard environment tooling and documented placeholder names in `.env.example`.
- No server-side PostHog package was installed because the app has no existing server-side event instrumentation.
- The app has no authentication or account identity flow, so captures are intentionally personless. No `identify()` or logout `reset()` wiring was added.

## Events instrumented

These events were added at user interaction handlers. The run verified that eight action-bound `capture()` calls exist across four UI files; it did **not** exercise the app or observe events arriving in PostHog.

| Event | What it measures | File |
|---|---|---|
| `story_type_selected` | Reader selects a Hacker News story feed. | `app/index.tsx` |
| `story_opened` | Reader opens an internal Hacker News story or comment thread. | `components/posts/Post.tsx` |
| `external_story_opened` | Reader opens a story's external destination. | `components/posts/Post.tsx` |
| `author_profile_opened` | Reader opens a public Hacker News author profile. | `app/[itemId].tsx` |
| `comment_thread_opened` | Reader opens a nested comment thread. | `components/comments/comment.tsx` |

Event properties are contextual and non-PII. Public Hacker News usernames are not sent as event properties. Hacker News item IDs are used as content identifiers, based on the capture-step assumption.

## Identification status

User identification was skipped. The app has no authentication, registration, persisted session, current-user, logout, or account-switch flow. Its `User` model represents public Hacker News profiles, not authenticated app users, so using those usernames as PostHog identities would incorrectly attribute activity. If app accounts are introduced, identify after successful authentication with the account's stable primary key, keep email/name in person properties, and reset on logout.

## Error tracking

`PostHogErrorBoundary` was added around the Expo Router `Stack` inside the existing `PostHogProvider` in `app/_layout.tsx`. This is the single app-level mechanism added for React rendering exceptions. Native crash autocapture was not added because it requires an optional plugin/dependency. The run confirmed the boundary/provider nesting by file inspection, but did not trigger an error or verify delivery.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1914298)

The dashboard contains five tagged insights covering daily feed selections, story opens by story type, external destinations, combined author/comment navigation activity, and the feed-selection-to-story-open funnel. The dashboard and insights were created successfully, but the run did not observe fresh event data; charts may remain empty until the app emits events.

## Verification and unresolved issues

- Dependency installation completed successfully with npm; the lockfile records `posthog-react-native` 4.61.0.
- Environment-key checks confirmed `EXPO_PUBLIC_POSTHOG_PROJECT_TOKEN` and `EXPO_PUBLIC_POSTHOG_HOST` are present locally.
- No build or typecheck script exists in the project, so a production build was not verified.
- `npm run lint` exited before source analysis because ESLint 9 requires `eslint.config.js`, while this project has no flat config. This is a pre-existing, unrelated configuration conflict; no lint configuration was changed.
- Runtime event delivery was not exercised. A passing dependency/review check proves files and dependencies were inspected, not that events flow into PostHog.

## Before you merge

- [ ] Run a full production Expo build and fix any build, lint, or type errors introduced by the integration; the run did not verify a production build.
- [ ] Run the test suite and update mocks or fixtures if needed for the new PostHog imports and captures; no tests were run during this integration.
- [ ] Configure `EXPO_PUBLIC_POSTHOG_PROJECT_TOKEN` and `EXPO_PUBLIC_POSTHOG_HOST` in every deployment/EAS environment, not only the local `.env`; compare against `.env.example` and the client initialization in `lib/posthog.ts`.
- [ ] Resolve the pre-existing ESLint 9 configuration conflict by providing the expected flat config or otherwise updating the project lint setup; the failure originates at the lint configuration rather than an inspected PostHog call site.
- [ ] Launch the app and perform each instrumented interaction, then confirm the five event names arrive in PostHog and populate the dashboard; inspect the capture handlers in `app/index.tsx`, `components/posts/Post.tsx`, `app/[itemId].tsx`, and `components/comments/comment.tsx`.
- [ ] If authenticated accounts are added later, wire stable-account `identify()` and logout `reset()` at the auth boundary; there is currently no auth file or call site to verify.
