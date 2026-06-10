<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Hackers iOS app. PostHog SDK 3.59.3 was added as a Swift Package Manager dependency to the main Xcode target and to the four feature modules that instrument events (Authentication, Feed, Comments, Settings). The SDK is initialized in `HackersApp.init()` with application lifecycle tracking enabled. Ten events covering the key user flows — authentication, content discovery, engagement, and preferences — were instrumented across five files.

| Event | Description | File |
|---|---|---|
| `user_logged_in` | User successfully authenticated with Hacker News credentials | `Features/Authentication/Sources/Authentication/LoginViewModel.swift` |
| `user_logged_out` | User signed out of their Hacker News account | `Features/Authentication/Sources/Authentication/LoginViewModel.swift` |
| `onboarding_completed` | User dismissed the onboarding/what's new screen | `App/OnboardingCoordinator.swift` |
| `feed_category_changed` | User switched between feed categories (News, Ask, Show, Jobs, etc.) | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `post_bookmarked` | User toggled bookmark state on a post | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `search_performed` | User performed a search query on Hacker News | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `post_link_opened` | User tapped a post's external link to open the original article | `Features/Feed/Sources/Feed/FeedView.swift` |
| `post_opened` | User opened a post to view its comments | `Features/Comments/Sources/Comments/CommentsViewModel.swift` |
| `post_upvoted` | User upvoted a post while viewing its comments | `Features/Comments/Sources/Comments/CommentsViewModel.swift` |
| `settings_changed` | User changed a setting in the app preferences | `Features/Settings/Sources/Settings/SettingsViewModel.swift` |

Users are identified on login via `PostHogSDK.shared.identify()` with their HN username, and `PostHogSDK.shared.reset()` is called on logout to clear the session.

## Next steps

The PostHog dashboard creation requires `dashboard:write` and `insight:write` API scopes that were not available in this session. To create the "Analytics basics (wizard)" dashboard manually, navigate to your PostHog project and create insights for:

1. **Daily active users** — Trends chart on `user_logged_in` unique users over time
2. **Login → onboarding funnel** — Funnel from `user_logged_in` → `onboarding_completed`
3. **Top feed categories** — Breakdown of `feed_category_changed` by `category` property
4. **Content engagement** — Trends comparing `post_opened`, `post_upvoted`, and `post_bookmarked`
5. **Search adoption** — Trends on `search_performed` unique users over time

Visit your [PostHog project](https://us.posthog.com/project/2) to create and explore these insights.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-swift/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
