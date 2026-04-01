<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Hackers iOS app. PostHog is now initialised at app launch via `HackersApp.init()` with a `PostHogEnv` enum that reads the project token and host from Xcode scheme environment variables (set in the `Hackers.xcscheme`). Lifecycle events (`Application Opened`, `Application Backgrounded`, etc.) are captured automatically. Ten custom events have been instrumented across the app, login layer, feed, and settings — covering the full user journey from first launch through to support purchases.

| Event | Description | File |
|---|---|---|
| `user_logged_in` | User successfully authenticated with HN credentials | `App/ContentView.swift` |
| `user_logged_out` | User logged out of their HN account | `App/ContentView.swift` |
| `onboarding_completed` | User dismissed the onboarding flow | `App/ContentView.swift` |
| `post_viewed` | User opened a post to view comments | `App/NavigationStore.swift` |
| `feed_category_changed` | User switched between Top/New/Ask/Show/Jobs/Bookmarks | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `post_voted` | User upvoted a post | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `post_bookmarked` | User bookmarked or unbookmarked a post | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `search_performed` | User performed a search query | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `support_purchase_completed` | User completed a support purchase (subscription or tip) | `Features/Settings/Sources/Settings/SupportViewModel.swift` |
| `support_purchase_restored` | User successfully restored support purchases | `Features/Settings/Sources/Settings/SupportViewModel.swift` |

User identity is linked on login via `PostHogSDK.shared.identify(username)` and reset on logout via `PostHogSDK.shared.reset()`.

## Next steps

Create an **Analytics basics** dashboard in PostHog with the following recommended insights:

- [New dashboard](https://us.i.posthog.com/project/238460/dashboards) — create "Analytics basics"

Suggested insights to add to the dashboard:

- **Login funnel** — Funnel from `Application Opened` → `user_logged_in` to measure authentication conversion
  [Create insight](https://us.i.posthog.com/project/238460/insights/new)

- **Daily active users** — Unique users who triggered `post_viewed` over time, showing reading engagement
  [Create insight](https://us.i.posthog.com/project/238460/insights/new)

- **Top feed categories** — Breakdown of `feed_category_changed` by `to_category` to see which sections are most popular
  [Create insight](https://us.i.posthog.com/project/238460/insights/new)

- **Content engagement** — Trend of `post_voted` and `post_bookmarked` over time to track engagement depth
  [Create insight](https://us.i.posthog.com/project/238460/insights/new)

- **Support revenue funnel** — Funnel from `post_viewed` → `support_purchase_completed` to measure monetisation conversion
  [Create insight](https://us.i.posthog.com/project/238460/insights/new)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-swift/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
