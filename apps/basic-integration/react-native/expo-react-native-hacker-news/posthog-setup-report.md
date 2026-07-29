# PostHog setup report

PostHog was added to the Expo React Native Hacker News reader with anonymous product-event instrumentation, global error tracking, and a starter analytics dashboard.

## Installed and initialized

- Installed `posthog-react-native` at `^4.61.1`; `react-native-svg` was already present as its required peer dependency. No server-side PostHog package was added because the API directory only fetches Hacker News data.
- Initialized one shared client in `lib/posthog.ts`, using `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` exposed through Expo config in `app.config.js`.
- Wrapped the Expo Router tree with `PostHogProvider` and `PostHogErrorBoundary` in `app/_layout.tsx`.
- Added `.env.example` documenting the required environment names. The run set both keys in the local `.env`; deploy environments still need their own configuration.
- Production initialization is guarded: when either required value is absent, the client is a no-op; development reports missing configuration. The run did not runtime-exercise Expo configuration or event delivery.

## Events instrumented

These are the nine event definitions recorded by the run. The run verified capture calls at the intended handlers, but did **not** observe any event arrive in PostHog; the dashboard may therefore be empty until the app is exercised.

| Event | What it measures | File |
|---|---|---|
| `story_type_selected` | Reader selects a Hacker News story feed. | `components/Select.tsx` |
| `story_opened` | Reader opens a story from a feed, externally or in discussion view. | `components/posts/Post.tsx` |
| `story_score_tapped` | Reader taps a story score control. | `components/posts/Post.tsx` |
| `story_comments_opened` | Reader opens a story discussion from a feed. | `components/posts/Post.tsx` |
| `story_external_link_opened` | Reader opens a story’s external link from its discussion view. | `app/[itemId].tsx` |
| `author_profile_opened` | Reader opens a Hacker News author profile from story or comment metadata. | `app/[itemId].tsx` and `components/comments/comment.tsx` |
| `comment_score_tapped` | Reader taps a comment score control. | `components/comments/comment.tsx` |
| `comment_thread_opened` | Reader opens a nested comment thread. | `components/comments/comment.tsx` |
| `parent_item_opened` | Reader navigates from a comment to its parent item. | `app/[itemId].tsx` |

Event properties use numeric content IDs and non-PII source/destination labels. External Hacker News author names are not sent as event properties.

## Identity

User identification was skipped. The app has no login, registration, session, logout, or app-owned user model, so custom events and errors remain anonymous. Hacker News author identifiers are third-party content data, not authenticated identities for this app. If authentication is added later, identify once with that account’s stable internal ID and reset on logout.

## Error tracking

The shared SDK client enables uncaught-exception and unhandled-rejection autocapture in `lib/posthog.ts`. `PostHogErrorBoundary` in `app/_layout.tsx` covers render errors. These are intended to feed PostHog `$exception` events. No exception was generated or observed during this run.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1924701)

The dashboard contains five wizard-tagged insights covering feed selections, story engagement, discussion navigation, author-profile interest, and story-to-discussion conversion. Definitions were created from the event plan; ingestion was not verified.

## What the run verified and did not verify

- Verified: dependency installation, source wiring, event capture call locations, environment-key presence, and TypeScript compilation without diagnostics.
- Verified: `npm install` completed successfully and dependencies were current.
- Not verified: a production Expo build, runtime boot, network delivery, or any event appearing in PostHog.
- Not verified: Expo evaluating environment values in a release build; that remains an assumption from the initialization step.

## Build and tooling conflicts

The review reported that `npm run lint` fails before linting because ESLint 9 cannot load the project’s legacy `.eslintrc.js`. No build or typecheck script is defined in `package.json`. `npm exec tsc --noEmit` completed without TypeScript diagnostics, although npm warned that `--noEmit` was treated as an unknown npm CLI config. The existing lint configuration was not changed, and no other build conflict was reported.

## Before you merge

- [ ] Run a full production Expo build and fix any build or type errors introduced by the integration; the run only verified touched files and TypeScript diagnostics. Check `app.config.js`, `lib/posthog.ts`, and `app/_layout.tsx`.
- [ ] Run the test suite and update any mocks or fixtures affected by the new provider and capture calls. Check `app/_layout.tsx`, `components/Select.tsx`, `components/posts/Post.tsx`, `app/[itemId].tsx`, and `components/comments/comment.tsx`.
- [ ] Resolve the existing lint-tooling failure, or confirm the project’s intended ESLint 9 migration, because `npm run lint` currently fails before linting. Check `.eslintrc.js` and `package.json`.
- [ ] Set `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` in every development, preview, and production build environment, not only local `.env`; keep the exact names documented in `.env.example` and exposed by `app.config.js`.
- [ ] Exercise each instrumented interaction in a development or release build and confirm the corresponding events arrive in project 483112; event delivery was not observed by this run. Check the handlers at `components/Select.tsx:91`, `components/posts/Post.tsx:39`, `components/posts/Post.tsx:55`, `components/posts/Post.tsx:76`, `app/[itemId].tsx:79`, `app/[itemId].tsx:175`, `app/[itemId].tsx:210`, `components/comments/comment.tsx:39`, `components/comments/comment.tsx:88`, and `components/comments/comment.tsx:110`.
- [ ] Trigger a controlled render or unhandled-error scenario in a safe test environment and confirm `$exception` arrives in PostHog; error delivery was not observed. Check `lib/posthog.ts` and `app/_layout.tsx`.
