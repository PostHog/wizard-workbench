# PostHog setup report

PostHog product analytics, user identity, error tracking, and a starter dashboard were added to this React Native app.

## Installed and initialized

- Installed `posthog-react-native` 4.61.0 and its required peer dependency `react-native-svg` 15.15.5 with pnpm.
- Installed `react-native-config` and configured Android to load `dotenv.gradle`, embedding `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` at build time.
- Created the single PostHog client in `src/config/posthog.js`. The client reads configuration through `react-native-config`, reports missing settings in development, and uses a production no-op when configuration is absent.
- Added `PostHogProvider` inside `NavigationContainer` in `src/routes.js`, as required for React Navigation v7 compatibility.
- The configured environment keys were present in the run's environment check. The actual values are intentionally not repeated in this report.
- No server-side PostHog library was added; this is a client-only React Native integration.

## Instrumented events

| Event | What it measures | File |
|---|---|---|
| `user_signed_in` | User successfully completes the sign-in flow, with the authentication method recorded. | `src/store/modules/auth/sagas.js` |
| `user_signed_out` | Authenticated user signs out before analytics identity resets. | `src/store/modules/auth/sagas.js` |
| `team_created` | User successfully creates a workspace team. | `src/store/modules/teams/sagas.js` |
| `team_selected` | User switches the active workspace team. | `src/store/modules/teams/sagas.js` |
| `project_created` | User successfully creates a project within the active team. | `src/store/modules/projects/sagas.js` |
| `member_invited` | User successfully sends or adds a member invitation. | `src/store/modules/members/sagas.js` |
| `member_roles_updated` | User successfully updates a member's assigned roles, including role count. | `src/store/modules/members/sagas.js` |

These events are instrumented at successful demo/API mutation paths according to the event plan. The run did not start the app or observe events arriving in PostHog, so event delivery and populated dashboard data remain unconfirmed.

## User identification

Identification was wired in `src/store/modules/auth/sagas.js` after both demo and API-backed successful sign-ins. Email is currently used as the distinct ID fallback because the API response exposes a session token but no stable user primary key; email is sent as a `$set` person property and is not included in event properties. Sign-out captures `user_signed_out` and then calls `posthog.reset()`.

The run did not verify a returning-session re-identification path after app restart. If the API later exposes a stable authenticated user ID, replace the email fallback with that ID.

## Error tracking

`src/config/posthog.js` installs one global React Native `ErrorUtils` handler when PostHog is configured. It calls `posthog.captureException(error, { is_fatal })` and then delegates to the original handler, preserving normal error behavior. Runtime delivery of exceptions to PostHog was not observed.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1914304)

The dashboard was created with five live insights covering sign-in-to-team activation, sign-ins over time, workspace creation, member management, and team selection by `team_id`. The dashboard and insight records were confirmed by PostHog MCP, but their data may remain empty until the app sends events.

## Verified by this run

- Dependency installation completed successfully, including `posthog-react-native`, `react-native-svg`, and `react-native-config`.
- `pnpm lint` completed with 0 errors. Its 18 warnings were reported as pre-existing warnings in untouched files.
- The review confirmed the PostHog imports, singleton usage, guarded initialization, provider placement, event names, and call-site patterns.
- The PostHog dashboard and five attached insights were returned by PostHog MCP.

## Not verified by this run

- No standalone production build or typecheck script exists, and no native Android or iOS build was run.
- No emulator/device runtime check was available.
- No event, exception, or dashboard data was observed arriving in PostHog.
- iOS native dependency installation and archive delivery were not verified in this environment; autolinking is expected to handle the React Native packages during native builds.

## Build conflict and constraints

No standalone build/typecheck script exists; lint passed with 18 pre-existing warnings in untouched files. During dependency installation, pnpm also reported an existing unrelated unmet peer dependency: `react-native-reanimated` requires `react-native-worklets` 0.10.x–0.11.x, while 0.7.4 is present. This is not caused by the PostHog integration.

## Issues to follow up

- Stable attribution remains unresolved: `src/store/modules/auth/sagas.js` uses the sign-in email as the distinct ID because no stable user ID is returned. If left unresolved, events may be attributed to an identity that changes when the user's email changes rather than to the authenticated account.
- Runtime delivery remains unresolved: no app session confirmed that the seven events or global exceptions reached PostHog. If left unchecked, configuration, native linking, or transport problems could leave the dashboard empty despite compiling code.

## Next steps

1. Run a full Android and iOS production/native build in the supported environments and resolve any native linking or archive issues.
2. Exercise sign-in, team creation/selection, project creation, member invitation, role update, and sign-out in a configured app session; confirm each event appears in PostHog.
3. Trigger a controlled JavaScript exception and confirm it appears in PostHog Error Tracking.
4. Confirm the dashboard tiles populate with the observed events.
5. Replace the email distinct-ID fallback when the backend provides a stable user primary key.

## Before you merge

- [ ] Run a full production build; this run verified touched-file review and lint only, not native compilation or packaging.
- [ ] Run the test suite and update mocks or fixtures for the instrumented saga call sites if needed.
- [ ] Confirm `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from `.env.example` are configured in every Android/iOS deployment environment, not only locally; inspect `src/config/posthog.js` and `android/app/build.gradle`.
- [ ] Exercise the instrumented flows and verify the seven named events arrive in PostHog; inspect capture call sites in `src/store/modules/auth/sagas.js`, `src/store/modules/teams/sagas.js`, `src/store/modules/projects/sagas.js`, and `src/store/modules/members/sagas.js`.
- [ ] Confirm returning authenticated sessions identify the user again, or add that path before merging; inspect `src/store/modules/auth/sagas.js`.
- [ ] Trigger and verify an uncaught JavaScript exception in PostHog Error Tracking; inspect the global handler in `src/config/posthog.js`.
