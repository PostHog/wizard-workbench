<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Hackers iOS app. The PostHog iOS SDK (`posthog-ios` v3.61.1) was added via Swift Package Manager to the main Xcode project target and to the Authentication, Feed, and Comments feature packages. PostHog is initialized once in `HackersApp.init()` with lifecycle event capture enabled. User identification is performed on login via `PostHogSDK.shared.identify()`, and `PostHogSDK.shared.reset()` is called on logout to clear the anonymous identity. Twelve events are instrumented across six files covering login, feed interaction, content discovery, voting, and onboarding.

| Event Name | Description | File |
|---|---|---|
| `user_logged_in` | Fired when a user successfully authenticates with Hacker News credentials. | `Features/Authentication/Sources/Authentication/LoginViewModel.swift` |
| `login_failed` | Fired when a login attempt fails due to bad credentials or network error. | `Features/Authentication/Sources/Authentication/LoginViewModel.swift` |
| `user_logged_out` | Fired when a user taps sign out from the login screen. | `Features/Authentication/Sources/Authentication/LoginViewModel.swift` |
| `feed_category_changed` | Fired when the user switches between feed categories such as Top, New, Ask, or Show. | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `post_bookmarked` | Fired when the user saves or removes a bookmark on a post. | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `search_performed` | Fired when a search query completes and results are returned to the user. | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `post_link_opened` | Fired when the user opens the external article link associated with a post. | `Features/Feed/Sources/Feed/FeedView.swift` |
| `settings_opened` | Fired when the user taps the settings gear icon in the feed toolbar. | `Features/Feed/Sources/Feed/FeedView.swift` |
| `post_upvoted` | Fired when the user upvotes a post in the feed. | `Features/Feed/Sources/Feed/FeedView.swift` |
| `comments_viewed` | Fired when the comments view loads for a post, marking the start of reading a discussion. | `Features/Comments/Sources/Comments/CommentsView.swift` |
| `comment_upvoted` | Fired when the user upvotes a comment in the discussion thread. | `Features/Comments/Sources/Comments/CommentsViewModel.swift` |
| `onboarding_shown` | Fired when the onboarding flow is presented to a new or returning user. | `App/ContentView.swift` |

## Next steps

We were unable to create the PostHog dashboard automatically because the API key used does not have `dashboard:write` or `insight:write` scopes. To create the recommended dashboard, visit your PostHog project and build the following insights manually:

1. **Login Funnel** — Funnel from `user_logged_in` vs `login_failed` to understand authentication conversion.
2. **Daily Active Users** — Trend of unique users triggering `user_logged_in` or `comments_viewed` per day.
3. **Most Viewed Content** — Trend of `comments_viewed` events to understand reading engagement.
4. **Top Feed Categories** — Breakdown of `feed_category_changed` by the `category` property to see which feed types are most popular.
5. **Post Engagement** — Combined trend of `post_upvoted` and `post_bookmarked` to track content appreciation.

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Confirm the returning-visitor path also calls `identify` — the current implementation identifies on fresh login only; returning sessions that skip the login screen will use anonymous distinct IDs until they log in again.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-swift/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
