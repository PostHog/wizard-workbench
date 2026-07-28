# PostHog setup report

PostHog was installed and initialized for this React Native app, with identity-aware product events, global error tracking, and a starter analytics dashboard.

## What was set up

- Installed `posthog-react-native` 4.61.0 and `react-native-svg` 15.15.5 with pnpm.
- Installed `react-native-config` 1.6.1 and added its Android dotenv Gradle hook so native builds receive the PostHog configuration.
- Initialized one PostHog client in `src/config/posthog.js`, using `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from `react-native-config`. Development reports missing configuration; production uses a no-op fallback when configuration is unavailable.
- Mounted `PostHogProvider` in `src/routes.js` inside `NavigationContainer`, only when a configured client exists.
- Added the environment names to `.env.example`; local environment values were configured during the run.
- No CSP changes were needed because this is a native React Native app.

## Events instrumented

These event call sites were verified in the event plan and source review. The run did **not** launch the app or observe events arriving in PostHog, so delivery and event volume remain unconfirmed.

| Event | What it measures | File |
|---|---|---|
| `user_logged_in` | A user successfully completes demo or API sign-in. | `src/store/modules/auth/sagas.js` |
| `user_logged_out` | An authenticated user explicitly signs out before analytics identity is reset. | `src/store/modules/auth/sagas.js` |
| `team_created` | A new workspace team is created successfully. | `src/store/modules/teams/sagas.js` |
| `team_selected` | A user changes the active workspace team. | `src/components/TeamSwitcher/index.js` |
| `project_created` | A project is created successfully in the active team. | `src/store/modules/projects/sagas.js` |
| `member_invited` | An invitation is sent or a demo member is added successfully. | `src/store/modules/members/sagas.js` |
| `member_roles_updated` | A member's role assignment is updated successfully. | `src/store/modules/members/sagas.js` |

Captures use the configured singleton and inherit the SDK-persisted identity. Event properties distinguish demo and API completion paths without placing user-entered names, titles, emails, or other PII on events.

## Identification

Identification was wired in `src/store/modules/auth/sagas.js`:

- Demo login identifies the fixed `demo-user` account and stores its email as a person property.
- API login identifies immediately after authentication and persists identity metadata for restoration.
- Session initialization re-identifies the known user after application restart.
- Logout resets PostHog before clearing local storage.

### Follow-up issue: temporary API identity

The session response currently exposes only a token, not a durable user primary key or UUID. API login therefore uses the user's email as a temporary distinct-ID fallback. This is not included in event properties, but it can fragment or expose identity semantics in analytics. The API/auth layer should expose a durable user ID, then the identification call in `src/store/modules/auth/sagas.js` should replace the fallback before relying on authenticated-user analytics.

## Error tracking

`src/config/posthog.js` enables `posthog-react-native` error-tracking autocapture for uncaught exceptions, unhandled promise rejections, and console errors. The run verified the installed SDK type definitions and configuration, but did not launch the app or observe an error event in PostHog.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1918322)

The dashboard contains four insights: an authentication-to-workspace conversion funnel, a core product events daily trend, a team engagement trend, and a membership management activity trend. The insights were created from the intended event names; they may remain empty until the app sends events.

## Verification and conflicts

- `pnpm lint` completed successfully with 18 warnings. The warnings were reported as pre-existing and unrelated to this integration; no lint errors were introduced by the reviewed changes.
- No permitted native build or typecheck script exists. The Android command was blocked by the runtime allowlist, and iOS pods/build were not run because the run environment is Linux.
- No app launch, production build, test suite, or live PostHog event delivery was observed.
- Full build conflict: native build execution could not be verified. `pnpm android` was blocked by the runtime allowlist; the package has no permitted build or typecheck script; iOS pod installation/build was not run on Linux. The Android dotenv hook and dependencies were added, but native compilation remains unconfirmed.

## Before you merge

- [ ] Run a full Android and iOS production build. Inspect `src/config/posthog.js`, `src/routes.js`, `android/app/build.gradle`, `package.json`, and the native iOS dependency setup for build errors; the wizard only verified lint and file-level configuration.
- [ ] Run the test suite and update any mocks or fixtures affected by the new PostHog client and saga captures, especially `src/store/modules/auth/sagas.js`, `src/store/modules/teams/sagas.js`, `src/store/modules/projects/sagas.js`, `src/store/modules/members/sagas.js`, and `src/components/TeamSwitcher/index.js`.
- [ ] Confirm `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` match the names in `.env.example` and are configured in every deployment environment, not only the local `.env` used during setup.
- [ ] Replace the temporary email-based API distinct-ID fallback in `src/store/modules/auth/sagas.js` after the API exposes a durable user ID or UUID.
- [ ] Run the app through sign-in, team/project creation, team selection, member invitation, role update, and logout, then confirm the seven named events and an error-tracking event arrive in PostHog. The setup run did not observe live delivery.
- [ ] Verify the returning-session path in `src/store/modules/auth/sagas.js` restores the expected identity and that logout starts subsequent activity under a new anonymous identity.
