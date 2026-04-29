<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Hackers iOS app. Here is a summary of all changes made:

## What was done

- **PostHog iOS SDK** added via Swift Package Manager to the Xcode project (`Hackers.xcodeproj/project.pbxproj`) and to all relevant local Swift packages (`Features/Authentication`, `Features/Feed`, `Features/Comments`, `Features/Settings`, `Shared`).
- **Environment variables** `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` added to the Xcode scheme Run environment variables and to a local `.env` file.
- **PostHog initialization** added in `App/HackersApp.swift` using a `PostHogEnv` enum that reads configuration from Xcode scheme environment variables at launch. Lifecycle events are captured automatically via `captureApplicationLifecycleEvents = true`.
- **User identification** implemented in `LoginViewModel` — `PostHogSDK.shared.identify()` is called on successful login to associate events with the authenticated HN username. On logout, `PostHogSDK.shared.reset()` clears the identity.
- **Event tracking** added across 7 files covering all major user actions (see table below).

## Events instrumented

| Event | Description | File |
|-------|-------------|------|
| `user_logged_in` | User successfully authenticated with HN credentials | `Features/Authentication/Sources/Authentication/LoginViewModel.swift` |
| `user_logged_out` | User logged out from their HN account | `Features/Authentication/Sources/Authentication/LoginViewModel.swift` |
| `post_upvoted` | User upvoted a post (feed or comments) | `Shared/Sources/Shared/ViewModels/VotingViewModel.swift`, `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `post_bookmarked` | User toggled a bookmark on a post | `Features/Feed/Sources/Feed/FeedViewModel.swift`, `Features/Comments/Sources/Comments/CommentsViewModel.swift` |
| `feed_category_changed` | User switched feed category (Top, Ask, Show, Jobs, etc.) | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `search_performed` | User executed a search query | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `comment_upvoted` | User upvoted a comment in a thread | `Shared/Sources/Shared/ViewModels/VotingViewModel.swift`, `Features/Comments/Sources/Comments/CommentsViewModel.swift` |
| `support_purchase_completed` | User completed an in-app purchase (tip or subscription) | `Features/Settings/Sources/Settings/SupportViewModel.swift` |
| `support_purchases_restored` | User restored previous in-app purchases | `Features/Settings/Sources/Settings/SupportViewModel.swift` |
| `onboarding_completed` | User dismissed onboarding (first launch or manual) | `App/OnboardingCoordinator.swift` |
| `setting_changed` | User changed an app setting | `Features/Settings/Sources/Settings/SettingsViewModel.swift` |

## Next steps

We've prepared an "Analytics basics" dashboard for you. Create it in PostHog with these five key insights:

1. **Login trend** — Track `user_logged_in` over time to measure active user growth
   - [Create insight](https://us.posthog.com/project/2/insights/new#{"insight":"TRENDS","events":[{"id":"user_logged_in","name":"user_logged_in","type":"events","order":0}]})

2. **Purchase funnel** — Conversion from app open → login → support purchase
   - [Create insight](https://us.posthog.com/project/2/insights/new#{"insight":"FUNNELS","events":[{"id":"Application Opened","name":"Application Opened","type":"events","order":0},{"id":"user_logged_in","name":"user_logged_in","type":"events","order":1},{"id":"support_purchase_completed","name":"support_purchase_completed","type":"events","order":2}]})

3. **Engagement metrics** — Trend of `post_upvoted`, `post_bookmarked`, `comment_upvoted`
   - [Create insight](https://us.posthog.com/project/2/insights/new#{"insight":"TRENDS","events":[{"id":"post_upvoted","name":"post_upvoted","type":"events","order":0},{"id":"post_bookmarked","name":"post_bookmarked","type":"events","order":1},{"id":"comment_upvoted","name":"comment_upvoted","type":"events","order":2}]})

4. **Search usage** — Track `search_performed` with result_count breakdown
   - [Create insight](https://us.posthog.com/project/2/insights/new#{"insight":"TRENDS","events":[{"id":"search_performed","name":"search_performed","type":"events","order":0}]})

5. **Churn signal** — Logout rate (`user_logged_out`) to monitor retention risk
   - [Create insight](https://us.posthog.com/project/2/insights/new#{"insight":"TRENDS","events":[{"id":"user_logged_out","name":"user_logged_out","type":"events","order":0}]})

- [Open PostHog Dashboard](https://us.posthog.com/project/2/dashboards)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-swift/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
