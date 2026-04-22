<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Hackers iOS app. The integration adds the PostHog iOS SDK via Swift Package Manager, initializes it at app startup with environment-variable-based configuration, identifies users on login, and tracks 13 meaningful business events across authentication, feed, comments, settings, and in-app purchases.

## Changes made

- **`Hackers.xcodeproj/project.pbxproj`** — Added `XCRemoteSwiftPackageReference` for `posthog-ios` (v3.40.0+), `XCSwiftPackageProductDependency`, and `PBXBuildFile` for the Hackers target
- **`Hackers.xcodeproj/xcshareddata/xcschemes/Hackers.xcscheme`** — Added `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` environment variables to the Run scheme's `LaunchAction`
- **`App/HackersApp.swift`** — Added `PostHogEnv` enum for safe environment-variable access and PostHog SDK initialization in `App.init()` with `captureApplicationLifecycleEvents = true`
- **`App/OnboardingCoordinator.swift`** — Added `onboarding_completed` event when user dismisses the onboarding flow
- **`Features/Authentication/Package.swift`** — Added `posthog-ios` remote package dependency
- **`Features/Authentication/Sources/Authentication/LoginViewModel.swift`** — Added `identify()` call on successful login, `user_logged_in`, `login_failed`, and `user_logged_out` events with `PostHogSDK.shared.reset()` on logout
- **`Features/Feed/Package.swift`** — Added `posthog-ios` remote package dependency
- **`Features/Feed/Sources/Feed/FeedViewModel.swift`** — Added `post_voted`, `post_bookmarked`, `feed_category_changed`, and `post_searched` events
- **`Features/Comments/Package.swift`** — Added `posthog-ios` remote package dependency
- **`Features/Comments/Sources/Comments/CommentsViewModel.swift`** — Added `comment_voted` event
- **`Features/Settings/Package.swift`** — Added `posthog-ios` remote package dependency
- **`Features/Settings/Sources/Settings/SupportViewModel.swift`** — Added `purchase_initiated`, `purchase_completed`, and `purchase_failed` events
- **`Features/Settings/Sources/Settings/SettingsViewModel.swift`** — Added `cache_cleared` event

## Events instrumented

| Event | Description | File |
|-------|-------------|------|
| `user_logged_in` | User successfully authenticated with Hacker News credentials | `Features/Authentication/Sources/Authentication/LoginViewModel.swift` |
| `user_logged_out` | User logged out of their Hacker News account | `Features/Authentication/Sources/Authentication/LoginViewModel.swift` |
| `login_failed` | User attempted to log in but authentication failed | `Features/Authentication/Sources/Authentication/LoginViewModel.swift` |
| `post_voted` | User upvoted a post in the feed | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `comment_voted` | User upvoted a comment in the comments view | `Features/Comments/Sources/Comments/CommentsViewModel.swift` |
| `post_bookmarked` | User bookmarked or un-bookmarked a post | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `feed_category_changed` | User switched feed category (Top, New, Ask, Show, Jobs, Bookmarks) | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `post_searched` | User submitted a search query and results were returned | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `onboarding_completed` | User completed or dismissed the onboarding flow | `App/OnboardingCoordinator.swift` |
| `purchase_initiated` | User tapped to purchase a support subscription or tip | `Features/Settings/Sources/Settings/SupportViewModel.swift` |
| `purchase_completed` | User successfully completed a purchase | `Features/Settings/Sources/Settings/SupportViewModel.swift` |
| `purchase_failed` | A purchase attempt failed with an error | `Features/Settings/Sources/Settings/SupportViewModel.swift` |
| `cache_cleared` | User cleared the app cache from Settings | `Features/Settings/Sources/Settings/SettingsViewModel.swift` |

## Next steps

To get started with PostHog analytics, log in to your PostHog project and build the following suggested insights for an **"Analytics basics"** dashboard:

1. **Login conversion funnel** — Funnel: `user_logged_in` → `post_voted` or `post_searched`. Shows how many users who sign in go on to engage with content.
2. **Purchase conversion funnel** — Funnel: `purchase_initiated` → `purchase_completed`. Reveals the conversion rate from tapping purchase to completing it, and highlights drop-off due to `purchase_failed`.
3. **Onboarding completion rate** — Trend of `onboarding_completed` over time. Tracks whether new users are making it through onboarding.
4. **Top feed categories** — Breakdown of `feed_category_changed` by `category` property. Shows which sections (Top, Ask, Show, etc.) users navigate to most.
5. **Search engagement** — Trend of `post_searched` alongside average `result_count` property. Indicates search usage and quality.

Visit [https://us.posthog.com/project/2/dashboard](https://us.posthog.com/project/2/dashboard) to create the "Analytics basics" dashboard and add these insights.

### Configuration reminder

The PostHog environment variables are set in the Xcode scheme (`Hackers.xcscheme`) for local development. Make sure each developer on the team has these set, or configure them via your CI/CD environment. The values are also stored in `.env` at the project root (gitignored).

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-swift/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
