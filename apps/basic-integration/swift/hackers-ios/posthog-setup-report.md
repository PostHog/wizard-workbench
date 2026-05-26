<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Hackers iOS app. The PostHog iOS SDK (v3.58.3) was added via Swift Package Manager to both the main Xcode project and to all relevant feature packages (Authentication, Feed, Comments, Settings). PostHog is initialized at app startup in `HackersApp.swift` using environment variables set in the Xcode scheme. Users are identified by username on login and the session is reset on logout. Twelve events covering key user flows — authentication, content engagement, social features, purchasing, and onboarding — were instrumented across seven files.

| Event | Description | File |
|---|---|---|
| `user_logged_in` | User successfully authenticated with their Hacker News credentials | `Features/Authentication/Sources/Authentication/LoginViewModel.swift` |
| `user_logged_out` | User explicitly signed out of their account | `Features/Authentication/Sources/Authentication/LoginViewModel.swift` |
| `login_failed` | User attempted login with invalid credentials | `Features/Authentication/Sources/Authentication/LoginViewModel.swift` |
| `post_upvoted` | User upvoted a post from the feed | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `post_bookmarked` | User saved a post to their bookmarks | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `post_unbookmarked` | User removed a post from their bookmarks | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `feed_category_changed` | User switched to a different feed category (Top, Ask, Show, Jobs, etc.) | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `post_searched` | User performed a search query for posts | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `comment_upvoted` | User upvoted a comment in a thread | `Features/Comments/Sources/Comments/CommentsViewModel.swift` |
| `setting_changed` | User changed an app setting (text size, thumbnails, compact mode, etc.) | `Features/Settings/Sources/Settings/SettingsViewModel.swift` |
| `purchase_completed` | User successfully completed a purchase (subscription or tip) | `Features/Settings/Sources/Settings/SupportViewModel.swift` |
| `purchase_restored` | User successfully restored previous purchases | `Features/Settings/Sources/Settings/SupportViewModel.swift` |
| `purchase_failed` | A purchase attempt failed | `Features/Settings/Sources/Settings/SupportViewModel.swift` |
| `onboarding_completed` | User completed or dismissed the onboarding flow | `App/OnboardingCoordinator.swift` |

## Next steps

Visit your [PostHog project](https://us.posthog.com/project/2) to create an **"Analytics basics"** dashboard. Suggested insights:

1. **Login funnel** — Funnel from `user_logged_in` to `post_upvoted` to measure how quickly engaged users become active voters.
2. **Purchase conversion** — Trends insight for `purchase_completed` (broken down by `product_kind` to compare subscriptions vs. tips).
3. **Feed engagement** — Trends insight for `post_upvoted`, `post_bookmarked`, and `comment_upvoted` on the same chart to track overall content engagement.
4. **Search adoption** — Trends insight for `post_searched` to understand how many users actively search vs. browse.
5. **Settings customization** — Trends insight for `setting_changed` broken down by `setting_name` to see which settings users change most.

To create these: go to [Insights](https://us.posthog.com/project/2/insights) → New Insight, build each query, save, then add to a new dashboard named "Analytics basics" from [Dashboards](https://us.posthog.com/project/2/dashboard).

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-swift/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
