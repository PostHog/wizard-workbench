<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Hackers iOS app. The posthog-ios SDK (v3.58.3+) is now wired into the project via Swift Package Manager. PostHog is initialized in `HackersApp.swift` with lifecycle event capture enabled, and reads its credentials from the Xcode scheme's Run environment variables (`POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST`) — never hardcoded. Twelve business events are captured across login, feed navigation, content engagement, in-app purchases, and onboarding, with user identification on login and `PostHogSDK.shared.reset()` on logout.

| Event | Description | File |
|---|---|---|
| `user_logged_in` | User successfully authenticated | `Features/Authentication/Sources/Authentication/LoginViewModel.swift` |
| `login_failed` | Authentication attempt failed | `Features/Authentication/Sources/Authentication/LoginViewModel.swift` |
| `user_logged_out` | User explicitly logged out | `Features/Authentication/Sources/Authentication/LoginViewModel.swift` |
| `feed_category_changed` | User switched the feed category (News, Ask, Show, Jobs, etc.) | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `post_bookmarked` | User saved a post to bookmarks | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `post_unbookmarked` | User removed a post from bookmarks | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `search_performed` | User completed a search and received results | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `post_upvoted` | User upvoted a post | `Features/Comments/Sources/Comments/CommentsViewModel.swift` |
| `comment_upvoted` | User upvoted a comment | `Features/Comments/Sources/Comments/CommentsViewModel.swift` |
| `purchase_completed` | User successfully purchased a subscription or tip | `Features/Settings/Sources/Settings/SupportViewModel.swift` |
| `purchase_failed` | A purchase attempt failed | `Features/Settings/Sources/Settings/SupportViewModel.swift` |
| `onboarding_completed` | User dismissed the onboarding screen | `App/OnboardingCoordinator.swift` |

## Next steps

We've prepared an "Analytics basics" dashboard for you. Create it in PostHog with these five insights:

1. **[User logins over time](/insights/new#{"kind":"InsightVizNode","source":{"kind":"TrendsQuery","series":[{"kind":"EventsNode","event":"user_logged_in","name":"User Logged In","math":"total"}],"dateRange":{"date_from":"-30d"}}})** — Trend of `user_logged_in` over time. Tracks daily active user growth and login volume.

2. **Content engagement** — Multi-series trends of `post_upvoted`, `comment_upvoted`, and `post_bookmarked`. Shows how engaged users are with content after signing in.

3. **Login → Bookmark funnel** — Two-step funnel: `user_logged_in` → `post_bookmarked`. Reveals what fraction of logged-in users go on to save content — a strong engagement signal.

4. **Feed category distribution** — Trend of `feed_category_changed` broken down by the `category` property. Shows which feed types (News, Ask, Show, Jobs…) are most popular.

5. **Purchase conversion** — Multi-series trends of `purchase_completed` and `purchase_failed`. Tracks monetization health and surfaces payment friction.

To create the dashboard:
1. Go to [Dashboards](/dashboards) → **New dashboard** → name it "Analytics basics"
2. Add each insight above using **Add insight** on the dashboard

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-swift/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
