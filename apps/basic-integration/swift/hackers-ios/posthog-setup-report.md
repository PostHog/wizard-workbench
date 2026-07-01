<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Hackers iOS app (a Hacker News reader built with SwiftUI). PostHog was added as a Swift Package Manager dependency to the main Xcode project and all relevant feature packages (Authentication, Feed, Comments, Settings, Shared). The SDK is initialized once in `HackersApp.init()` with lifecycle event capture enabled. Users are identified by username on login, and the anonymous identity is reset on logout. Fourteen business-critical events are now captured across five feature modules.

| Event Name | Description | File |
|---|---|---|
| `user_logged_in` | User successfully authenticates with their Hacker News credentials. | `Features/Authentication/Sources/Authentication/LoginViewModel.swift` |
| `user_logged_out` | User signs out of the app. | `Features/Authentication/Sources/Authentication/LoginViewModel.swift` |
| `login_failed` | Authentication attempt fails due to invalid credentials or a network error. | `Features/Authentication/Sources/Authentication/LoginViewModel.swift` |
| `feed_category_changed` | User switches the feed to a different post category (e.g., Top, Ask, Show, Jobs). | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `post_upvoted` | User upvotes a post. | `Shared/Sources/Shared/ViewModels/VotingViewModel.swift` |
| `post_bookmarked` | User adds or removes a bookmark on a post. | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `search_performed` | User submits a search query and results are returned. | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `comments_post_upvoted` | User upvotes the parent post from within the comments screen. | `Features/Comments/Sources/Comments/CommentsViewModel.swift` |
| `comment_upvoted` | User upvotes an individual comment. | `Shared/Sources/Shared/ViewModels/VotingViewModel.swift` |
| `support_purchased` | User successfully completes an in-app purchase (subscription or tip). | `Features/Settings/Sources/Settings/SupportViewModel.swift` |
| `support_purchase_failed` | An in-app purchase attempt fails with an error. | `Features/Settings/Sources/Settings/SupportViewModel.swift` |
| `purchases_restored` | User successfully restores previous in-app purchases. | `Features/Settings/Sources/Settings/SupportViewModel.swift` |
| `settings_changed` | User modifies an app setting such as text size, thumbnails, or browser preference. | `Features/Settings/Sources/Settings/SettingsViewModel.swift` |
| `cache_cleared` | User clears the app cache from the settings screen. | `Features/Settings/Sources/Settings/SettingsViewModel.swift` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard:** [Analytics basics (wizard)](https://us.i.posthog.com/project/483112/dashboard/1787565)
- **Login Funnel: Success vs Failure** — tracks `user_logged_in` vs `login_failed` over 30 days
- **Upvote Activity: Posts and Comments** — daily `post_upvoted` and `comment_upvoted` trends
- **Support Conversion: Purchases by Type** — `support_purchased` broken down by subscription vs tip
- **Feature Engagement: Search, Bookmarks, Feed** — daily trends for `search_performed`, `post_bookmarked`, `feed_category_changed`
- **Churn Signal: User Logouts Over Time** — weekly `user_logged_out` vs `user_logged_in` comparison

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names (`POSTHOG_API_KEY`, `POSTHOG_HOST`) to `.env.example` and any bootstrap scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs. Consider calling `identify` on app launch if a stored username is present.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
