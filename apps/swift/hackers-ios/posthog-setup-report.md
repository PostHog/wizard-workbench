<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Hackers iOS app. The PostHog iOS SDK (v3.47.0) was added via Swift Package Manager to the main Xcode project target and to all relevant feature packages (Authentication, Feed, Comments, Settings). PostHog is initialized in `HackersApp.swift` with lifecycle event capture enabled. Environment variables (`POSTHOG_PROJECT_TOKEN`, `POSTHOG_HOST`) are configured in the Xcode scheme's Run action and referenced via a `PostHogEnv` enum. User identification is performed on login (with `PostHogSDK.shared.identify`) and the identity is reset on logout (with `PostHogSDK.shared.reset`).

| Event Name | Description | File |
|---|---|---|
| `user_logged_in` | User successfully authenticates with HN credentials | `Features/Authentication/Sources/Authentication/LoginViewModel.swift` |
| `user_logged_out` | User logs out of their HN account | `Features/Authentication/Sources/Authentication/LoginViewModel.swift` |
| `login_failed` | Login attempt fails due to bad credentials or network error | `Features/Authentication/Sources/Authentication/LoginViewModel.swift` |
| `feed_category_changed` | User switches between feed categories (News, Ask, Show, etc.) | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `post_upvoted` | User upvotes a post from the feed | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `post_bookmark_toggled` | User bookmarks or unbookmarks a post from the feed | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `post_searched` | User performs a search query for posts | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `comment_upvoted` | User upvotes a comment in the comments view | `Features/Comments/Sources/Comments/CommentsViewModel.swift` |
| `post_upvoted_from_comments` | User upvotes a post while viewing its comments | `Features/Comments/Sources/Comments/CommentsViewModel.swift` |
| `support_purchase_completed` | User successfully completes a tip or subscription purchase | `Features/Settings/Sources/Settings/SupportViewModel.swift` |
| `support_purchase_cancelled` | User cancels a tip or subscription purchase | `Features/Settings/Sources/Settings/SupportViewModel.swift` |
| `support_restore_completed` | User successfully restores prior purchases | `Features/Settings/Sources/Settings/SupportViewModel.swift` |
| `onboarding_completed` | User dismisses the onboarding flow for the first time | `App/OnboardingCoordinator.swift` |

## Next steps

To complete the setup, build and run the app in Xcode so that PostHog resolves the package dependency. Open the Xcode scheme editor (**Product → Scheme → Edit Scheme → Run → Arguments**) to verify the environment variables are set.

We recommend building an **"Analytics basics"** dashboard in PostHog with these suggested insights:

- **Login funnel** — Funnel: `user_logged_in` → `feed_category_changed` → `post_upvoted` (shows how users engage after signing in)
- **Purchase conversion funnel** — Funnel: `user_logged_in` → `support_purchase_completed` (key revenue conversion)
- **Support purchase outcomes** — Breakdown of `support_purchase_completed` vs `support_purchase_cancelled` by `product_kind`
- **Top search queries** — Table of `post_searched` events broken down by `query` property
- **Feed engagement** — Trend chart of `post_upvoted`, `comment_upvoted`, and `post_bookmark_toggled` over time

You can create this dashboard at: https://us.posthog.com/project/2/dashboard

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-swift/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
