<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Hackers iOS app. PostHog was added as a Swift Package Manager dependency (`posthog-ios` 3.59.1) to the main Xcode project and all affected feature modules. The SDK is initialized in `HackersApp.init()` using environment variables set in the Xcode scheme, with lifecycle event capture enabled. User identification (`PostHogSDK.shared.identify`) fires on successful login and `PostHogSDK.shared.reset()` fires on logout to properly separate anonymous and authenticated sessions. Fourteen events are captured across six files, covering the full user journey: onboarding, authentication, feed engagement, content discovery, and in-app purchases.

| Event | Description | File |
|---|---|---|
| `onboarding_completed` | User dismisses the onboarding screen after viewing it for the first time | `App/OnboardingCoordinator.swift` |
| `login_succeeded` | User successfully authenticates with their Hacker News credentials | `Features/Authentication/Sources/Authentication/LoginViewModel.swift` |
| `login_failed` | User's login attempt fails, e.g. bad credentials | `Features/Authentication/Sources/Authentication/LoginViewModel.swift` |
| `logged_out` | User logs out of their Hacker News account | `Features/Authentication/Sources/Authentication/LoginViewModel.swift` |
| `feed_category_changed` | User switches between feed categories (News, Ask, Show, Jobs, etc.) | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `post_upvoted` | User upvotes a post from the feed | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `post_bookmarked` | User adds or removes a bookmark on a post; includes `is_bookmarked` property | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `post_link_opened` | User taps the article link on a post, opening the external URL | `Features/Feed/Sources/Feed/FeedView.swift` |
| `search_performed` | User submits a non-empty search query in the feed search bar | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `post_shared` | User shares a post via the context menu share action | `Features/Feed/Sources/Feed/FeedView.swift` |
| `comment_upvoted` | User upvotes a comment in the comments view | `Features/Comments/Sources/Comments/CommentsViewModel.swift` |
| `support_purchase_initiated` | User taps the buy button for a subscription or tip product | `Features/Settings/Sources/Settings/SupportViewModel.swift` |
| `support_purchase_completed` | User's in-app purchase for a subscription or tip is confirmed successful | `Features/Settings/Sources/Settings/SupportViewModel.swift` |
| `settings_cache_cleared` | User clears the app cache from the Settings screen | `Features/Settings/Sources/Settings/SettingsViewModel.swift` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented. Create an "Analytics basics" dashboard in PostHog and add these insights:

1. **User acquisition funnel** — Funnel: `onboarding_completed` → `login_succeeded` to measure how many users who see onboarding complete their first login.
2. **Revenue funnel** — Funnel: `support_purchase_initiated` → `support_purchase_completed` to track subscription and tip conversion rates.
3. **Content engagement** — Trends: `post_upvoted`, `post_bookmarked`, `post_link_opened`, `post_shared` on the same chart to monitor daily reading and interaction activity.
4. **Churn signals** — Trends: `login_failed` and `logged_out` side-by-side to surface authentication friction and session endings.
5. **Feed behaviour** — Trends: `feed_category_changed` and `search_performed` to understand how users discover content.

- [PostHog Dashboards](/dashboard)
- [New Dashboard](/dashboard#new)
- [Insights Explorer](/insights)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-swift/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
