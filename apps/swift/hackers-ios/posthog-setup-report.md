<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Hackers iOS app. The PostHog iOS SDK (v3.48.0) was added as a Swift Package Manager dependency and initialized in the app entry point. A `PostHogEnv` enum reads the project token and host from the Xcode scheme environment variables at runtime, avoiding any hardcoded secrets. Application lifecycle events (app open, background, foreground) are captured automatically. Thirteen custom events covering user authentication, feed interaction, content engagement, in-app purchases, and settings were instrumented across six files.

| Event | Description | File |
|-------|-------------|------|
| `user_logged_in` | User successfully authenticated with HN credentials | `Features/Authentication/Sources/Authentication/LoginViewModel.swift` |
| `user_login_failed` | Login attempt failed (bad credentials or network error) | `Features/Authentication/Sources/Authentication/LoginViewModel.swift` |
| `user_logged_out` | User logged out (also calls `PostHogSDK.shared.reset()`) | `Features/Authentication/Sources/Authentication/LoginViewModel.swift` |
| `feed_category_changed` | User switched feed category (Top, New, Ask, Jobs, Bookmarks) | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `post_voted` | User upvoted a post from the feed | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `post_bookmarked` | User bookmarked or unbookmarked a post | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `search_performed` | User performed a search query | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `comments_viewed` | User opened the comments view for a post | `Features/Comments/Sources/Comments/CommentsViewModel.swift` |
| `comment_voted` | User upvoted a comment in a thread | `Features/Comments/Sources/Comments/CommentsViewModel.swift` |
| `purchase_completed` | User completed an in-app purchase (subscription or tip) | `Features/Settings/Sources/Settings/SupportViewModel.swift` |
| `purchase_failed` | In-app purchase attempt failed | `Features/Settings/Sources/Settings/SupportViewModel.swift` |
| `onboarding_completed` | User dismissed the onboarding flow | `App/OnboardingCoordinator.swift` |
| `cache_cleared` | User cleared the app cache from settings | `Features/Settings/Sources/Settings/SettingsViewModel.swift` |

## Next steps

The PostHog API key provided does not have dashboard/insight write scope, so the dashboard could not be created automatically. You can create an "Analytics basics" dashboard manually at:

- **PostHog project**: https://us.posthog.com/project/2/dashboard

Suggested insights to add to the dashboard:

1. **Login conversion funnel** — Funnel from `user_login_failed` + `user_logged_in` to measure authentication success rate
2. **Post engagement trends** — Trend line of `post_voted`, `post_bookmarked`, and `comments_viewed` over time
3. **Feed category distribution** — Breakdown of `feed_category_changed` by `to_category` property
4. **In-app purchase funnel** — `purchase_completed` vs `purchase_failed` to track conversion and failure rates
5. **Search adoption** — Trend of `search_performed` with `result_count` average to understand search usage

### Xcode scheme setup

The `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` environment variables have been added to `Hackers.xcodeproj/xcshareddata/xcschemes/Hackers.xcscheme`. When you open the project in Xcode and run it, PostHog will initialize automatically.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-swift/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
