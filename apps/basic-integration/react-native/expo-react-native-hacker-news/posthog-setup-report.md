# PostHog setup report

PostHog was added to the Expo React Native Hacker News reader with anonymous reader-action instrumentation, global React error tracking, and a starter dashboard.

## What was installed and initialized

- Installed `posthog-react-native` `^4.61.1` with npm; `react-native-svg` was already present as its peer dependency. The install completed successfully and updated `package.json` and `package-lock.json`.
- Created one nullable PostHog client in `lib/posthog.ts`, initialized from the Expo build-time variables `EXPO_PUBLIC_POSTHOG_PROJECT_TOKEN` and `EXPO_PUBLIC_POSTHOG_HOST`.
- Added a development-only configuration error when either variable is missing; production remains a no-op without configuration.
- Wrapped the Expo Router stack with `PostHogProvider` when configured, and retained the existing stack when it is not. Real environment values are configured in `.env`; `.env.example` documents the variable names with placeholders.
- No CSP changes were needed because this is a native Expo app.

## Instrumented events

These events were added to reachable press/action handlers. The run did not launch the app or observe events arriving in PostHog, so these are instrumented events, not verified deliveries.

| Event | What it measures | File(s) |
|---|---|---|
| `story_type_selected` | Reader switches the Hacker News story feed category. | `components/Select.tsx` |
| `story_opened` | Reader opens a story from the feed, either in-app or externally. | `components/posts/Post.tsx` |
| `comment_thread_opened` | Reader opens a post, nested comment, or parent-item discussion. | `components/posts/Post.tsx`, `components/comments/comment.tsx`, `app/[itemId].tsx` |
| `profile_opened` | Reader opens a public Hacker News author profile. | `components/comments/comment.tsx`, `app/[itemId].tsx` |
| `external_link_opened` | Reader opens an external story link. | `components/posts/Post.tsx`, `app/[itemId].tsx` |

All captures are intentionally anonymous/personless and use non-PII interaction context plus numeric Hacker News item IDs. No stable app-user identity or placeholder distinct ID was introduced.

## Identification

User identification was skipped. The app is a public Hacker News reader with no app-owned authentication, registration, session persistence, login/logout lifecycle, or authenticated user state. Public Hacker News author IDs must not be used as app-user identities. Events therefore remain anonymous until a genuine app authentication boundary exists.

## Error tracking

`PostHogErrorBoundary` was mounted inside `PostHogProvider` around the Expo Router stack in `app/_layout.tsx`. This uses the SDK-provided global boundary for React rendering errors. No manual error-capture calls were added. The run did not build or run the app, so error delivery was not observed.

## Dashboard

[Open the Analytics basics (wizard) dashboard](https://us.posthog.com/project/483112/dashboard/1926632)

The dashboard contains five tagged insights covering reader activity over time, feed categories, discussion engagement, the story-to-external-link journey, and reader destinations. They use the five instrumented event names over a rolling 30-day range. The dashboard and insights are live, but may be empty until the app sends events; the run did not confirm event arrival.

## Verification and unresolved issues

- `npm install` completed successfully and dependencies were up to date.
- The review confirmed one global client, provider/error-boundary wiring, reachable anonymous captures, valid snake_case event names, and no applicable CSP.
- `npm run lint` was attempted but failed before linting source because ESLint 9 rejected the pre-existing legacy `.eslintrc.js` configuration and requires `eslint.config.js`. The lint configuration was not changed.
- No production build, test suite, or live app session was run. Consequently, compilation, event delivery, and error delivery remain unconfirmed.
- Attribution remains intentionally unresolved: without app-owned authentication, events cannot be tied to a signed-in app user. Adding an identity later without a real authenticated boundary could fragment or misattribute analytics.

## Before you merge

- [ ] Run a full production Expo build and fix any integration-related build or type errors; the run did not perform a production build. Inspect `lib/posthog.ts` and `app/_layout.tsx`.
- [ ] Run the test suite and update any mocks or fixtures affected by the new client/provider and action captures. Inspect `components/Select.tsx`, `components/posts/Post.tsx`, `components/comments/comment.tsx`, and `app/[itemId].tsx`.
- [ ] Set `EXPO_PUBLIC_POSTHOG_PROJECT_TOKEN` and `EXPO_PUBLIC_POSTHOG_HOST` in every deploy environment, not only local `.env`; confirm the names in `.env.example` and `lib/posthog.ts`.
- [ ] Resolve the pre-existing lint configuration conflict (`npm run lint` fails because ESLint 9 requires `eslint.config.js` while the project has legacy `.eslintrc.js`) before relying on lint as a merge check.
- [ ] Exercise the instrumented reader actions in a running build and confirm the five event names arrive in PostHog; the run only verified source callsites, not delivery.
- [ ] Confirm the anonymous behavior is acceptable for product analytics, and add `identify()`/`reset()` only when a genuine app authentication lifecycle exists; do not use Hacker News author IDs. Inspect the auth boundary when one is added.
