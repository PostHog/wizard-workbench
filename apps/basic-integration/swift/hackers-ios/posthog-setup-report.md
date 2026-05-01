<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Hackers iOS app. The PostHog iOS SDK (v3.57.3) was added via Swift Package Manager to the main Xcode project and to each Swift Package module that required tracking. A `PostHogEnv` enum was added to read the project token and host from Xcode scheme environment variables at runtime. PostHog is initialized in `HackersApp.init()` with lifecycle event capture enabled. Events cover the full user journey: authentication, feed browsing, search, voting, bookmarks, in-app purchases, onboarding, and settings.

| Event | Description | File |
|---|---|---|
| `user_logged_in` | User successfully authenticated with HN credentials | `Features/Authentication/Sources/Authentication/LoginViewModel.swift` |
| `user_logged_out` | User logged out of their HN account | `Features/Authentication/Sources/Authentication/LoginViewModel.swift` |
| `login_failed` | Login attempt failed due to bad credentials or error | `Features/Authentication/Sources/Authentication/LoginViewModel.swift` |
| `feed_category_changed` | User switched to a different feed category (news, ask, show, jobs, etc.) | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `search_performed` | User performed a search query on Hacker News | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `post_upvoted` | User upvoted a post from the feed | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `post_bookmarked` | User bookmarked or unbookmarked a post | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `comment_upvoted` | User upvoted a comment in the comments view | `Features/Comments/Sources/Comments/CommentsViewModel.swift` |
| `support_purchase_completed` | User successfully completed an in-app purchase (subscription or tip) | `Features/Settings/Sources/Settings/SupportViewModel.swift` |
| `support_purchase_failed` | An in-app purchase attempt failed | `Features/Settings/Sources/Settings/SupportViewModel.swift` |
| `support_purchases_restored` | User successfully restored their previous purchases | `Features/Settings/Sources/Settings/SupportViewModel.swift` |
| `onboarding_completed` | User completed or dismissed the onboarding flow | `App/OnboardingCoordinator.swift` |
| `settings_cache_cleared` | User cleared the app cache from Settings | `Features/Settings/Sources/Settings/SettingsViewModel.swift` |

## Next steps

Create an **"Analytics basics"** dashboard in PostHog with these five insights to keep an eye on user behavior:

1. **Login conversion funnel** — Funnel from `user_logged_in` → `post_upvoted` or `comment_upvoted`. Shows how many users who log in go on to engage with content.
   [Create in PostHog →](https://us.posthog.com/project/2/insights/new#funnel)

2. **Active user trend** — Trend of `user_logged_in` events over time. Core retention signal.
   [Create in PostHog →](https://us.posthog.com/project/2/insights/new#trends)

3. **Revenue events** — Trend of `support_purchase_completed` broken down by `product_kind` (subscription vs. tip). Tracks monetization.
   [Create in PostHog →](https://us.posthog.com/project/2/insights/new#trends)

4. **Search engagement** — Trend of `search_performed` alongside `post_upvoted` and `post_bookmarked`. Shows whether search leads to deeper engagement.
   [Create in PostHog →](https://us.posthog.com/project/2/insights/new#trends)

5. **Churn signal** — Trend of `user_logged_out` events and `support_purchase_failed` events. Early warning for user dissatisfaction or payment friction.
   [Create in PostHog →](https://us.posthog.com/project/2/insights/new#trends)

[Open PostHog Dashboards →](https://us.posthog.com/project/2/dashboards)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-swift/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
