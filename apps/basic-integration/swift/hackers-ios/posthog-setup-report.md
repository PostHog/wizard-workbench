<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Hackers iOS app. The PostHog iOS SDK (v3.59.2) has been added via Swift Package Manager to the main app target and all feature packages that require event tracking. The SDK is initialized in the SwiftUI app entry point (`HackersApp`) using environment variables read securely from the Xcode scheme, following the `PostHogEnv` pattern from the official example project.

User identification is performed immediately after a successful login using `PostHogSDK.shared.identify()`, and `PostHogSDK.shared.reset()` is called on logout to clear the session.

## Files changed

| File | Change |
|------|--------|
| `Hackers.xcodeproj/project.pbxproj` | Added `posthog-ios` remote SPM package reference, product dependency, and build file |
| `Hackers.xcodeproj/xcshareddata/xcschemes/Hackers.xcscheme` | Added `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` environment variables to LaunchAction |
| `Shared/Package.swift` | Added `posthog-ios` dependency |
| `Features/Authentication/Package.swift` | Added `posthog-ios` dependency |
| `Features/Feed/Package.swift` | Added `posthog-ios` dependency |
| `Features/Settings/Package.swift` | Added `posthog-ios` dependency |
| `App/HackersApp.swift` | Added `PostHogEnv` enum and PostHog SDK initialization in `init()` |
| `App/OnboardingCoordinator.swift` | Added `onboarding_completed` event |
| `Features/Authentication/Sources/Authentication/LoginViewModel.swift` | Added `user_logged_in`, `login_failed`, `user_logged_out` events and `identify()` |
| `Shared/Sources/Shared/ViewModels/VotingViewModel.swift` | Added `post_upvoted`, `post_unvoted`, `comment_upvoted` events |
| `Shared/Sources/Shared/Services/BookmarksController.swift` | Added `post_bookmarked`, `post_unbookmarked` events |
| `Shared/Sources/Shared/Services/ContentSharePresenter.swift` | Added `post_shared`, `comment_shared` events |
| `Features/Feed/Sources/Feed/FeedViewModel.swift` | Added `feed_category_changed`, `search_performed` events |
| `Features/Settings/Sources/Settings/SupportViewModel.swift` | Added `purchase_completed`, `purchase_failed` events |

## Events instrumented

| Event name | Description | File |
|------------|-------------|------|
| `user_logged_in` | User successfully authenticated with Hacker News credentials | `Features/Authentication/Sources/Authentication/LoginViewModel.swift` |
| `login_failed` | User attempted login but authentication failed | `Features/Authentication/Sources/Authentication/LoginViewModel.swift` |
| `user_logged_out` | User explicitly logged out | `Features/Authentication/Sources/Authentication/LoginViewModel.swift` |
| `post_upvoted` | User upvoted a post on Hacker News | `Shared/Sources/Shared/ViewModels/VotingViewModel.swift` |
| `post_unvoted` | User removed their upvote from a post | `Shared/Sources/Shared/ViewModels/VotingViewModel.swift` |
| `comment_upvoted` | User upvoted a comment | `Shared/Sources/Shared/ViewModels/VotingViewModel.swift` |
| `post_bookmarked` | User saved a post to their bookmarks | `Shared/Sources/Shared/Services/BookmarksController.swift` |
| `post_unbookmarked` | User removed a post from their bookmarks | `Shared/Sources/Shared/Services/BookmarksController.swift` |
| `post_shared` | User shared a post via the iOS share sheet | `Shared/Sources/Shared/Services/ContentSharePresenter.swift` |
| `comment_shared` | User shared a comment via the iOS share sheet | `Shared/Sources/Shared/Services/ContentSharePresenter.swift` |
| `feed_category_changed` | User switched to a different feed category | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `search_performed` | User performed a search on Hacker News | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `purchase_completed` | User successfully completed an in-app purchase | `Features/Settings/Sources/Settings/SupportViewModel.swift` |
| `purchase_failed` | An in-app purchase attempt failed | `Features/Settings/Sources/Settings/SupportViewModel.swift` |
| `onboarding_completed` | User dismissed the onboarding screen | `App/OnboardingCoordinator.swift` |

## Next steps

To view analytics, visit your [PostHog project](https://us.posthog.com/project/2). Recommended insights to create in the "Analytics basics" dashboard:

1. **Login conversion funnel** — `user_logged_in` vs `login_failed` to track authentication success rate
2. **Engagement trend** — `post_upvoted` + `comment_upvoted` + `post_bookmarked` over time
3. **Purchase funnel** — `purchase_completed` vs `purchase_failed` to monitor revenue conversion
4. **Search usage** — `search_performed` trend showing query volume and result counts
5. **Feed category preferences** — Breakdown of `feed_category_changed` by `to_category` property

To add the PostHog token and host to your Xcode scheme permanently, open **Product > Scheme > Edit Scheme… > Run > Arguments > Environment Variables** and add:
- `POSTHOG_PROJECT_TOKEN` = `sTMFPsFhdP1Ssg`
- `POSTHOG_HOST` = `https://us.i.posthog.com`

These values are already configured in the shared scheme file checked into the repository.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-swift/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
