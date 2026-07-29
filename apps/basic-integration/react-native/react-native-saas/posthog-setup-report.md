# PostHog setup report

PostHog was installed and initialized for the React Native app, with seven product events, authenticated-user identity handling, React error tracking, and a starter dashboard.

## What was installed and initialized

- Added `posthog-react-native` 4.61.1 and `react-native-svg` 15.15.5 with pnpm.
- Added `react-native-config` and the required Android dotenv Gradle integration in `android/app/build.gradle`.
- Created a shared PostHog singleton in `src/config/posthog.js`, configured from `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST`.
- Mounted `PostHogProvider` inside `NavigationContainer` in `src/routes.js`, using the shared singleton.
- The configured environment keys are documented in `.env.example` and were confirmed present locally; their values were not read by the verification step.

## Events instrumented

| Event | What it measures | File |
|---|---|---|
| `user_signed_in` | Successful sign-in through demo or API authentication | `src/store/modules/auth/sagas.js` |
| `user_signed_out` | Authenticated user signing out before analytics identity reset | `src/store/modules/auth/sagas.js` |
| `team_created` | Successful creation of a workspace team | `src/store/modules/teams/sagas.js` |
| `team_selected` | User changing the active workspace team | `src/components/TeamSwitcher/index.js` |
| `project_created` | Successful creation of a project in the active team | `src/store/modules/projects/sagas.js` |
| `member_role_updated` | Successful update of a member’s workspace roles | `src/store/modules/members/sagas.js` |
| `member_invited` | Successful creation of a workspace-member invitation | `src/store/modules/members/sagas.js` |

The run verified that these capture calls exist at the intended successful action branches or explicit selection handler. It did **not** observe events arriving in PostHog; the dashboard insights may therefore be empty until the app is exercised.

## User identification

Identification is wired in `src/store/modules/auth/sagas.js`: successful demo and API logins call `identify`, and sign-out calls `reset` before authentication storage is cleared. No stable user ID was available in the inspected flows, so the submitted email is used as the fallback distinct ID and as a person property. Identity is not restored on application launch because only the token is persisted; restarted authenticated sessions can remain anonymous until a stable user profile or ID is persisted and identified.

## Error tracking

`src/routes.js` wraps the application navigator with the SDK-provided `PostHogErrorBoundary` beneath `PostHogProvider`. This covers React render/lifecycle errors. Native or runtime exceptions outside the React tree were not manually wrapped, and no runtime error event was observed during this run.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1924724) was created with five insights: authentication activity, sign-in to workspace conversion, workspace creation, team selection, and member management. The dashboard and insight definitions were confirmed created; event volume was not confirmed.

## Verification and unresolved issues

- `pnpm lint` completed with zero errors. It reported 18 pre-existing warnings in unrelated application files.
- No production build, typecheck, test suite, or runtime event-flow check was run. A passing lint check verifies syntax/lint health only; it does not prove that events flow to PostHog.
- The project has no build or typecheck script in `package.json`.
- Existing dependency conflict: pnpm reports that `react-native-reanimated` requires `react-native-worklets` 0.10.x–0.11.x, while the project has 0.7.4. Installation completed and lint was clean, but this peer mismatch remains unresolved.
- iOS pod installation/build was not validated because no corresponding package script exists and the review step could not run the normal macOS workflow.
- Attribution remains unresolved after app restart: no stable user identifier was available beyond the email fallback, and launch-time identity restoration was not implemented. If left alone, post-restart events can be attributed to anonymous IDs and fragment user histories.

## Before you merge

- [ ] Run the full Android and iOS production builds and inspect the PostHog initialization in `src/config/posthog.js`, provider and error-boundary wiring in `src/routes.js`, and native environment setup in `android/app/build.gradle`.
- [ ] Run the test suite and update mocks or fixtures for the `identify`, `reset`, and `capture` call sites in `src/store/modules/auth/sagas.js`, `src/store/modules/teams/sagas.js`, `src/store/modules/projects/sagas.js`, `src/store/modules/members/sagas.js`, and `src/components/TeamSwitcher/index.js`.
- [ ] Confirm `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from `.env.example` are configured in every deployment environment, not only local `.env`.
- [ ] Exercise sign-in, sign-out, team/project/member actions, and team selection, then confirm the seven named events arrive in PostHog; also verify the React error boundary in `src/routes.js` reports a test render error.
- [ ] Decide how to obtain and persist a stable user ID, then add launch-time identification alongside the login identification in `src/store/modules/auth/sagas.js` before relying on cross-session attribution.
- [ ] Resolve or explicitly accept the `react-native-reanimated`/`react-native-worklets` peer mismatch reported during dependency installation before release.
