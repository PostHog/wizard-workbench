# PostHog setup report

PostHog was added to the Hackers iOS app through Swift Package Manager, initialized once at launch, and instrumented with five anonymous custom events.

## Installed and initialized

- Added `posthog-ios` through Swift Package Manager; Xcode resolved PostHog 3.68.2.
- `PostHogSDK.shared.setup(config)` is called once from `AppDelegate` at launch through `PostHogManager.setup()`.
- Debug configuration reads `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` and fails loudly when either is missing; Release safely skips setup when configuration is unavailable.
- The SDK's global error/crash autocapture is enabled with `config.errorTrackingConfig.autoCapture = true`.
- No CSP changes apply to this native iOS app.

## Events instrumented

| Event | What it measures | File |
|---|---|---|
| `authentication_succeeded` | A user successfully signs in to Hacker News. | `App/ContentView.swift` |
| `logged_out` | A signed-in user chooses to sign out. | `App/ContentView.swift` |
| `onboarding_completed` | A user completes or dismisses onboarding. | `App/ContentView.swift` |
| `post_opened` | A user opens a Hacker News post discussion. | `App/NavigationStore.swift` |
| `embedded_browser_link_opened` | A user opens the current embedded-browser page in Safari. | `App/EmbeddedWebView.swift` |

The event plan records non-PII properties for post openings; usernames, URLs, titles, and other PII were not added as event properties.

## Identity and error tracking

User identification was **skipped**. The authenticated model exposes only `User.username`, while the client persists only `hn_username`; no immutable account ID, UUID, or opaque resource identifier reaches the app. The username was not used as a PostHog distinct ID. No `identify` or `reset` calls were added.

Error tracking was added centrally through PostHog's SDK-managed global error/crash autocapture in `App/PostHogManager.swift`. dSYM upload remains a release-pipeline responsibility and was not verified by this run.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1919872)

The dashboard contains five tagged insights covering the event trends and an authentication-to-onboarding funnel. The insights are configured for the last 30 days and may be empty until the app sends events.

## What this run verified—and did not verify

Verified: Swift Package Manager dependency resolution succeeded, resolving PostHog 3.68.2; the Debug simulator build succeeded with code signing disabled; the SDK is linked; initialization is wired once at launch; and all five capture call sites passed review for reachability and minimality.

Not verified: no app launch or runtime delivery check was performed, so this run did **not** observe any event arriving in PostHog. The dashboard's presence is verified, but its event volume and charts are unconfirmed. Production/archive behavior, dSYM symbolication, and the deploy environment's runtime configuration were not verified.

## Issues to follow up

- **Stable attribution is unresolved:** `SessionService.authenticate` and `unauthenticate` cannot identify or reset users because the authenticated model has no stable non-PII account identifier. If left unresolved, authenticated actions remain anonymous/personless and cannot be reliably attributed to a returning account.
- **Release configuration has a documented conflict:** the Swift framework commandments require a value to ship in archive/release builds and recommend embedding the public token/host, while the review changed `App/PostHogManager.swift` to use environment configuration and safely no-op in Release when unavailable. If Release configuration is absent, analytics silently does not initialize in production.
- **Runtime delivery remains unknown:** the successful build proves compilation only; it does not prove that any of the five events are captured or delivered.

## Before you merge

- [ ] Run a full production/archive build and resolve any errors introduced by the integration; the wizard only verified the Debug simulator build (`App/PostHogManager.swift`, `App/AppDelegate.swift`, and `Hackers.xcodeproj/project.pbxproj`; setup/call-site lines should be checked in the current files).
- [ ] Run the test suite and update mocks or fixtures if instrumented call sites require it (`App/ContentView.swift`, `App/NavigationStore.swift`, and `App/EmbeddedWebView.swift`; capture call lines should be checked in the current files).
- [ ] Confirm `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from `.env.example` are configured in every Debug/deploy environment, not only locally (`.env.example`, lines 1–2; `App/PostHogManager.swift`, setup configuration lines).
- [ ] Exercise each instrumented action on a configured app build and confirm the five named events arrive in PostHog; event delivery was not tested (`App/ContentView.swift`, `App/NavigationStore.swift`, and `App/EmbeddedWebView.swift`, capture call lines).
- [ ] Provide a stable non-PII account identifier, then add login identification and logout reset (`SessionService.authenticate` and `SessionService.unauthenticate`; exact insertion lines must be located when the identifier is available).
- [ ] Confirm the release pipeline uploads dSYMs so PostHog crash reports are symbolicated; this was assumed but not verified (release pipeline configuration; no file was recorded by the run).
