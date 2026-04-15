<wizard-report>
# PostHog post-wizard report

The wizard has completed a full PostHog analytics integration for the Hackers iOS app. PostHog SDK 3.50.0 was added via Swift Package Manager to the main Xcode project and to each affected Feature package. The SDK is initialized in `HackersApp.swift` with lifecycle event capture enabled, reading credentials from Xcode scheme environment variables via a `PostHogEnv` enum. Users are identified by their Hacker News username on login, and the session is reset on logout. Fifteen distinct events covering authentication, feed browsing, commenting, in-app purchases, onboarding, and settings are now captured across the app.

| Event | Description | File |
|---|---|---|
| `user_logged_in` | User successfully authenticates with HN credentials | `Features/Authentication/Sources/Authentication/LoginViewModel.swift` |
| `user_logged_out` | User explicitly logs out | `Features/Authentication/Sources/Authentication/LoginViewModel.swift` |
| `login_failed` | Login attempt fails (e.g. bad credentials) | `Features/Authentication/Sources/Authentication/LoginViewModel.swift` |
| `feed_category_changed` | User switches feed type (news, newest, jobs, etc.) | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `post_searched` | User performs a search in the feed | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `post_upvoted` | User upvotes a post from the feed | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `post_bookmarked` | User bookmarks or unbookmarks a post | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `comments_viewed` | User opens the comments view for a post | `Features/Comments/Sources/Comments/CommentsViewModel.swift` |
| `comment_upvoted` | User upvotes a comment | `Features/Comments/Sources/Comments/CommentsViewModel.swift` |
| `comment_collapsed` | User collapses or expands a comment thread | `Features/Comments/Sources/Comments/CommentsViewModel.swift` |
| `purchase_completed` | User successfully completes an in-app purchase | `Features/Settings/Sources/Settings/SupportViewModel.swift` |
| `purchase_failed` | An in-app purchase fails | `Features/Settings/Sources/Settings/SupportViewModel.swift` |
| `purchases_restored` | User restores prior purchases | `Features/Settings/Sources/Settings/SupportViewModel.swift` |
| `onboarding_completed` | User dismisses the onboarding screen | `App/OnboardingCoordinator.swift` |
| `cache_cleared` | User manually clears the app cache | `Features/Settings/Sources/Settings/SettingsViewModel.swift` |

## Next steps

We've set up the event tracking. To monitor user behavior, create an **"Analytics basics"** dashboard in PostHog with these recommended insights:

- **Login Conversion Funnel** — `comments_viewed` → `post_upvoted` (measures engagement depth)
- **Authentication Funnel** — `user_logged_in` → `user_logged_out` (measures session retention)
- **Purchase Conversion** — `purchase_completed` total count with breakdown by `product_kind`
- **Feed Engagement** — Trend of `feed_category_changed` + `post_searched` over time
- **Onboarding Completion Rate** — `onboarding_completed` unique users

Visit your PostHog project to create this dashboard:
- [PostHog Dashboard: https://us.i.posthog.com/project/2/dashboards](https://us.i.posthog.com/project/2/dashboards)
- [New Insight: https://us.i.posthog.com/project/2/insights/new](https://us.i.posthog.com/project/2/insights/new)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-swift/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
