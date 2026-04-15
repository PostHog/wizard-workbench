<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Hackers iOS app (a Hacker News reader). The integration covers user identification, key engagement events, conversion events, and error-adjacent failure tracking across all major feature modules.

## Changes made

### Dependency setup
- **`Hackers.xcodeproj/project.pbxproj`** — Added `XCRemoteSwiftPackageReference`, `XCSwiftPackageProductDependency`, and `PBXBuildFile` for `posthog-ios` v3.50.0; wired into the Hackers target's frameworks and package dependencies.
- **`Hackers.xcodeproj/xcshareddata/xcschemes/Hackers.xcscheme`** — Added `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` environment variables to the Run action.
- **`Features/Authentication/Package.swift`**, **`Shared/Package.swift`**, **`Features/Feed/Package.swift`**, **`Features/Comments/Package.swift`**, **`Features/Settings/Package.swift`** — Added `posthog-ios` v3.50.0 as a remote SPM dependency and added `PostHog` product to each target.

### Initialization
- **`App/HackersApp.swift`** — Added `PostHogEnv` enum for safe environment variable reading, and `init()` to set up `PostHogSDK.shared` with `captureApplicationLifecycleEvents = true`.

### Event tracking & user identification

| Event | Description | File |
|---|---|---|
| `user_logged_in` | Fired when a user successfully authenticates. Also calls `PostHogSDK.shared.identify()`. | `Features/Authentication/Sources/Authentication/LoginViewModel.swift` |
| `user_logged_out` | Fired when a user logs out. Calls `PostHogSDK.shared.reset()` to clear identity. | `Shared/Sources/Shared/Session/SessionService.swift` |
| `post_upvoted` | Fired when a user upvotes a post (after successful API call). | `Shared/Sources/Shared/ViewModels/VotingViewModel.swift` |
| `comment_upvoted` | Fired when a user upvotes a comment (after successful API call). | `Shared/Sources/Shared/ViewModels/VotingViewModel.swift` |
| `post_bookmarked` | Fired when a user bookmarks a post. | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `post_unbookmarked` | Fired when a user removes a bookmark from a post. | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `feed_category_changed` | Fired when the user switches between post categories (news, ask, show, jobs, etc.). | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `post_searched` | Fired when a search completes with results. | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `comments_viewed` | Fired when comments for a post are successfully loaded — top of the reading funnel. | `Features/Comments/Sources/Comments/CommentsViewModel.swift` |
| `support_purchase_completed` | Fired when an in-app purchase (subscription or tip) succeeds. | `Features/Settings/Sources/Settings/SupportViewModel.swift` |
| `support_purchase_failed` | Fired when an in-app purchase fails with an error. | `Features/Settings/Sources/Settings/SupportViewModel.swift` |
| `onboarding_completed` | Fired when the user dismisses onboarding for the current app version. | `App/OnboardingCoordinator.swift` |

## Next steps

Build an **"Analytics basics"** dashboard in PostHog with these five insights:

1. **Login conversion funnel** — Funnel: `user_logged_in` → `comments_viewed` → `post_upvoted`
   [Create in PostHog](https://us.posthog.com/project/2/insights/new#funnel)

2. **Daily active engagement** — Trend: unique users performing `comments_viewed` over time
   [Create in PostHog](https://us.posthog.com/project/2/insights/new#trends)

3. **Voting activity** — Trend: `post_upvoted` + `comment_upvoted` event counts over time
   [Create in PostHog](https://us.posthog.com/project/2/insights/new#trends)

4. **Support purchase funnel** — Funnel: `user_logged_in` → `support_purchase_completed` (churn risk: `support_purchase_failed`)
   [Create in PostHog](https://us.posthog.com/project/2/insights/new#funnel)

5. **Search engagement** — Trend: `post_searched` with breakdown by `result_count`
   [Create in PostHog](https://us.posthog.com/project/2/insights/new#trends)

[Open PostHog dashboards](https://us.posthog.com/project/2/dashboards)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-swift/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
