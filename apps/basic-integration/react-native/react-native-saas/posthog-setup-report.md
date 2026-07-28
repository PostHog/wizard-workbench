# PostHog setup report

PostHog was installed and initialized for this React Native app, with authentication, workspace activity, member-management events, JavaScript error tracking, and a starter dashboard configured.

## What was set up

- Installed `posthog-react-native` `^4.61.1` and `react-native-svg` `^15.15.5`; `react-native-config` `1.6.1` is also recorded in the synchronized lockfile.
- Added a single shared client in `src/config/posthog.js`, configured from `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST`, and placed `PostHogProvider` inside the existing `NavigationContainer` in `src/routes.js`.
- The environment key names are documented in `.env.example` and are present in the local `.env`. Secret values were not read or copied into source.
- Wired identification after successful demo and API sign-ins in `src/store/modules/auth/sagas.js`, storing the submitted email as a person property. Logout captures `signed_out` and then calls `posthog.reset()`.

## Events instrumented

These are instrumented event definitions from `.posthog-wizard-cache/.posthog-events.json`. The run verified that the capture calls exist in the listed saga files; it did **not** observe events arriving in PostHog.

| Event | What it measures | File |
|---|---|---|
| `sign_in_succeeded` | A user successfully completes authentication | `src/store/modules/auth/sagas.js` |
| `sign_in_failed` | A sign-in attempt fails authentication | `src/store/modules/auth/sagas.js` |
| `signed_out` | An authenticated user signs out | `src/store/modules/auth/sagas.js` |
| `project_created` | A project is created successfully | `src/store/modules/projects/sagas.js` |
| `team_created` | A team is created successfully | `src/store/modules/teams/sagas.js` |
| `team_selected` | A user switches the active team | `src/store/modules/teams/sagas.js` |
| `member_invited` | An invitation is sent or a member is added successfully | `src/store/modules/members/sagas.js` |
| `member_role_updated` | A member's role assignment is updated successfully | `src/store/modules/members/sagas.js` |

Event properties were reviewed as non-PII operational metadata. Project, team, member, and invite details were not added to event properties.

## Identification status

Identification was wired for successful sign-ins. The authentication response exposed a token but no stable user primary key, so the submitted email is used as the PostHog distinct ID and stored on the person. The SDK is expected to persist identity across sessions, but the run did not independently verify that behavior or observe attributed events. No explicit stable ID is available in the current authentication response.

## Error tracking

JavaScript error-tracking autocapture was enabled in `src/config/posthog.js` for uncaught exceptions and unhandled promise rejections, feeding `$exception` events. Native iOS/Android crash capture was not added because the optional native crash plugin was not installed.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1919809)

The dashboard contains four configured insights covering authentication successes, workspace creation, member growth, and sign-in-to-workspace activation. The insights may remain empty until the app emits events; event delivery was not observed during this run.

## Verification and unresolved items

- `pnpm install` completed successfully.
- `pnpm lint` completed with zero errors and 18 pre-existing warnings in unrelated UI files.
- No production Android/iOS build or typecheck was run because no dedicated build/typecheck script exists in `package.json` and native emulator/SDK setup was not verified.
- No test suite was run by the review step.
- No event arrival, identity attribution, or native crash capture was observed.

### Follow-up issues

- **Stable attribution remains unresolved:** the authentication API exposes no stable user ID, so `src/store/modules/auth/sagas.js` uses email as the distinct ID. If the backend later exposes a non-PII stable account ID, replace this identity choice before relying on cross-session attribution.
- **Native crash coverage remains unresolved:** only JavaScript uncaught exceptions and unhandled promise rejections are configured in `src/config/posthog.js`; native iOS/Android crashes will not be covered unless the native crash integration is added.

## Before you merge

- [ ] Run a full production Android and iOS build and fix any integration errors; the run only verified lint and file-level wiring. Pay particular attention to `src/config/posthog.js` and `src/routes.js`.
- [ ] Run the test suite and update mocks or fixtures for the saga changes in `src/store/modules/auth/sagas.js`, `src/store/modules/projects/sagas.js`, `src/store/modules/teams/sagas.js`, and `src/store/modules/members/sagas.js`.
- [ ] Confirm `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from `.env.example` are set in every deployment environment, not only local `.env`.
- [ ] Exercise sign-in, sign-out, project/team/member flows and confirm the eight named events arrive in PostHog with the expected attribution; the run did not observe delivery.
- [ ] Decide whether a stable backend user ID can replace the email distinct ID in `src/store/modules/auth/sagas.js` before production attribution is treated as definitive.
