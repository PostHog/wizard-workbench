# PostHog setup report

PostHog analytics was installed and initialized for the Expo Router Hacker News reader, with six personless reader-interaction events, centralized uncaught JavaScript error capture, and a starter dashboard.

## Installed and initialized

- Installed `posthog-react-native` with npm; `package.json` and `package-lock.json` were updated. No server-side SDK was added because this client app has no server event-sending code in scope.
- `lib/posthog.ts` reads `EXPO_PUBLIC_POSTHOG_PROJECT_TOKEN` and `EXPO_PUBLIC_POSTHOG_HOST`, creates the client only when a token is configured, and logs development configuration warnings when required values are missing.
- `app/_layout.tsx` supplies the configured client through `PostHogProvider`, while preserving the existing stack when configuration is absent.
- `.env.example` documents both environment variable names. The run recorded that the actual `.env` was configured through wizard tooling; deployment environments still need their own values.
- The run verified dependency installation and source-file wiring. It did **not** verify event delivery from a running device or production build.

## Events instrumented

These are instrumented call sites and the event contract recorded by the run. No event was observed arriving in PostHog during this run.

| Event name | What it measures | File |
|---|---|---|
| `story_feed_selected` | Reader selects a Hacker News story feed category. | `app/index.tsx` |
| `story_opened` | Reader opens an internal Hacker News story or comment thread. | `components/posts/Post.tsx` |
| `external_story_opened` | Reader opens a story’s external destination. | `components/posts/Post.tsx` |
| `story_external_link_opened` | Reader opens the external link from a story detail view. | `app/[itemId].tsx` |
| `author_profile_opened` | Reader opens a public Hacker News author profile from a story or comment. | `app/[itemId].tsx`, `components/comments/comment.tsx` |
| `comment_thread_opened` | Reader opens a nested comment thread. | `components/comments/comment.tsx` |

The captures are intentionally personless and use non-PII interaction context. Hacker News author identifiers and story content are not sent as event properties.

## Identification

User identification was skipped. The app has no authentication, registration, session, logout, or current-user concept; Hacker News author identifiers are content authors, not app-user identities. If accounts are introduced later, identify a stable account ID after login or registration and reset on logout. Until then, events rely on anonymous SDK device/session context.

## Error tracking

`lib/posthog.ts` installs React Native’s global `ErrorUtils` handler when PostHog is configured. Uncaught JavaScript exceptions are sent with a non-PII `fatal` property, then delegated to the original handler so normal crash behavior remains intact. The run verified the source wiring but did not trigger an exception or observe an error arrive in PostHog.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1902684) contains five wizard-tagged insight tiles based on the captured event names. The dashboard was created successfully and is expected to remain empty until events are ingested; the run did not confirm populated data.

## Build and verification status

- `npm install` completed successfully and dependencies were current.
- `npm run lint` failed before source linting because ESLint 9.39.2 could not find `eslint.config.js`, while the project uses legacy ESLint configuration. This is a pre-existing project-wide configuration mismatch, not an integration-code lint failure.
- No build or typecheck script exists in `package.json`; no production build, typecheck, test run, device run, or event-delivery verification was recorded.

## Unresolved issues to follow up

- The run could not establish that events or exceptions reach PostHog because no device-level execution was performed. If left unresolved, the dashboard can remain empty even though the code compiles.
- There is no stable authenticated user identity by design. If account features are added without wiring identify/reset, activity will remain anonymous and user histories may fragment.

## Before you merge

- [ ] Run a full production Expo build and fix any integration-related build or type errors; the run only verified the touched source wiring and dependency installation.
- [ ] Run the test suite (`package.json` script: `test`) and update mocks or fixtures if the instrumented handlers require them.
- [ ] Confirm `EXPO_PUBLIC_POSTHOG_PROJECT_TOKEN` and `EXPO_PUBLIC_POSTHOG_HOST` from `.env.example` are set in every deploy environment, not only local `.env` (`.env.example`, `lib/posthog.ts` lines 3–4).
- [ ] Resolve the legacy ESLint configuration mismatch (`package.json` `lint` script and the project’s missing `eslint.config.js`), then rerun lint to confirm the generated code passes.
- [ ] Run the app on a device or simulator, exercise each handler in `app/index.tsx`, `app/[itemId].tsx`, `components/posts/Post.tsx`, and `components/comments/comment.tsx`, and confirm the six events appear in PostHog.
- [ ] Trigger a controlled uncaught JavaScript exception in a non-production test environment and confirm error tracking receives it from `lib/posthog.ts` without changing normal exception handling.
