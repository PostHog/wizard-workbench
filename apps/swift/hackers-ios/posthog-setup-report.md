<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Hackers iOS app. Here is a summary of all changes made:

**SDK installation:** PostHog iOS SDK (v3.48.0) was added as an SPM dependency to `Hackers.xcodeproj/project.pbxproj` and as a package dependency to four feature packages (`Features/Authentication`, `Features/Feed`, `Features/Comments`, `Features/Settings`).

**Initialization:** A `PostHogAnalytics.swift` helper was created in `App/` with a `PostHogEnv` enum that reads `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from Xcode scheme environment variables (added to `Hackers.xcscheme`). PostHog is initialized in `HackersApp.init()` with `captureApplicationLifecycleEvents` enabled.

**User identification:** On successful login, `PostHogSDK.shared.identify()` is called with the HN username, linking all subsequent events to the authenticated user. On logout, `PostHogSDK.shared.reset()` is called to clear the identity.

**Event tracking:** 12 events were instrumented across 4 ViewModels.

| Event | Description | File |
|-------|-------------|------|
| `user_logged_in` | User successfully logged in to their Hacker News account | `Features/Authentication/Sources/Authentication/LoginViewModel.swift` |
| `login_failed` | User attempted to log in but authentication failed | `Features/Authentication/Sources/Authentication/LoginViewModel.swift` |
| `user_logged_out` | User logged out of their Hacker News account | `Features/Authentication/Sources/Authentication/LoginViewModel.swift` |
| `feed_category_changed` | User switched the feed category (e.g. Top, New, Best, Jobs) | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `post_searched` | User performed a search for posts | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `post_upvoted` | User upvoted a post from the feed | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `post_bookmarked` | User bookmarked or unbookmarked a post | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `comments_viewed` | User opened the comments for a post | `Features/Comments/Sources/Comments/CommentsViewModel.swift` |
| `comment_upvoted` | User upvoted a comment | `Features/Comments/Sources/Comments/CommentsViewModel.swift` |
| `purchase_completed` | User successfully completed an in-app purchase (tip or subscription) | `Features/Settings/Sources/Settings/SupportViewModel.swift` |
| `purchase_failed` | User attempted a purchase but it failed with an error | `Features/Settings/Sources/Settings/SupportViewModel.swift` |
| `purchases_restored` | User restored previous purchases | `Features/Settings/Sources/Settings/SupportViewModel.swift` |

## Next steps

Head to your PostHog dashboards to build insights from these events. Here are some recommended insights to create:

- **Login trend** — Trend of `user_logged_in` over time to track daily active authenticated users
- **Login funnel** — Funnel from `user_logged_in` → `comments_viewed` → `post_upvoted` to measure engagement depth
- **Purchase conversion funnel** — Funnel from `user_logged_in` → `purchase_completed` to track monetization
- **Search usage** — Trend of `post_searched` with `result_count` property to understand search behavior
- **Engagement breakdown** — Bar chart of `post_upvoted`, `post_bookmarked`, `comment_upvoted` to see which actions users take most

**PostHog Dashboards:** https://us.posthog.com/project/238460/dashboard

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-swift/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
