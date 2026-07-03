# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Hackers iOS app. The PostHog iOS SDK (v3.64.0) was added as a Swift Package Manager dependency to the main Xcode target and to five feature package modules. The SDK is initialised once in `HackersApp.init()` with lifecycle event autocapture enabled. Thirteen custom events covering authentication, feed navigation, post engagement, settings, in-app purchases, and onboarding were added across six view-model and view files. User identity is established via `PostHogSDK.shared.identify()` on every successful login and cleared with `PostHogSDK.shared.reset()` on logout.

| Event name | Description | File |
|---|---|---|
| `user_logged_in` | User successfully authenticated with their Hacker News credentials. | `Features/Authentication/Sources/Authentication/LoginViewModel.swift` |
| `user_logged_out` | User signed out of their Hacker News account. | `Features/Authentication/Sources/Authentication/LoginViewModel.swift` |
| `login_failed` | User attempted to log in but authentication failed. | `Features/Authentication/Sources/Authentication/LoginViewModel.swift` |
| `feed_category_changed` | User switched the feed to a different post category (e.g., Top, New, Ask). | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `post_searched` | User submitted a search query to find posts on Hacker News. | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `post_upvoted` | User upvoted a post from the feed or comments view. | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `post_bookmarked` | User toggled the bookmark state on a post. | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `comments_viewed` | User opened a post to view its comments, marking the top of the engagement funnel. | `Features/Comments/Sources/Comments/CommentsViewModel.swift` |
| `comment_upvoted` | User upvoted a comment inside a post's comment thread. | `Features/Comments/Sources/Comments/CommentsViewModel.swift` |
| `setting_changed` | User changed an app setting such as text size, thumbnails, or browser mode. | `Features/Settings/Sources/Settings/SettingsViewModel.swift` |
| `support_purchased` | User successfully completed an in-app purchase for a tip or subscription. | `Features/Settings/Sources/Settings/SupportViewModel.swift` |
| `support_purchase_failed` | User attempted an in-app purchase but it failed. | `Features/Settings/Sources/Settings/SupportViewModel.swift` |
| `onboarding_completed` | User dismissed the onboarding screen by tapping Continue. | `Features/Onboarding/Sources/Onboarding/Views/OnboardingView.swift` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1793585)
- [User Login Trends](https://us.posthog.com/project/483112/insights/V2SKS8Il)
- [Post Engagement Funnel](https://us.posthog.com/project/483112/insights/fIOw2RVi)
- [Content Engagement Trends](https://us.posthog.com/project/483112/insights/IZ9BtZu8)
- [Support Purchases](https://us.posthog.com/project/483112/insights/pGuRQS07)
- [Onboarding Completion](https://us.posthog.com/project/483112/insights/QCmH9vO8)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names (`POSTHOG_API_KEY`, `POSTHOG_HOST`) added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs. Currently `identify` is called on every successful `performLogin()`; verify sessions restored from saved credentials (e.g. keychain auto-login) also trigger an identify call.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
