<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Hackers iOS app. The PostHog iOS SDK (v3.59.3) was added via Swift Package Manager to the Xcode project and to each affected feature package. PostHog is initialized in `AppDelegate` on app launch with application lifecycle event capture enabled. User identification is called on login and reset on logout. Eleven business-critical events are tracked across authentication, feed browsing, post engagement, search, onboarding, and in-app purchases.

| Event | Description | File |
|-------|-------------|------|
| `user_logged_in` | User successfully authenticated with their Hacker News credentials | `Features/Authentication/Sources/Authentication/LoginViewModel.swift` |
| `user_logged_out` | User logged out of their Hacker News account | `Features/Authentication/Sources/Authentication/LoginViewModel.swift` |
| `feed_category_changed` | User switched to a different feed category (news, ask, show, jobs, etc.) | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `post_upvoted` | User upvoted a post in the feed | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `post_bookmarked` | User bookmarked or unbookmarked a post | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `search_performed` | User performed a search query on Hacker News | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `link_opened` | User opened the external link associated with a post | `Features/Feed/Sources/Feed/FeedView.swift` |
| `post_opened` | User opened a post to view comments | `Features/Comments/Sources/Comments/CommentsViewModel.swift` |
| `comment_upvoted` | User upvoted a comment | `Features/Comments/Sources/Comments/CommentsViewModel.swift` |
| `onboarding_completed` | User dismissed the onboarding screen (tapped Continue or close) | `Features/Onboarding/Sources/Onboarding/Views/OnboardingView.swift` |
| `support_purchase_completed` | User successfully purchased a supporter subscription or tip | `Features/Settings/Sources/Settings/SupportViewModel.swift` |

## Next steps

To create the "Analytics basics (wizard)" dashboard in PostHog, navigate to [Dashboards](https://us.posthog.com/project/2/dashboards) and create a new dashboard with the following suggested insights:

1. **Login funnel** — Funnel from `user_logged_in` → `post_opened` → `post_upvoted` to measure new-user engagement depth
2. **Daily active engagement** — Trends for `post_opened`, `link_opened`, and `search_performed` to track core reading behaviour over time
3. **Voting engagement** — Trends for `post_upvoted` and `comment_upvoted` to understand how engaged users are with content
4. **Revenue events** — Trends for `support_purchase_completed` broken down by `product_kind` (subscription vs. tip)
5. **Onboarding completion rate** — Funnel from app launch (Application Opened lifecycle event) → `onboarding_completed` → `user_logged_in`

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-swift/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
