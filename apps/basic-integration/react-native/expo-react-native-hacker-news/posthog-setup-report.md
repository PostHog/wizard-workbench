# PostHog setup report

PostHog was added to the Expo React Native Hacker News app with anonymous discovery-event tracking, JavaScript error tracking, and a starter analytics dashboard.

## Installed and initialized

- Installed `posthog-react-native` with the detected npm package manager via `npm add posthog-react-native`; `npm install` later confirmed the dependency tree was up to date. The install reported 1,130 packages added and audit warnings were reported by npm.
- PostHog is initialized as a singleton in `lib/posthog.ts` using the Expo public environment variables `EXPO_PUBLIC_POSTHOG_KEY` and `EXPO_PUBLIC_POSTHOG_HOST`.
- The singleton is mounted through the Expo Router layout in `app/_layout.tsx`. The reviewed implementation conditionally mounts the provider and error boundary only when a configured client exists, and capture call sites use that singleton.
- `.env.example` documents the required environment-variable names; the configured values were written to the local `.env` through wizard tools. Deployment environments still need their own configuration.

## Events instrumented

These are instrumented event definitions from `.posthog-wizard-cache/.posthog-events.json`. The run did not exercise the app or observe events arriving in PostHog, so these are implementation contracts, not confirmed ingested events.

| Event name | What it measures | File |
|---|---|---|
| `story_type_changed` | A visitor selects a Hacker News story feed category. | `app/index.tsx` (capture call at line 20) |
| `story_opened` | A visitor opens a story, either in its detail view or an external browser. | `components/posts/Post.tsx` (capture call at line 38) |
| `comments_opened` | A visitor opens a story's comments and detail view. | `components/posts/Post.tsx` (capture call at line 74) |
| `external_link_opened` | A visitor opens the external URL attached to a story. | `components/posts/Post.tsx` (capture call at line 98) |

The capture properties use bounded public story metadata, comment counts, destinations, and link hosts. Hacker News author/profile identifiers and other user-entered PII were not used.

## User identification

Identification was skipped. The app has no login, registration, persisted session, current-user state, or logout boundary; the available Hacker News profile route parameters represent viewed public content rather than an authenticated app account. Captures therefore remain anonymous. If first-party authentication is added later, identify after successful authentication with a stable non-PII account ID and reset on logout.

## Error tracking

- `lib/posthog.ts` configures SDK JavaScript exception autocapture for uncaught exceptions and unhandled promise rejections.
- `app/_layout.tsx` wraps the Expo Router stack with `PostHogErrorBoundary` and a minimal fallback.
- Native crash capture was not added because it requires an optional native plugin and a separate native build setup.
- No runtime exception was generated, so error delivery was not observed.

## Verification and dashboard

- `npm install` completed successfully without dependency-resolution changes.
- `npx tsc --noEmit` completed with no output after the review fixes.
- No test suite was run.
- Runtime event delivery and startup were not exercised; the dashboard insights may remain empty until events arrive.
- Dashboard: [Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1935677). It contains four attached insights covering feed changes, story opens, engagement actions, and the feed-to-story funnel.

## Unresolved issue

- The project lint command remains blocked by a pre-existing ESLint 9 configuration mismatch: `expo lint` cannot find an `eslint.config.*` file. This prevents lint verification; it was not caused by the PostHog edits and should be resolved before relying on lint results.

## Before you merge

- [ ] Run a full production Expo build and fix any build or type errors introduced by the integration; the run only verified `npx tsc --noEmit`.
- [ ] Run the test suite and update mocks or fixtures if the instrumented handlers require it; no tests were run in this setup.
- [ ] Configure `EXPO_PUBLIC_POSTHOG_KEY` and `EXPO_PUBLIC_POSTHOG_HOST` from `.env.example` in every development/preview/production deployment environment, not only the local `.env`.
- [ ] Resolve the lint configuration mismatch, then run lint and confirm the PostHog changes in `lib/posthog.ts`, `app/_layout.tsx`, `app/index.tsx`, and `components/posts/Post.tsx` are clean.
- [ ] Launch the app and trigger the four handlers at `app/index.tsx:20`, `components/posts/Post.tsx:38`, `components/posts/Post.tsx:74`, and `components/posts/Post.tsx:98`; confirm the corresponding events arrive in PostHog and populate the dashboard.
- [ ] If authentication is introduced, wire identify after successful login and reset at logout; no such boundary exists currently.
