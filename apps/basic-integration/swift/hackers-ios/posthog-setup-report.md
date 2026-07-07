<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Hackers iOS app. PostHog was added as a Swift Package Manager dependency (version 3.64.1) to the main Xcode project and to each feature package that needed event tracking (Feed, Comments, Authentication, Settings, Onboarding). PostHog is initialized in `HackersApp.init()` with lifecycle event capture enabled. User identification is performed on login via `PostHogSDK.shared.identify()`, and the session is reset on logout with `PostHogSDK.shared.reset()`. Fourteen events were instrumented across six files covering authentication, content engagement, in-app purchases, and onboarding.

| Event Name | Description | File |
|---|---|---|
| `user_logged_in` | User successfully authenticated with Hacker News credentials. | `Features/Authentication/Sources/Authentication/LoginViewModel.swift` |
| `user_logged_out` | User logged out of their Hacker News account. | `Features/Authentication/Sources/Authentication/LoginViewModel.swift` |
| `post_upvoted` | User upvoted a post in the comments view. | `Features/Comments/Sources/Comments/CommentsViewModel.swift` |
| `comment_upvoted` | User upvoted a comment in the comments thread. | `Features/Comments/Sources/Comments/CommentsViewModel.swift` |
| `post_bookmarked` | User bookmarked a post to save it for later. | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `post_unbookmarked` | User removed a post from their bookmarks. | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `feed_category_changed` | User switched to a different feed category. | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `search_performed` | User submitted a search query. | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `post_comments_viewed` | User opened the comments view for a post. | `Features/Comments/Sources/Comments/CommentsViewModel.swift` |
| `subscription_purchased` | User completed a supporter subscription purchase. | `Features/Settings/Sources/Settings/SupportViewModel.swift` |
| `tip_purchased` | User completed a one-time tip purchase. | `Features/Settings/Sources/Settings/SupportViewModel.swift` |
| `purchases_restored` | User successfully restored previous in-app purchases. | `Features/Settings/Sources/Settings/SupportViewModel.swift` |
| `onboarding_completed` | User dismissed the onboarding screen. | `Features/Onboarding/Sources/Onboarding/Views/OnboardingView.swift` |
| `cache_cleared` | User manually cleared the app cache from Settings. | `Features/Settings/Sources/Settings/SettingsViewModel.swift` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) Dashboard](https://us.posthog.com/project/483112/dashboard/1813138)
- [User Logins (wizard)](https://us.posthog.com/project/483112/insights/2BrCAwQN) — Daily login trend
- [Content Engagement Funnel (wizard)](https://us.posthog.com/project/483112/insights/Pf6jT93U) — Conversion from comments viewed → post upvoted
- [Revenue Events (wizard)](https://us.posthog.com/project/483112/insights/E9Xlpwdj) — Subscription and tip purchases
- [Post Bookmarks (wizard)](https://us.posthog.com/project/483112/insights/cGBBYkuU) — Bookmark saves and removals
- [Onboarding Completion (wizard)](https://us.posthog.com/project/483112/insights/cxqU9isK) — Onboarding completions vs logouts

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to `.env.example` (and any bootstrap scripts) so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
