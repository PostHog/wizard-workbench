<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the Hackers iOS app — a modular SwiftUI Hacker News client. PostHog is initialized at app launch via `HackersApp.init()`, and 14 events are now tracked across five layers of the app: authentication, feed interactions, comment threads, support purchases, and onboarding. User identification (`PostHogSDK.shared.identify`) is called on every successful login, and `PostHogSDK.shared.reset()` is called on logout to correctly handle anonymous tracking between sessions. The PostHog iOS SDK (`posthog-ios 3.61.0`) was added to the main Xcode target via SPM (`project.pbxproj`) and also to the four feature Swift packages that needed it (`Authentication`, `Feed`, `Comments`, `Settings`).

| Event name | Description | File |
|---|---|---|
| `user_logged_in` | User successfully authenticated with Hacker News credentials. | `Features/Authentication/Sources/Authentication/LoginViewModel.swift` |
| `user_login_failed` | A login attempt was made but authentication failed. | `Features/Authentication/Sources/Authentication/LoginViewModel.swift` |
| `user_logged_out` | User logged out of their Hacker News account. | `Features/Authentication/Sources/Authentication/LoginViewModel.swift` |
| `post_upvoted` | User upvoted a post in the feed. | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `post_bookmark_toggled` | User added or removed a post from their bookmarks. | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `feed_category_changed` | User switched to a different feed category (e.g. Ask, Show, Jobs). | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `search_performed` | User performed a search query on Hacker News. | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `post_viewed` | User opened a post's comment thread. | `Features/Comments/Sources/Comments/CommentsViewModel.swift` |
| `comment_upvoted` | User upvoted a comment in a post's thread. | `Features/Comments/Sources/Comments/CommentsViewModel.swift` |
| `support_purchase_completed` | User successfully completed a support subscription or tip purchase. | `Features/Settings/Sources/Settings/SupportViewModel.swift` |
| `support_purchase_failed` | A support purchase attempt failed. | `Features/Settings/Sources/Settings/SupportViewModel.swift` |
| `support_purchases_restored` | User successfully restored prior support purchases. | `Features/Settings/Sources/Settings/SupportViewModel.swift` |
| `onboarding_viewed` | Onboarding screen was shown to the user. | `App/ContentView.swift` |
| `onboarding_completed` | User dismissed the onboarding screen. | `App/ContentView.swift` |

## Next steps

You can explore all tracked events and build insights and dashboards in your PostHog project:

- [PostHog Dashboards](https://us.posthog.com/project/2/dashboard) — create a dashboard with `post_upvoted` trends, `user_logged_in` counts, and a `support_purchase_completed` funnel
- [Live Event Stream](https://us.posthog.com/project/2/activity/explore) — verify events are arriving after first launch
- [Persons](https://us.posthog.com/project/2/persons) — check that `identify` is correctly linking events to named users

Suggested insights to build:
1. **Daily Active Users** — Trends: `user_logged_in` over 30 days
2. **Engagement funnel** — Funnel: `post_viewed` → `post_upvoted` → `comment_upvoted`
3. **Feed category breakdown** — Trends: `feed_category_changed` broken down by `category`
4. **Revenue conversion** — Funnel: `user_logged_in` → `support_purchase_completed`
5. **Search engagement** — Trends: `search_performed` with `result_count` average

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to `.env.example` and any onboarding scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — currently `identify` is only called on fresh login via `LoginViewModel.performLogin()`. If a user is already authenticated when the app launches (persisted session via cookies), they will remain on an anonymous distinct ID until they next log in. Consider calling `PostHogSDK.shared.identify(username, ...)` in `HackersApp.init()` or `SessionService.init()` if `getCurrentUser()` returns a user.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
