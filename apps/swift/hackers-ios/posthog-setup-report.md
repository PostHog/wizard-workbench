<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Hackers iOS app. The posthog-ios SDK was added as a Swift Package Manager dependency to the Xcode project and all relevant Swift Package modules. PostHog is initialized at app launch in `HackersApp.swift` using environment variables read via a `PostHogEnv` enum. Thirteen events covering the full user journey — from authentication and feed interaction through purchases and onboarding — are now captured across six source files. User identity is established on login via `PostHogSDK.shared.identify()` and cleared on logout via `PostHogSDK.shared.reset()`.

| Event | Description | File |
|-------|-------------|------|
| `user_logged_in` | User successfully signs in | `Features/Authentication/Sources/Authentication/LoginViewModel.swift` |
| `login_failed` | Login attempt failed | `Features/Authentication/Sources/Authentication/LoginViewModel.swift` |
| `user_logged_out` | User signed out | `Features/Authentication/Sources/Authentication/LoginViewModel.swift` |
| `feed_category_changed` | User switched feed category (news, ask, show, etc.) | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `post_searched` | User submitted a search query | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `post_bookmarked` | User bookmarked a post | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `post_bookmark_removed` | User removed a bookmark | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `post_upvoted` | User upvoted a post | `Shared/Sources/Shared/ViewModels/VotingViewModel.swift` |
| `comment_upvoted` | User upvoted a comment | `Shared/Sources/Shared/ViewModels/VotingViewModel.swift` |
| `support_purchase_completed` | User completed a subscription or tip purchase | `Features/Settings/Sources/Settings/SupportViewModel.swift` |
| `support_purchase_failed` | Purchase attempt failed with an error | `Features/Settings/Sources/Settings/SupportViewModel.swift` |
| `cache_cleared` | User cleared the app cache from settings | `Features/Settings/Sources/Settings/SettingsViewModel.swift` |
| `onboarding_completed` | User completed or dismissed onboarding | `App/OnboardingCoordinator.swift` |

## Next steps

Visit your PostHog project to explore the events as they flow in and build insights:

- [PostHog Project Dashboard](https://us.posthog.com/project/2/dashboard)
- [Login funnel: user_logged_in → feed_category_changed](https://us.posthog.com/project/2/insights/new)
- [Purchase conversion: support_purchase_completed](https://us.posthog.com/project/2/insights/new)
- [Engagement: post_upvoted, comment_upvoted, post_bookmarked](https://us.posthog.com/project/2/insights/new)
- [Retention: session trends over time](https://us.posthog.com/project/2/insights/new)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-swift/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
