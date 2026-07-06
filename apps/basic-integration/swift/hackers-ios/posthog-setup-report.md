<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Hackers iOS app. PostHog is initialized in `HackersApp.swift` with lifecycle event autocapture enabled. Twelve events are instrumented across eight files spanning the Authentication, Feed, Comments, and Settings feature packages and the main app target. Users are identified on login and the session is reset on logout. The posthog-ios SDK (v3.64.1) has been added as a Swift Package Manager dependency to `Hackers.xcodeproj/project.pbxproj` and to each of the four feature Package.swift files that use it.

| Event | Description | File |
|---|---|---|
| `user_logged_in` | User successfully authenticated with their Hacker News credentials. | `Features/Authentication/Sources/Authentication/LoginViewModel.swift` |
| `user_logged_out` | User explicitly logged out of their Hacker News account. | `Features/Authentication/Sources/Authentication/LoginViewModel.swift` |
| `post_upvoted` | User upvoted a post in the feed. | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `post_bookmarked` | User bookmarked or removed a bookmark from a post. | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `feed_category_changed` | User switched the feed to a different post type category. | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `search_performed` | User performed a search and results were returned. | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `post_link_opened` | User tapped the link on a post to open the external article. | `Features/Feed/Sources/Feed/FeedView.swift` |
| `comments_viewed` | User opened the comments view for a post. | `Features/Comments/Sources/Comments/CommentsViewModel.swift` |
| `comment_upvoted` | User upvoted a comment in the comments thread. | `Features/Comments/Sources/Comments/CommentsViewModel.swift` |
| `purchase_completed` | User successfully completed a purchase of a support product or tip. | `Features/Settings/Sources/Settings/SupportViewModel.swift` |
| `onboarding_completed` | User finished or dismissed the onboarding flow. | `App/OnboardingCoordinator.swift` |
| `settings_changed` | User changed an app setting such as text size, thumbnails, or reader mode. | `Features/Settings/Sources/Settings/SettingsViewModel.swift` |

## Next steps

We've built a dashboard and five insights in PostHog to keep an eye on user behavior:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1805965)
- [Daily Active Users (wizard)](https://us.posthog.com/project/483112/insights/rAfMdT4g) — Unique users who logged in per day
- [Engagement Events (wizard)](https://us.posthog.com/project/483112/insights/RUUmLrlG) — Upvotes, bookmarks, and comment activity
- [Content Discovery (wizard)](https://us.posthog.com/project/483112/insights/HnuLsteS) — Searches, link opens, and feed category changes
- [Support Purchases (wizard)](https://us.posthog.com/project/483112/insights/tsB7xsSl) — Subscription and tip purchase completions by month
- [Onboarding & Churn (wizard)](https://us.posthog.com/project/483112/insights/gSL6ddJN) — Onboarding completions vs. logouts

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Confirm the returning-visitor path also calls `identify` — the current implementation only identifies on fresh login; returning sessions that skip the login flow (stored credentials, biometrics) will remain on anonymous distinct IDs until they explicitly log in again.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
