<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Hackers iOS app. The PostHog iOS SDK (v3.40.0) was added via Swift Package Manager to the main Xcode project and all relevant feature packages. PostHog is initialized in the app entry point with environment-variable-based configuration, and 14 distinct events are tracked across authentication, feed browsing, comments, in-app purchases, settings, and onboarding flows. Users are identified on login via `PostHogSDK.shared.identify()` and reset on logout.

| Event | Description | File |
|---|---|---|
| `login_completed` | User successfully logged in to Hacker News | `Features/Authentication/Sources/Authentication/LoginViewModel.swift` |
| `login_failed` | User login attempt failed | `Features/Authentication/Sources/Authentication/LoginViewModel.swift` |
| `logout_completed` | User logged out | `Features/Authentication/Sources/Authentication/LoginViewModel.swift` |
| `post_upvoted` | User upvoted a post in feed or comments | `Features/Feed/Sources/Feed/FeedViewModel.swift`, `Features/Comments/Sources/Comments/CommentsViewModel.swift` |
| `comment_upvoted` | User upvoted a comment | `Features/Comments/Sources/Comments/CommentsViewModel.swift` |
| `post_bookmarked` | User bookmarked a post | `Features/Feed/Sources/Feed/FeedViewModel.swift`, `Features/Comments/Sources/Comments/CommentsViewModel.swift` |
| `post_unbookmarked` | User removed a bookmark | `Features/Feed/Sources/Feed/FeedViewModel.swift`, `Features/Comments/Sources/Comments/CommentsViewModel.swift` |
| `search_performed` | User performed a search | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `feed_category_changed` | User switched feed category | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `purchase_started` | User initiated an in-app purchase | `Features/Settings/Sources/Settings/SupportViewModel.swift` |
| `purchase_completed` | User completed an in-app purchase | `Features/Settings/Sources/Settings/SupportViewModel.swift` |
| `purchase_failed` | User's purchase attempt failed | `Features/Settings/Sources/Settings/SupportViewModel.swift` |
| `onboarding_completed` | User completed onboarding | `App/OnboardingCoordinator.swift` |
| `setting_changed` | User changed a setting | `Features/Settings/Sources/Settings/SettingsViewModel.swift` |

## Next steps

To set up analytics insights in PostHog, create a dashboard named **"Analytics basics"** at https://us.posthog.com/project/2/dashboard with the following suggested insights:

1. **Login conversion funnel** — Funnel from `login_completed` through `post_upvoted` to track authenticated engagement
2. **Purchase conversion** — Trend of `purchase_started` vs `purchase_completed` to measure purchase success rate
3. **Engagement by feed category** — Breakdown of `feed_category_changed` by `to_category` property to see most popular categories
4. **Search usage** — Trend of `search_performed` with average `result_count` to understand search effectiveness
5. **Retention via bookmarks** — Trend of `post_bookmarked` and `post_unbookmarked` to measure content save behavior

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
