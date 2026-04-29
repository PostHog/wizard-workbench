<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Hackers iOS app. The PostHog Swift SDK (posthog-ios ≥ 3.56.0) was added via Swift Package Manager to the main Xcode project and to all relevant local feature packages. PostHog is initialized in `HackersApp.swift` with lifecycle event capture enabled, reading configuration from the Xcode scheme's Run environment variables via a `PostHogEnv` enum. User identification is called on every successful login using `PostHogSDK.shared.identify()`, and `PostHogSDK.shared.reset()` is called on logout to clear the session.

Twelve events were instrumented across six files covering the full user journey: authentication, feed browsing, content engagement, settings changes, in-app purchases, and onboarding.

| Event | Description | File |
|---|---|---|
| `user_logged_in` | User successfully authenticates; also calls `identify()` | `Features/Authentication/Sources/Authentication/LoginViewModel.swift` |
| `login_failed` | Login attempt fails (bad credentials or network error) | `Features/Authentication/Sources/Authentication/LoginViewModel.swift` |
| `user_logged_out` | User explicitly logs out; PostHog session is reset | `Features/Authentication/Sources/Authentication/LoginViewModel.swift` |
| `feed_category_changed` | User switches between feed categories (Top, Ask, Show, Jobs, etc.) | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `post_searched` | User submits a non-empty search query | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `post_upvoted` | User upvotes a post from the comments view | `Features/Comments/Sources/Comments/CommentsViewModel.swift` |
| `comment_upvoted` | User upvotes a comment | `Features/Comments/Sources/Comments/CommentsViewModel.swift` |
| `post_bookmarked` | User bookmarks or unbookmarks a post | `Features/Comments/Sources/Comments/CommentsViewModel.swift` |
| `purchase_completed` | In-app purchase (tip or subscription) completes successfully | `Features/Settings/Sources/Settings/SupportViewModel.swift` |
| `purchase_failed` | In-app purchase fails with an error | `Features/Settings/Sources/Settings/SupportViewModel.swift` |
| `setting_changed` | User changes an app setting (text size, thumbnails, compact mode, etc.) | `Features/Settings/Sources/Settings/SettingsViewModel.swift` |
| `onboarding_completed` | User completes the onboarding flow | `App/OnboardingCoordinator.swift` |

## Next steps

We've prepared recommended insights and a dashboard for you to keep an eye on user behavior. Create the **"Analytics basics"** dashboard in PostHog and add the following insights:

1. **Login conversion funnel** — Funnel: `user_logged_in` → `feed_category_changed` → `post_upvoted`
   [Create in PostHog →](https://us.posthog.com/project/2/insights/new#{"insight":"FUNNELS","events":[{"id":"user_logged_in"},{"id":"feed_category_changed"},{"id":"post_upvoted"}]})

2. **Daily active users** — Trend: unique users who fired any event per day
   [Create in PostHog →](https://us.posthog.com/project/2/insights/new)

3. **Purchase conversion** — Funnel: `user_logged_in` → `purchase_completed`
   [Create in PostHog →](https://us.posthog.com/project/2/insights/new#{"insight":"FUNNELS","events":[{"id":"user_logged_in"},{"id":"purchase_completed"}]})

4. **Purchase failure rate** — Trend: `purchase_failed` vs `purchase_completed` over time
   [Create in PostHog →](https://us.posthog.com/project/2/insights/new)

5. **New user activation** — Funnel: `onboarding_completed` → `user_logged_in` → `post_upvoted`
   [Create in PostHog →](https://us.posthog.com/project/2/insights/new#{"insight":"FUNNELS","events":[{"id":"onboarding_completed"},{"id":"user_logged_in"},{"id":"post_upvoted"}]})

[Open PostHog Dashboards →](https://us.posthog.com/project/2/dashboards)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-swift/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
