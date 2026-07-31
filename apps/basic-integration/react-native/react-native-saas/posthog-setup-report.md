# PostHog setup report

PostHog product analytics, user identity, error tracking, and a starter dashboard were added to this React Native app.

## What was set up

- Installed `posthog-react-native` 4.61.2, `react-native-config` 1.6.1, and `react-native-svg` 15.15.5 with pnpm. The lockfile is current.
- Initialized one shared PostHog client in `src/config/posthog.js`, loading `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` through `react-native-config`. Missing configuration fails loudly in development and remains a production no-op.
- Added the client provider inside `NavigationContainer` in `src/routes.js`, matching React Navigation v7 requirements.
- Configured global SDK error tracking for uncaught exceptions and unhandled promise rejections in `src/config/posthog.js`.
- Added `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to the local environment through the wizard environment workflow and documented the names in `.env.example`.

## Events instrumented

The following eight events are planned and have guarded capture calls at the successful or relevant saga paths. The run did not start the app or observe events arriving in PostHog, so capture delivery remains unconfirmed.

| Event | What it measures | File |
|---|---|---|
| `sign_in_succeeded` | A successful demo or API authentication | `src/store/modules/auth/sagas.js` |
| `sign_in_failed` | A rejected or errored sign-in attempt | `src/store/modules/auth/sagas.js` |
| `signed_out` | An authenticated user signing out before identity reset | `src/store/modules/auth/sagas.js` |
| `project_created` | Successful project creation in the active team | `src/store/modules/projects/sagas.js` |
| `team_created` | Successful team creation | `src/store/modules/teams/sagas.js` |
| `team_selected` | Switching the active team workspace | `src/store/modules/teams/sagas.js` |
| `member_invited` | Successfully adding or inviting a team member | `src/store/modules/members/sagas.js` |
| `member_roles_updated` | Successfully changing a member’s team roles | `src/store/modules/members/sagas.js` |

Event properties are categorical method values only; no email or other user-entered PII is sent in event properties.

## User identification

Identification is wired after successful demo and API sign-ins, restored during token-based session initialization, and reset on sign-out. Review replaced the earlier email distinct ID with a persisted random authenticated-session ID; email is retained only as a person property. The backend currently exposes no stable user primary key or UUID, so attribution to a durable backend user remains unresolved. If left unresolved, events can remain fragmented across authenticated sessions rather than representing one backend user. Replace the locally persisted session ID with the backend user ID when the API provides one.

## Error tracking

The SDK singleton enables `errorTracking.autocapture.uncaughtExceptions` and `unhandledRejections` in `src/config/posthog.js`. This is configured for PostHog Error Tracking, not a product event. The run did not start the app, so delivery of an exception to PostHog was not observed.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1935691)

The dashboard contains four insights covering authentication activity, workspace creation, team engagement, and a sign-in-to-project-activation funnel. They use the planned event names over the last 30 days and may initially be empty until the app emits events. Dashboard creation and insight attachment were confirmed by PostHog; event population was not.

## Verification and conflicts

- `pnpm install` completed successfully and reported the lockfile was up to date.
- `pnpm lint` completed successfully with no lint errors. It reported 18 pre-existing warnings in untouched files.
- Native Android/iOS compilation was not verified. The attempted `pnpm android` command was rejected by the harness command allowlist before execution, not by the project build.
- An unrelated dependency warning remains: `react-native-reanimated` 4.5.3 expects `react-native-worklets` 0.10.x–0.11.x, while the project has 0.7.4.

## Before you merge

- [ ] Run a full production Android and iOS build and resolve any native integration issues; compilation was unavailable in this run. Review `src/config/posthog.js` and `src/routes.js` as the initialization/provider boundaries.
- [ ] Run the test suite and update mocks or fixtures for the instrumented saga call sites in `src/store/modules/auth/sagas.js`, `src/store/modules/projects/sagas.js`, `src/store/modules/teams/sagas.js`, and `src/store/modules/members/sagas.js`.
- [ ] Confirm `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from `.env.example` are configured in every deployment/build environment, not only the local `.env`.
- [ ] Exercise sign-in, sign-out, project/team/member actions in a running build and confirm the eight events arrive in PostHog; the run only verified source placement and lint.
- [ ] Replace the persisted random authenticated-session ID in `src/store/modules/auth/sagas.js` with a backend stable user ID when the API exposes one, while keeping email only in the person property.
- [ ] If the existing `react-native-reanimated` dependency is retained, resolve or explicitly accept the `react-native-worklets` peer-version warning before release.
