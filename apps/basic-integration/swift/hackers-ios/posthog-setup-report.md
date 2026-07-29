# PostHog setup report

PostHog was added to the Hackers iOS app with SDK initialization, nine successful-action event captures, error autocapture, and a starter analytics dashboard.

## Installed and initialized

- Added the PostHog iOS Swift Package dependency from `https://github.com/PostHog/posthog-ios.git`; the declared minimum was 3.59.3 and dependency resolution selected 3.68.4.
- Initialized `PostHogSDK.shared` once during application launch in `App/AppDelegate.swift` with the configured public project token and host.
- Enabled iOS error autocapture with `config.errorTrackingConfig.autoCapture = true` in `App/AppDelegate.swift:21`.
- Documented `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` in `.env.example`; both keys are present in the local `.env` configuration.

## Events instrumented

These events were added at successful action boundaries. The run verified their source call sites, but did **not** launch the app or observe events arriving in PostHog, so delivery is unconfirmed.

| Event | What it measures | File |
|---|---|---|
| `login_succeeded` | A Hacker News login completes successfully. | `Features/Authentication/Sources/Authentication/LoginViewModel.swift` |
| `post_upvoted` | An authenticated user successfully upvotes a post. | `Shared/Sources/Shared/ViewModels/VotingViewModel.swift` |
| `post_unvoted` | An authenticated user successfully removes an upvote from a post. | `Shared/Sources/Shared/ViewModels/VotingViewModel.swift` |
| `comment_upvoted` | An authenticated user successfully upvotes a comment. | `Shared/Sources/Shared/ViewModels/VotingViewModel.swift` |
| `bookmark_added` | A story is successfully saved to bookmarks. | `Shared/Sources/Shared/Services/BookmarksController.swift` |
| `bookmark_removed` | A story is successfully removed from bookmarks. | `Shared/Sources/Shared/Services/BookmarksController.swift` |
| `support_purchase_completed` | A subscription or tip purchase completes successfully. | `Features/Settings/Sources/Settings/SupportViewModel.swift` |
| `purchases_restored` | A restore-purchases request completes successfully. | `Features/Settings/Sources/Settings/SupportViewModel.swift` |
| `onboarding_completed` | A user completes or dismisses onboarding. | `Features/Onboarding/Sources/Onboarding/Views/OnboardingView.swift` |

## Identity status

User identification was **skipped**. The current authenticated model exposes only `User.username`; no stable, non-PII account identifier reaches the authentication boundaries. The username was correctly not used as a PostHog distinct ID, and no fabricated or derived ID was introduced. Events therefore use the SDK's anonymous identity until the app exposes a stable account identifier.

## Unresolved issue to follow up

- **Stable attribution is unresolved:** expose a stable, non-PII Hacker News account identifier through `Domain.User` and `AuthenticationUseCase.getCurrentUser()`, then add `identify` after successful login and session restoration and `reset` after logout or forced unauthentication. Without this, login and subsequent product events cannot be reliably attributed to the same authenticated person, and returning sessions can remain fragmented across anonymous identities. The capture call sites currently have no explicit stable `DISTINCT_ID` placeholder; do not add the username as a substitute.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1926672)

The dashboard contains four insights covering login successes, content engagement, supporter conversion activity, and the login-to-onboarding completion funnel. The insights may remain empty until the app sends events.

## What the run verified—and did not

- **Verified:** PostHog dependency resolution succeeded; the simulator Debug build completed with `** BUILD SUCCEEDED **`; the source contains exactly nine planned capture calls; initialization and error autocapture are wired; the dashboard and four insights were created.
- **Not verified:** No app launch, runtime event delivery, PostHog event arrival, production/archive build, test suite, lint run, or crash report symbolication was performed. Build success proves compilation and linkage only; it does not prove events flow.

## Build conflicts

The framework commandments require the public token and host directly in iOS source for release reliability, while the initialization task requested environment-only configuration. The source uses the framework-required embedded public values, and `.env` documents the keys.

## Next steps

1. Expose a stable, non-PII account identifier and wire `identify` on login/session restoration plus `reset` on logout.
2. Run the app through each instrumented successful action and confirm the nine event names arrive in the PostHog dashboard.
3. Configure production/archive environments and verify the public token and host are available in the shipped app.
4. Upload dSYM files in release CI so captured iOS errors are symbolicated.

## Before you merge

- [ ] Run a full production/archive build and fix any lint or type errors introduced by the integration; the wizard verified only dependency resolution and a simulator Debug build.
- [ ] Run the test suite; instrumented call sites may require updated mocks or fixtures.
- [ ] Confirm `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from `.env.example` are configured in deployment/developer environments as appropriate, not only locally.
- [ ] With the app running, exercise each successful action and confirm the corresponding events arrive in PostHog; the run did not observe runtime delivery.
- [ ] Resolve stable identity attribution before merging by exposing a non-PII account identifier and wiring login/session-restoration `identify` plus logout `reset`.
- [ ] Upload dSYM files for release builds so production error reports are symbolicated.
