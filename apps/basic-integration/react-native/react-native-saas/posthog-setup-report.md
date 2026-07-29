# PostHog setup report

PostHog product analytics, authenticated identity, global JavaScript error tracking, and starter dashboard insights were added to this React Native app.

## What was installed and initialized

- Installed `posthog-react-native` 4.61.1, `react-native-svg` 15.15.5, and `react-native-config` 1.6.1 with pnpm.
- Created the shared client in `src/config/posthog.js`, loading `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from `react-native-config`. Development builds fail loudly when either variable is absent or unconfigured; production disables analytics without breaking boot.
- Added the PostHog provider inside `NavigationContainer` in `src/routes.js`.
- Added the required Android `react-native-config` dotenv Gradle application in `android/app/build.gradle`.
- Documented the environment variable names in `.env.example`; the run confirmed both keys are present in the local `.env`.

## Events instrumented

These seven events were added to successful Redux saga paths. The run verified capture call sites in source, but did **not** run the app or observe events arriving in PostHog.

| Event | What it measures | File |
|---|---|---|
| `user_signed_in` | A user successfully authenticates through demo or API sign-in. | `src/store/modules/auth/sagas.js` |
| `user_signed_out` | An authenticated user signs out before analytics identity is reset. | `src/store/modules/auth/sagas.js` |
| `project_created` | A project is successfully created. | `src/store/modules/projects/sagas.js` |
| `team_created` | A team is successfully created. | `src/store/modules/teams/sagas.js` |
| `team_selected` | An authenticated user selects an active team. | `src/store/modules/teams/sagas.js` |
| `member_invited` | A member invitation is successfully created or sent. | `src/store/modules/members/sagas.js` |
| `member_roles_updated` | An authenticated user successfully updates a member's roles. | `src/store/modules/members/sagas.js` |

Event properties are limited to bounded execution context such as sign-in method; user-entered titles, team names, emails, role data, and other PII are not sent as event properties.

## User identification

Identification is wired in `src/store/modules/auth/sagas.js` after successful demo and API sign-in, and `posthog.reset()` runs before storage is cleared on sign-out. Email is currently the fallback distinct ID and is also sent as a `$set` person property because the inspected API response exposes no stable user ID. If the API later provides a stable user primary key, replace this fallback in `src/store/modules/auth/sagas.js`.

The run verified the identify and reset call sites, but did not verify identity or event delivery in a running app. Returning-session re-identification was not added or verified; the existing initialization path dispatches sign-in success but does not establish PostHog identity from a persisted user record.

## Error tracking

`src/config/posthog.js` enables the SDK's built-in error tracking autocapture for uncaught exceptions and unhandled promise rejections. The run verified the configured SDK options, but did not trigger an exception or observe an error event in PostHog. Native crash capture was not enabled.

## Dashboard

Dashboard: [Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1926636)

The dashboard contains four tagged insights: Authentication activity trend, Workspace activity trend, Member management activity trend, and Sign-in to project creation funnel. They use a rolling 30-day range and were created even though the newly instrumented events had not yet been observed; the run did not verify populated results.

## Verified by this run

- `pnpm install` completed successfully with the existing lockfile.
- `pnpm lint` completed with zero errors; its 18 warnings were pre-existing and outside the integration changes.
- The configured `.env` contains both required environment keys.
- The source call sites, provider placement, error-tracking configuration, and Android dotenv wiring were reviewed.

## Not verified by this run

- No Android or iOS native build/device launch was completed.
- No build or typecheck script exists in `package.json`.
- No test suite was run.
- No event, identity, or error was observed arriving in PostHog.
- iOS native autolinking was assumed from the existing `use_native_modules!` Podfile configuration and was not built.

## Issues to follow up

1. **Stable attribution remains unresolved.** `src/store/modules/auth/sagas.js` uses the user's email as the `identify` distinct ID in both the demo and password sign-in branches because the API response exposes no stable user ID. If left unchanged, identity semantics depend on an email address and can fragment or change when account identifiers change. Replace it when a stable user primary key becomes available.
2. **Returning-session identity is unresolved.** `src/store/modules/auth/sagas.js` restores the token but does not re-identify the persisted user during initialization. If left unchanged, events generated before a fresh sign-in may remain on an anonymous distinct ID.
3. **Native delivery is unresolved.** The run could not perform a native Android launch/build, and iOS was not built. Environment embedding and runtime delivery still need device or CI confirmation.

## Before you merge

- [ ] Run a full production Android and iOS build; the wizard only verified the edited files and lint.
- [ ] Run the test suite and update any mocks or fixtures affected by the saga capture, identify, and reset calls.
- [ ] Confirm `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from `.env.example` are configured in every deploy/build environment, not only local `.env`.
- [ ] Launch the app, sign in through each supported path, perform the instrumented project/team/member actions, sign out, and confirm the seven named events arrive in PostHog with the intended identity.
- [ ] Verify the returning-session path in `src/store/modules/auth/sagas.js` re-identifies users before merge, or explicitly accept anonymous attribution until a persisted stable user ID is available.
- [ ] Replace the email fallback distinct ID in `src/store/modules/auth/sagas.js` when the API exposes a stable user primary key.
- [ ] Trigger an uncaught exception and an unhandled promise rejection in a safe test build and confirm error events arrive in PostHog.
- [ ] Resolve or explicitly accept the pre-existing `react-native-reanimated` / `react-native-worklets` peer mismatch before release.
