<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Hackers iOS app. Here's a summary of all changes made:

**Package integration**: Added `posthog-ios` (v3.47.0) as a Swift Package Manager dependency in `project.pbxproj` and in the `Package.swift` files for the `Authentication`, `Feed`, `Comments`, `Settings`, and `Shared` feature modules.

**Initialization**: PostHog is initialized in `HackersApp.swift` using a `PostHogEnv` enum that reads `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from Xcode scheme environment variables (configured in `Hackers.xcscheme`). Application lifecycle events are captured automatically.

**User identification**: Users are identified with `PostHogSDK.shared.identify()` on login, and identity is reset with `PostHogSDK.shared.reset()` on logout, enabling accurate user-level analytics.

**Event tracking**: 12 events were added across 5 files covering authentication, content engagement, search, and in-app purchases.

| Event | Description | File |
|-------|-------------|------|
| `user_logged_in` | User successfully authenticated | `Features/Authentication/Sources/Authentication/LoginViewModel.swift` |
| `login_failed` | Login attempt failed | `Features/Authentication/Sources/Authentication/LoginViewModel.swift` |
| `user_logged_out` | User logged out | `Features/Authentication/Sources/Authentication/LoginViewModel.swift` |
| `post_upvoted` | User upvoted a post | `Shared/Sources/Shared/ViewModels/VotingViewModel.swift` |
| `comment_upvoted` | User upvoted a comment | `Shared/Sources/Shared/ViewModels/VotingViewModel.swift` |
| `post_bookmarked` | User bookmarked a post | `Features/Comments/Sources/Comments/CommentsViewModel.swift` |
| `post_unbookmarked` | User removed a bookmark | `Features/Comments/Sources/Comments/CommentsViewModel.swift` |
| `search_performed` | User performed a search | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `feed_category_changed` | User switched feed category | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `purchase_completed` | In-app purchase succeeded | `Features/Settings/Sources/Settings/SupportViewModel.swift` |
| `purchase_failed` | In-app purchase failed | `Features/Settings/Sources/Settings/SupportViewModel.swift` |
| `purchases_restored` | Previous purchases restored | `Features/Settings/Sources/Settings/SupportViewModel.swift` |

## Next steps

We've prepared an "Analytics basics" dashboard for you to set up in PostHog. Create it at:

- [Create new dashboard](https://us.posthog.com/project/2/dashboard/new)

Suggested insights to add to the dashboard:

1. **Login funnel** — Funnel from `user_logged_in` → `feed_category_changed` to measure onboarding activation
   - [Create funnel insight](https://us.posthog.com/project/2/insights/new#funnel)

2. **Daily active users** — Trend of `user_logged_in` events over time to track DAU
   - [Create trend insight](https://us.posthog.com/project/2/insights/new#trends)

3. **Content engagement** — Trends for `post_upvoted`, `comment_upvoted`, `post_bookmarked` to measure engagement depth
   - [Create trend insight](https://us.posthog.com/project/2/insights/new#trends)

4. **Search usage** — Trend of `search_performed` with `result_count` property to track search value
   - [Create trend insight](https://us.posthog.com/project/2/insights/new#trends)

5. **Purchase conversion funnel** — Funnel from `user_logged_in` → `purchase_completed` to measure monetization
   - [Create funnel insight](https://us.posthog.com/project/2/insights/new#funnel)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-swift/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
