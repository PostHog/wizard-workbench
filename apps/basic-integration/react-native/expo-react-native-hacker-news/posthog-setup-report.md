# PostHog setup report

PostHog analytics was installed and initialized for the Expo React Native Hacker News reader, with five reader-interaction events, global error autocapture, and a starter dashboard.

## Installed and initialized

- Installed `posthog-react-native` (`^4.61.1`) and `react-native-config` (`^1.6.1`) using npm; `react-native-svg` was already present. `package.json` and `package-lock.json` were updated.
- Added `app.config.js` to expose `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` through Expo Constants.
- Added a guarded singleton in `lib/posthog.ts`, initialized once and provided globally by `PostHogProvider` in `app/_layout.tsx`.
- Real `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` values were configured in `.env`; `.env.example` documents the required keys with placeholders.
- Missing configuration throws the required development error while production capture remains a no-op. No CSP applies to this native Expo app.

## Events instrumented

These events were added at interaction handlers. The run verified that the capture calls exist at the intended call sites; it did **not** run the app or observe events arriving in PostHog.

| Event | What it measures | File |
|---|---|---|
| `story_feed_changed` | A reader selects a Hacker News feed category. | `components/Select.tsx` |
| `item_details_opened` | A reader opens an item detail or comment thread from a list. | `components/posts/Post.tsx` |
| `external_link_opened` | A reader opens a linked story in the device browser. | `components/posts/Post.tsx` |
| `author_profile_opened` | A reader opens a Hacker News author's public profile. | `app/[itemId].tsx` |
| `parent_item_opened` | A reader navigates from a comment to its parent item. | `app/[itemId].tsx` |

Capture properties are limited to non-PII interaction context (`story_type` or `source`). Hacker News author names, item IDs, titles, URLs, and other third-party or user-entered data are not sent.

## User identification

Identification was skipped. The app has no login, registration, logout, session persistence, credentials, or app-owned user model. The `userId` route parameter is a viewed Hacker News profile, not the device user's identity, so it must not be passed to `identify()`. Events remain anonymous. If authentication is added later, identify a stable app user after successful login or trusted session restoration, and call `reset()` at logout.

## Error tracking

`lib/posthog.ts` enables `posthog-react-native` error-tracking autocapture for uncaught exceptions and unhandled promise rejections. This configures global handlers and can produce `$exception` events. The run confirmed the installed type definitions support these options, but did not run the app or observe an exception event in PostHog.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1919808)

The dashboard contains three tagged trends insights—Reader engagement events, Reader navigation events, and Content interaction mix—using the five exact event names over the last 30 days. The dashboard and insights were created successfully, but they are intentionally valid before event ingestion; no event volume was verified.

## Verification status and unresolved issues

Verified by the run:

- npm dependency installation completed successfully and the dependency tree was current on review.
- The integration review corrected an unsupported `debug` option and changed the absent client from `null` to `undefined` in `lib/posthog.ts`.
- Static review found the intended capture calls and the configured initialization/error-tracking code.
- The dashboard and three insights were created in PostHog.

Not verified by the run:

- No production build or app startup was run.
- No event was observed arriving in PostHog.
- No `$exception` event was observed.
- No configured typecheck script exists.
- `npm run lint` did not reach project files: ESLint 9 requires a flat config while this project uses legacy ESLint configuration.

### Follow-up issue

The project’s lint check is unresolved: `npm run lint` fails before source analysis because ESLint 9 requires `eslint.config.*` while the project uses legacy configuration. Leaving this unresolved prevents lint validation of the generated integration code and must be addressed independently of analytics runtime verification.

## Before you merge

- [ ] Run a full production Expo build and fix any build or type errors introduced by the integration; inspect `app.config.js`, `lib/posthog.ts`, and `app/_layout.tsx` at the lines containing the PostHog configuration and provider.
- [ ] Run the test suite and update any mocks or fixtures affected by the capture calls; inspect the lines containing `capture()` in `components/Select.tsx`, `components/posts/Post.tsx`, `components/comments/comment.tsx`, and `app/[itemId].tsx`.
- [ ] Confirm `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` are set in every deploy environment, not only locally; inspect the environment-key lines in `.env.example` and the Expo mapping in `app.config.js`.
- [ ] Resolve the existing ESLint 9 versus legacy configuration conflict, then rerun lint; inspect the project ESLint configuration and the PostHog changes in `lib/posthog.ts`.
- [ ] Launch a representative app session and confirm the five custom events arrive in PostHog, then trigger an uncaught exception or unhandled rejection in a safe test environment and confirm `$exception`; inspect the capture handlers in `components/Select.tsx`, `components/posts/Post.tsx`, `components/comments/comment.tsx`, `app/[itemId].tsx`, and error-tracking options in `lib/posthog.ts`.
