<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Hackers iOS app, a Hacker News client built with SwiftUI. The PostHog iOS SDK (v3.60.1) was added via Swift Package Manager. Initialization happens at app launch in `HackersApp.init()`. User identification is called on login and reset on logout. Twelve events are tracked across six files covering the core user journey: authentication, feed browsing, post interaction, search, bookmarks, and in-app purchases.

| Event | Description | File |
|-------|-------------|------|
| `user_logged_in` | Fired when a user successfully authenticates. Also calls `identify()` to associate the session with their HN username. | `Features/Authentication/Sources/Authentication/LoginViewModel.swift` |
| `user_logged_out` | Fired before resetting the PostHog identity on sign-out. | `Features/Authentication/Sources/Authentication/LoginViewModel.swift` |
| `login_failed` | Fired when login fails due to bad credentials or a network error. | `Features/Authentication/Sources/Authentication/LoginViewModel.swift` |
| `post_opened` | Fired when a user taps a post link to open the external article or HN item. | `Features/Feed/Sources/Feed/FeedView.swift` |
| `post_upvoted` | Fired when a user successfully upvotes a post from the feed. | `Features/Feed/Sources/Feed/FeedView.swift` |
| `feed_category_changed` | Fired when a user switches between feed categories (news, ask, show, jobs, etc.). | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `post_bookmarked` | Fired when a user toggles a bookmark on a post, capturing the new bookmark state. | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `search_performed` | Fired when a search query returns results, capturing the query and result count. | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `comments_viewed` | Fired when comments for a post are loaded, capturing post ID, title, and comment count. | `Features/Comments/Sources/Comments/CommentsViewModel.swift` |
| `comment_upvoted` | Fired when a user successfully upvotes a comment in the comments thread. | `Features/Comments/Sources/Comments/CommentsViewModel.swift` |
| `support_purchase_completed` | Fired when a purchase (tip or subscription) completes successfully. Critical conversion event. | `Features/Settings/Sources/Settings/SupportViewModel.swift` |
| `onboarding_completed` | Fired when a user dismisses the onboarding flow. | `App/OnboardingCoordinator.swift` |

## Next steps

The PostHog MCP API key used during this wizard session did not have `dashboard:write` or `insight:write` scopes, so the dashboard and insights could not be created automatically. To set up your dashboard manually, visit your [PostHog project](https://us.posthog.com/project/2/dashboard) and create a new dashboard called **"Analytics basics (wizard)"** with the following insights:

1. **User login trend** — Trends chart of `user_logged_in` over time
2. **Login → purchase funnel** — Funnel from `user_logged_in` → `support_purchase_completed`
3. **Onboarding completion rate** — Funnel from app open (Application Opened) → `onboarding_completed`
4. **Top content actions** — Trends chart of `post_upvoted`, `post_bookmarked`, and `comments_viewed`
5. **Purchase conversions** — Trends chart of `support_purchase_completed` broken down by `product_kind`

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Confirm the returning-visitor path also calls `identify` — the current integration only identifies on fresh login. If a user reopens the app while still authenticated (session cookie present), PostHog will not know their identity until they log in again. Consider calling `identify` on app launch when the session is already authenticated.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
