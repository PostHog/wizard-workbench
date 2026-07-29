# PostHog setup report

PostHog was added to the Hackers iOS app with centralized initialization, four anonymous event contracts, SDK error autocapture, and a starter dashboard.

## What was installed and initialized

- Added the PostHog iOS SDK through Swift Package Manager in `Hackers.xcodeproj/project.pbxproj`. Package resolution selected posthog-ios 3.68.4 during review.
- `App/AppDelegate.swift` initializes `PostHogSDK.shared` exactly once during application launch, before the existing startup work.
- Initialization reads `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from optional scheme environment variables and falls back to build-expanded values in `App/Supporting Files/Hackers-Info.plist`.
- Missing configuration is a no-op in production and triggers a Debug assertion. The environment file contains both keys, but `.env` is not automatically consumed by Xcode.
- Native iOS has no Content-Security-Policy surface, so no CSP changes were needed.

## Events instrumented

These capture call sites were added and reviewed. The run did **not** launch the app or observe events arriving in PostHog, so delivery remains unconfirmed.

| Event | What it measures | File |
|---|---|---|
| `post_opened` | A reader opens a Hacker News post and its comments. | `App/NavigationStore.swift` |
| `login_succeeded` | A Hacker News login completes successfully. | `App/ContentView.swift` |
| `logout_completed` | An authenticated session is signed out. | `App/ContentView.swift` |
| `onboarding_completed` | A reader dismisses onboarding after it has been shown. | `App/OnboardingCoordinator.swift` |

The five capture call sites (two `post_opened` paths plus one call for each other event) use PostHog’s default anonymous device identity. No event contains user-entered PII; `post_id` is a numeric public content identifier.

## Identification status

User identification was **skipped**. The client authentication response and persisted domain model expose only `username`; the recorded identify review did not establish a stable, non-PII account identifier. Username must not be used as the distinct ID. Consequently, the integration does not currently call `identify` after login or `reset` after logout.

### Unresolved issue to follow up

The authenticated Hacker News account model still needs to expose a stable non-PII identifier. Until that is resolved, authenticated activity remains associated with anonymous device identity and cannot be reliably attributed across devices or tied to an account. Once available, wire `PostHogSDK.shared.identify` after successful authentication and `PostHogSDK.shared.reset()` after logout, as described in the identify handoff.

## Error tracking

`App/AppDelegate.swift` enables `config.errorTrackingConfig.autoCapture = true` before SDK setup. This is SDK-provided global error autocapture. The run did not launch the app or verify an error event in PostHog, and dSYM upload was not configured or verified.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1924764) contains four wizard-tagged insights covering authentication-to-onboarding conversion, post engagement, login success, and logout completion. The dashboard definitions use a 30-day range and may be empty until events arrive; no data availability check was performed.

## What the run verified

- PostHog package dependencies resolved successfully.
- A Debug iPhone Simulator build succeeded with code signing disabled.
- The integration review found one initialization delivery fix: Info.plist fallback values were added for release/archive builds.
- Initialization is centralized, error autocapture is enabled, and all five capture callers compile and are reachable.

## What the run did not verify

- No app launch, event delivery, or captured event was observed.
- No production/archive build was run.
- No tests, lint, or separate typecheck were run; no test suite or lint scripts were available for this Xcode project.
- No dSYM upload or crash-symbolication pipeline was configured or verified.

## Build and configuration conflict

The init step originally relied on `ProcessInfo.processInfo.environment`, which is not populated for TestFlight/App Store archive builds. The review step resolved this by retaining scheme environment variables as an optional override and adding build-expanded `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` values in `Hackers-Info.plist`. The remaining production requirement is that the app target’s Release/Archive build configuration or CI defines real values for both settings. If those settings are absent, production initialization becomes a no-op and events are silently missed. `.env` alone does not configure Xcode archives.

## Before you merge

- [ ] In `App/Supporting Files/Hackers-Info.plist` (the `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` entries near lines 39–42), verify Release/Archive build settings or CI inject the real values, not empty or placeholder values.
- [ ] Run a full production/archive build and fix any integration errors; the verified Debug build covered the touched code but not the shipping configuration (`App/AppDelegate.swift`, `App/Supporting Files/Hackers-Info.plist`).
- [ ] Run the test suite and update mocks or fixtures if needed for the instrumented handlers (`App/ContentView.swift`, `App/NavigationStore.swift`, and `App/OnboardingCoordinator.swift`).
- [ ] Launch a representative build and confirm `post_opened`, `login_succeeded`, `logout_completed`, and `onboarding_completed` arrive in PostHog; the run itself observed none.
- [ ] Confirm the Hacker News authentication response exposes a stable non-PII account identifier, then wire identify/reset in the login/logout flow (`App/ContentView.swift` and the authentication path reviewed by the identify step).
- [ ] Configure and verify dSYM upload for symbolicated production error reports; SDK error autocapture is enabled in `App/AppDelegate.swift`, but symbolication was not verified.
