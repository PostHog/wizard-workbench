# PostHog setup report

PostHog analytics was added to the Hackers iOS app with the Swift SDK, eleven instrumented product events, error autocapture, and a five-tile starter dashboard.

## Installed and initialized

- Added the PostHog Swift Package Manager dependency from `https://github.com/PostHog/posthog-ios.git` to the Hackers app target.
- Swift Package Manager resolved PostHog `3.68.2`, although the initial project declaration used a minimum version of `3.59.3`.
- Initialized `PostHogSDK.shared` once in `App/AppDelegate.swift` during application launch.
- Configuration accepts optional `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` scheme overrides, then falls back to bundled Info.plist values so Release/archive builds ship a nonempty configuration. `.env.example` documents both keys, and the local `.env` was configured during the run.
- Application lifecycle capture is enabled.

## Events instrumented

These events are wired to successful action paths. The run verified their notification publishers and the single AppDelegate capture sink through source inspection; it did **not** observe events arriving in PostHog.

| Event | What it measures | Source file |
|---|---|---|
| `login_completed` | A Hacker News account authentication succeeds. | `Features/Authentication/Sources/Authentication/LoginViewModel.swift` |
| `logout_completed` | An authenticated user signs out. | `Features/Authentication/Sources/Authentication/LoginViewModel.swift` |
| `bookmark_added` | A story is successfully saved to bookmarks. | `Shared/Sources/Shared/Services/BookmarksController.swift` |
| `bookmark_removed` | A story is successfully removed from bookmarks. | `Shared/Sources/Shared/Services/BookmarksController.swift` |
| `post_upvoted` | A post upvote succeeds. | `Shared/Sources/Shared/ViewModels/VotingViewModel.swift` |
| `post_unvoted` | A post unvote succeeds. | `Shared/Sources/Shared/ViewModels/VotingViewModel.swift` |
| `comment_upvoted` | A comment upvote succeeds. | `Shared/Sources/Shared/ViewModels/VotingViewModel.swift` |
| `comment_unvoted` | A comment unvote succeeds. | `Shared/Sources/Shared/ViewModels/VotingViewModel.swift` |
| `purchase_completed` | A support subscription or tip purchase completes. | `Features/Settings/Sources/Settings/SupportViewModel.swift` |
| `purchases_restored` | Support purchases are successfully restored. | `Features/Settings/Sources/Settings/SupportViewModel.swift` |
| `onboarding_completed` | A user completes onboarding. | `Features/Onboarding/Sources/Onboarding/Views/OnboardingView.swift` |

## User identification

Identification was skipped. The authenticated `Domain.User` and authentication response expose only `username` and related metadata, with no stable non-PII account identifier. Username must not be used as a distinct ID, so events currently use the SDK's anonymous distinct ID. No `identify` or logout `reset` call was added.

### Unresolved issue to follow up

Expose a stable non-PII Hacker News account identifier through `Domain.User` and `SessionService` or obtain one from the authenticated account response. Until then, `login_completed`, `logout_completed`, bookmark, voting, purchase, restore, and onboarding events cannot be reliably attributed to authenticated users or joined across sessions. Once available, add `PostHogSDK.shared.identify` after successful authentication and `PostHogSDK.shared.reset()` at logout in the SessionService boundary.

## Error tracking

Enabled PostHog iOS error autocapture with `config.errorTrackingConfig.autoCapture = true` in `App/AppDelegate.swift`, before SDK setup. The run did not observe an error arriving in PostHog, and no dSYM upload workflow was added.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1914334)

The dashboard contains five insights: Authentication activity, Onboarding completion trend, Bookmark engagement, Voting engagement, and Supporter conversion funnel. It is expected to remain empty until app events arrive; dashboard and insight creation succeeded, but ingestion was not verified.

## Build and verification

- Swift Package Manager dependency resolution succeeded and locked PostHog `3.68.2`.
- The Debug simulator build completed successfully with `CODE_SIGNING_ALLOWED=NO`.
- The first build attempt found an invalid `SupportProductKind.rawValue` access in `Features/Settings/Sources/Settings/SupportViewModel.swift`; review replaced it with the equivalent subscription/tip mapping, preserving `purchase_completed` properties. The corrected build then succeeded.
- No test suite was run. No production/archive build was run. No live event delivery was observed.

## Before you merge

- [ ] Run a full production/archive build and fix any lint or type errors introduced by the integration; the run verified only dependency resolution and a Debug simulator build.
- [ ] Run the test suite and update any mocks or fixtures affected by the instrumented call sites.
- [ ] Confirm `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` are set in every relevant deployment/build environment, not only local `.env`; the exact names are documented in `.env.example`.
- [ ] Exercise the instrumented actions on a running app and confirm the eleven named events arrive in PostHog and populate the dashboard.
- [ ] In `Domain/Sources/Domain/Models.swift` and `Shared/Sources/Shared/Session/SessionService.swift`, expose a stable non-PII account identifier, then wire `identify` after login and `reset` at logout before relying on user-level attribution.
- [ ] Configure and verify dSYM upload for production error symbolication; error autocapture is enabled in `App/AppDelegate.swift`, but symbolication was not verified.
