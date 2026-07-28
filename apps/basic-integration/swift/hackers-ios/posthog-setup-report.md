# PostHog setup report

PostHog iOS analytics was added to the Hackers Xcode app: the Swift SDK is linked, initialization and native error autocapture are centralized in `App/AppDelegate.swift`, eleven product events are instrumented, and a starter dashboard is available.

## What was installed and initialized

- Added the PostHog iOS Swift Package (`posthog-ios`, minimum version 3.59.3) to `Hackers.xcodeproj/project.pbxproj` and linked the PostHog product to the Hackers application target.
- `App/AppDelegate.swift:19` invokes the setup path during app launch, and `App/AppDelegate.swift:57-78` creates the single configuration and calls `PostHogSDK.shared.setup(config)` once.
- Configuration keys are documented in `.env.example` as `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST`; both keys were present in the local `.env` during the run. The app currently reads process environment values, so release/archive builds require those values to be injected through their build configuration. Missing configuration is loud in Debug and a no-op in production.
- No user identification was wired. The available `Domain.User` contains only `username`, `karma`, and `joined`; no canonical stable non-PII identifier reaches the client. No `identify` or `reset` call was added.

## Events instrumented

These are code-level instrumentation points from `.posthog-wizard-cache/.posthog-events.json`. The run did **not** launch the app or observe events arriving in PostHog, so these are planned/emitted events, not delivery-confirmed events.

| Event | What it measures | Instrumented file |
|---|---|---|
| `login_succeeded` | A user successfully signs in to Hacker News | `Features/Authentication/Sources/Authentication/LoginViewModel.swift:63` |
| `logout_completed` | A signed-in user completes sign-out | `Features/Authentication/Sources/Authentication/LoginViewModel.swift:76` |
| `post_upvoted` | A user successfully upvotes a post | `Shared/Sources/Shared/ViewModels/VotingViewModel.swift:62` |
| `post_unvoted` | A user successfully removes a post upvote | `Shared/Sources/Shared/ViewModels/VotingViewModel.swift:100` |
| `comment_upvoted` | A user successfully upvotes a comment | `Shared/Sources/Shared/ViewModels/VotingViewModel.swift:133` |
| `comment_unvoted` | A user successfully removes a comment upvote | `Shared/Sources/Shared/ViewModels/VotingViewModel.swift:161` |
| `bookmark_added` | A user successfully saves a post | `Shared/Sources/Shared/Services/BookmarksController.swift:59` |
| `bookmark_removed` | A user removes a post from bookmarks | `Shared/Sources/Shared/Services/BookmarksController.swift:62` |
| `post_share_started` | A user opens the system share sheet | `Shared/Sources/Shared/Services/ContentSharePresenter.swift:19` |
| `support_purchase_completed` | A supporter subscription or tip purchase completes | `Features/Settings/Sources/Settings/SupportViewModel.swift:85` |
| `purchases_restored` | Prior App Store purchases are successfully restored | `Features/Settings/Sources/Settings/SupportViewModel.swift:109` |

The event contract is centralized in `Shared/Sources/Shared/AnalyticsEvent.swift`; `App/AppDelegate.swift:46-55` forwards notifications as plain event names to `PostHogSDK.shared.capture`. No event properties were added, and no PII is sent in event properties.

## Error tracking

`App/AppDelegate.swift:75` sets `config.errorTrackingConfig.autoCapture = true` before SDK setup, enabling the native iOS error autocapture path. dSYM upload for symbolication remains a separate release/build concern.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1918379) contains five starter tiles: daily logins, voting activity, bookmarks saved, supporter purchases, and a login-to-supporter-purchase funnel. The dashboard and its insight definitions exist, but newly captured event data was not confirmed during this run.

## What the run verified vs. did not verify

### Verified

- The Xcode Debug simulator build completed with `** BUILD SUCCEEDED **` after the PostHog package resolved.
- The PostHog dependency, centralized setup/capture bridge, event call sites, and error autocapture configuration were present in the reviewed changes.
- The local `.env` contained both documented configuration keys.
- The dashboard and five insight definitions were created in PostHog.

### Not verified

- No app launch or production/archive build was performed.
- No event was observed arriving in PostHog; the dashboard may therefore show no data yet.
- Error delivery and symbolication were not exercised.
- Returning-user identity, login identity, and logout reset behavior were not tested because identity was not implemented.

## Issues requiring follow-up

1. **Stable identity is unresolved.** Authentication exposes no canonical stable non-PII user ID, so events remain anonymous and cannot be reliably attributed to users. When an ID becomes available, add `identify` after successful authentication and `reset` in both logout paths in `Shared/Sources/Shared/Session/SessionService.swift`, without using `username` as the distinct ID.
2. **Release/archive configuration is unresolved.** `App/AppDelegate.swift:58-70` depends on `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` being supplied at build/run time. If omitted from an archive or TestFlight build, analytics becomes a production no-op and events are missed.
3. **Production delivery remains unconfirmed.** The build proves compilation only; it does not prove that any event reaches PostHog. A manual app exercise is still required.

## Before you merge

- [ ] Run a full production/archive build and confirm the PostHog package and the touched Swift files compile outside the Debug simulator build.
- [ ] Run the test suite and update any mocks or fixtures affected by the instrumented call sites.
- [ ] Verify `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from `.env.example` are supplied in release/archive build configuration, not only local `.env` or Xcode scheme environment settings; inspect `App/AppDelegate.swift:58-70`.
- [ ] Launch the app, exercise login, logout, voting, bookmarks, sharing, and supporter purchase/restore paths, and confirm the eleven event names arrive in PostHog.
- [ ] Resolve the stable non-PII user ID and wire identify/reset in `Shared/Sources/Shared/Session/SessionService.swift` before relying on user-level attribution.
- [ ] Configure dSYM upload for release builds so native PostHog error reports are symbolicated; the autocapture setting is in `App/AppDelegate.swift:75`.
