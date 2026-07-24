# PostHog setup report

PostHog analytics was installed and initialized for the React Native app, with identity, seven product events, global error tracking, and a starter dashboard configured.

## What was installed and initialized

- Installed with pnpm: `posthog-react-native` 4.60.0, `react-native-svg` 15.15.5, and `react-native-config` 1.6.1. The lockfile was current after `pnpm install`.
- PostHog is initialized once in `src/config/posthog.js` from `react-native-config` values (`POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST`). A development-time missing-token error is configured.
- `PostHogProvider` wraps the navigator inside `NavigationContainer` in `src/routes.js`.
- Android now applies the `react-native-config` dotenv Gradle hook in `android/app/build.gradle`, so configured values can be embedded in Android builds.
- The environment keys are documented in `.env.example` and were present in the local `.env` during review.

## Events instrumented

These events are instrumented on successful Redux saga outcomes. The run did **not** launch the app or observe events arriving in PostHog, so event delivery and dashboard data remain unconfirmed.

| Event | What it measures | File |
|---|---|---|
| `user_signed_in` | A user successfully signs in through demo or API authentication. | `src/store/modules/auth/sagas.js` |
| `user_signed_out` | An authenticated user initiates sign-out before analytics identity resets. | `src/store/modules/auth/sagas.js` |
| `team_created` | A user successfully creates a workspace team. | `src/store/modules/teams/sagas.js` |
| `team_selected` | A user selects the active workspace team. | `src/store/modules/teams/sagas.js` |
| `project_created` | A user successfully creates a project in the active team. | `src/store/modules/projects/sagas.js` |
| `member_invited` | A user successfully sends or creates a team member invitation. | `src/store/modules/members/sagas.js` |
| `member_role_updated` | A user successfully updates a team member's assigned roles. | `src/store/modules/members/sagas.js` |

## User identification

Identification is wired after successful demo and API sign-ins in `src/store/modules/auth/sagas.js:46` and `src/store/modules/auth/sagas.js:65`; logout captures `user_signed_out` and then resets identity at lines 78–79. The available authentication response exposes no stable user ID, so the email is currently used as the fallback distinct ID and person property. No identify call was added during session restoration because the persisted token cannot safely provide a distinct ID.

### Unresolved issue

A stable user identifier remains unresolved. Every event after login inherits the email-based fallback identity from `src/store/modules/auth/sagas.js:46` and `src/store/modules/auth/sagas.js:65`. If the backend later supplies a stable user ID, those call sites must be changed; otherwise analytics identity can fragment or rely on an email value. This is an attribution limitation, not a delivery verification.

## Error tracking

`src/config/posthog.js:17` enables the SDK's global error-tracking autocapture for uncaught exceptions and unhandled promise rejections. Native crash autocapture was not enabled because the optional native plugin was not added. No error was intentionally triggered, so error arrival was not observed.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1902683)

The dashboard contains four saved insights covering authentication activity, workspace creation, workspace activation, and team collaboration. It uses a rolling 30-day range and may be empty until the app emits events. The dashboard and insights exist in PostHog; their data population was not verified by this run.

## What the run verified vs. did not verify

**Verified:** dependency installation and lockfile consistency, configured environment keys, source integration and Android dotenv hook, lint completion with zero errors, the seven capture call sites, identity calls, error-tracking configuration, and dashboard/insight creation.

**Not verified:** a production Android or iOS build, typecheck, test suite, app startup, event delivery, error delivery, or populated dashboard results. No build or typecheck script exists in `package.json`, and Android runtime build execution was not permitted by the harness.

## Build conflict

No build or typecheck script exists; Android runtime build execution is not permitted by the harness. Lint passes with 18 pre-existing warnings outside the integration changes. The dependency install also reported an unrelated existing peer mismatch: `react-native-reanimated` 4.5.3 expects `react-native-worklets` 0.10.x–0.11.x, while the project has 0.7.4. This mismatch was not changed.

## Next steps

1. Configure `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` in every Android/iOS and deployment environment using the names in `.env.example`.
2. Run the app through sign-in, team/project, and member-management flows, then confirm each named event arrives in PostHog under the expected distinct ID.
3. Trigger a controlled uncaught exception and unhandled rejection in a safe development environment to confirm error tracking arrives.
4. Provide a backend stable user ID and replace the email fallback at `src/store/modules/auth/sagas.js:46` and `src/store/modules/auth/sagas.js:65` before relying on long-term attribution.

## Before you merge

- [ ] Run a full production Android and iOS build; the wizard verified source files and lint only, not a production build.
- [ ] Run the test suite and update any mocks or fixtures affected by the instrumented saga calls.
- [ ] Confirm `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from `.env.example` are set in each deploy environment, not only local `.env`.
- [ ] Exercise the instrumented flows and confirm the seven events arrive in PostHog; the run observed no live event delivery.
- [ ] If stable backend identity becomes available, replace the email fallback at `src/store/modules/auth/sagas.js:46` and `src/store/modules/auth/sagas.js:65`.
