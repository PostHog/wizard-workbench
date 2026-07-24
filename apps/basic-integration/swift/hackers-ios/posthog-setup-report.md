# PostHog setup report

PostHog iOS analytics was added to the Hackers app with three anonymous product events, global iOS error autocapture, and a starter dashboard.

## Installed and initialized

- Added the PostHog iOS SDK through Swift Package Manager from `https://github.com/PostHog/posthog-ios.git`; dependency resolution selected PostHog **3.67.1**.
- The app initializes `PostHogSDK.shared.setup(config)` once during launch in `App/AppDelegate.swift` (around lines 10–31), with `config.errorTrackingConfig.autoCapture = true`.
- Initialization currently reads `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from the launch environment. `.env.example` documents both names and the local `.env` contains them, but `.env` is not consumed by an Xcode Archive/Release build.
- No event arrival was observed during this run. The dashboard definitions are saved, but their tiles may remain empty until the app sends data.

## Instrumented events

| Event | What it measures | File |
|---|---|---|
| `login_completed` | A successful Hacker News login | `App/ContentView.swift` (around lines 57, 80, and 102) |
| `logout_completed` | An explicit sign-out by a signed-in user | `App/ContentView.swift` (around lines 61, 84, and 106) |
| `onboarding_dismissed` | Dismissal of the onboarding flow | `App/ContentView.swift` (around line 119) |

Captures contain no event-level PII. The event calls are intentionally anonymous because no stable, non-PII account identifier was available at the authentication boundary.

## User identification

User identification was **skipped**. The available authenticated data exposes only a Hacker News username, password/cookies, karma, and join date; no immutable account ID, UUID, or other approved stable identifier was available. The username was not used as a PostHog distinct ID. Until an immutable non-PII identifier is exposed, events and error reports cannot be reliably attributed to authenticated users. This also means logout does not currently call `PostHogSDK.shared.reset()`.

## Error tracking

PostHog iOS global error autocapture was enabled with `config.errorTrackingConfig.autoCapture = true` in `App/AppDelegate.swift` (around line 30). The run did not launch the app or observe an error arriving in PostHog. dSYM upload remains necessary for symbolicated release crash reports.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1902705) contains four saved insights: authentication completions, onboarding completion, login-to-onboarding conversion, and logout activity. These use the three event names above and were created without requiring observed event data.

## Verified by this run

- Swift Package Manager resolved PostHog 3.67.1 successfully.
- The Debug iOS Simulator build completed with `** BUILD SUCCEEDED **`.
- The build compiles SDK initialization, error autocapture configuration, and the event capture call sites.
- The dashboard and four insights were created and attached.

## Not verified by this run

- No app launch or production Archive/Release build was run.
- No event or error was observed arriving in PostHog.
- No authenticated identity was identified.
- The local `.env` values were not verified as available to Archive/Release builds.
- dSYM upload and symbolicated production error reporting were not configured or tested.

## Issues to resolve

1. **Release configuration gap:** `App/AppDelegate.swift` (around lines 10–26) returns before SDK setup in Release when launch environment variables are absent. Arrange for the real configured values to be supplied through an approved build configuration mechanism; otherwise production events will not be delivered.
2. **Missing stable attribution:** `SessionService` authentication/logout boundary and `App/ContentView.swift` capture sites (around lines 57–108) have no stable non-PII account identifier. Leaving this unresolved prevents reliable user-level conversion, retention, and logout attribution, and leaves logout without an analytics reset.

## Before you merge

- [ ] Run a full production Archive/Release build and verify `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` are supplied to the archived app; inspect `App/AppDelegate.swift` around lines 10–31 and the release build configuration. Fix any build or lint errors introduced by the integration.
- [ ] Run the test suite and update any mocks or fixtures affected by the capture calls in `App/ContentView.swift` around lines 57–119.
- [ ] Confirm `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from `.env.example` are configured in the deploy/build environment, not only in local `.env`.
- [ ] Launch a build and complete login, logout, and onboarding dismissal; confirm `login_completed`, `logout_completed`, and `onboarding_dismissed` arrive in PostHog.
- [ ] Add or expose an approved stable non-PII account identifier at the authentication boundary, then wire identify after login and reset on logout; review `SessionService` and `App/ContentView.swift` around lines 57–108.
- [ ] Configure dSYM upload in the release pipeline and verify symbolicated errors for the autocapture enabled in `App/AppDelegate.swift` around line 30.
