<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Hackers iOS app. Here is a summary of all changes made:

## Summary of changes

- **PostHog iOS SDK** (v3.57.5) added as a Swift Package Manager dependency in `Hackers.xcodeproj/project.pbxproj` and pinned in `Package.resolved`.
- **SDK initialization** added to `App/HackersApp.swift` with a `PostHogEnv` enum for type-safe environment variable access and `captureApplicationLifecycleEvents` enabled.
- **Environment variables** (`POSTHOG_PROJECT_TOKEN`, `POSTHOG_HOST`) added to the Xcode scheme's Run environment variables in `Hackers.xcodeproj/xcshareddata/xcschemes/Hackers.xcscheme`.
- **User identification** via `PostHogSDK.shared.identify()` on login, and `PostHogSDK.shared.reset()` on logout.
- **13 events** instrumented across 5 files covering authentication, feed interaction, search, comments, purchases, settings, and onboarding.

## Events instrumented

| Event | Description | File |
|-------|-------------|------|
| `user_logged_in` | Fired when a user successfully authenticates with their HN credentials | `Features/Authentication/Sources/Authentication/LoginViewModel.swift` |
| `login_failed` | Fired when a login attempt fails due to bad credentials or network error | `Features/Authentication/Sources/Authentication/LoginViewModel.swift` |
| `user_logged_out` | Fired when the user logs out of their HN account | `Features/Authentication/Sources/Authentication/LoginViewModel.swift` |
| `post_upvoted` | Fired when a user upvotes a post from the feed | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `post_bookmarked` | Fired when a user bookmarks or unbookmarks a post (is_bookmarked property indicates direction) | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `feed_category_changed` | Fired when the user switches between feed categories (top, new, ask, show, jobs, bookmarks) | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `search_performed` | Fired when the user performs a search and results are returned | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `comments_viewed` | Fired when comments are successfully loaded for a post — top of the comments funnel | `Features/Comments/Sources/Comments/CommentsViewModel.swift` |
| `comment_upvoted` | Fired when a user upvotes a comment | `Features/Comments/Sources/Comments/CommentsViewModel.swift` |
| `support_purchase_completed` | Fired when a user successfully completes a tip or subscription purchase | `Features/Settings/Sources/Settings/SupportViewModel.swift` |
| `support_purchase_failed` | Fired when a purchase attempt throws an error | `Features/Settings/Sources/Settings/SupportViewModel.swift` |
| `cache_cleared` | Fired when the user clears the app cache from Settings | `Features/Settings/Sources/Settings/SettingsViewModel.swift` |
| `onboarding_completed` | Fired when the user dismisses the onboarding screen (first-time or after update) | `App/OnboardingCoordinator.swift` |

## Next steps

Create an **"Analytics basics"** dashboard in PostHog with these recommended insights:

1. **Login conversion funnel** — Funnel from `user_logged_in` → `comments_viewed` → `post_upvoted` to see how engaged users become after logging in.
2. **User login/logout trend** — Trend chart of `user_logged_in` and `user_logged_out` over time to track active sessions.
3. **Search usage** — Trend of `search_performed` with breakdown by `result_count` to understand search effectiveness.
4. **Engagement: upvotes & bookmarks** — Trend combining `post_upvoted`, `comment_upvoted`, and `post_bookmarked` to measure content engagement.
5. **Support purchases** — Trend of `support_purchase_completed` and `support_purchase_failed` to track monetization and purchase friction.

Build these at: https://us.posthog.com/project/2/insights/new

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-swift/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
