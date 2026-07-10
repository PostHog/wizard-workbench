<wizard-report>
# PostHog post-wizard report

The wizard has completed a full PostHog integration for the Hackers iOS app. The PostHog iOS SDK (v3.64.5) was added via Swift Package Manager to the main Xcode project and to each feature package that requires event capture. PostHog is initialized in `HackersApp.swift` with `captureApplicationLifecycleEvents` enabled. Users are identified by username after login and the PostHog session is reset on logout. Fifteen business events are captured across login/auth, feed engagement, comments, in-app purchases, onboarding, and settings.

| Event name | Description | File |
|---|---|---|
| `user_logged_in` | User successfully authenticates with their HN credentials. | `Features/Authentication/Sources/Authentication/LoginViewModel.swift` |
| `login_failed` | User attempted to log in but authentication failed. | `Features/Authentication/Sources/Authentication/LoginViewModel.swift` |
| `user_logged_out` | User explicitly logs out of their HN account. | `Features/Authentication/Sources/Authentication/LoginViewModel.swift` |
| `feed_category_changed` | User switches the feed to a different post category (e.g., Top, New, Jobs). | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `post_upvoted` | User upvotes a post from the feed. | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `post_bookmarked` | User bookmarks or un-bookmarks a post from the feed. | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `search_performed` | User submits a search query in the feed. | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `comments_viewed` | User opens the comments screen for a post (top of engagement funnel). | `Features/Comments/Sources/Comments/CommentsViewModel.swift` |
| `comment_upvoted` | User upvotes a comment in the comments thread. | `Features/Comments/Sources/Comments/CommentsViewModel.swift` |
| `post_bookmarked_from_comments` | User bookmarks or un-bookmarks a post while reading its comments. | `Features/Comments/Sources/Comments/CommentsViewModel.swift` |
| `onboarding_completed` | User dismisses the onboarding screen for the first time. | `App/OnboardingCoordinator.swift` |
| `in_app_purchase_started` | User initiates an in-app purchase (subscription or tip). | `Features/Settings/Sources/Settings/SupportViewModel.swift` |
| `in_app_purchase_completed` | User successfully completes an in-app purchase. | `Features/Settings/Sources/Settings/SupportViewModel.swift` |
| `restore_purchases_completed` | User successfully restores previous in-app purchases. | `Features/Settings/Sources/Settings/SupportViewModel.swift` |
| `cache_cleared` | User clears the app cache from the Settings screen. | `Features/Settings/Sources/Settings/SettingsViewModel.swift` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard** — [Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1829397)
- **Login & Auth events** — [Tl96ou6a](https://us.posthog.com/project/483112/insights/Tl96ou6a): daily line chart of logins, login failures, and logouts
- **In-app purchase funnel** — [zTWyHaO4](https://us.posthog.com/project/483112/insights/zTWyHaO4): conversion from `in_app_purchase_started` → `in_app_purchase_completed`
- **Feed engagement** — [nHVI8hjS](https://us.posthog.com/project/483112/insights/nHVI8hjS): bar chart of upvotes, bookmarks, searches, and category changes per day
- **Comments engagement funnel** — [XtxR9tNF](https://us.posthog.com/project/483112/insights/XtxR9tNF): funnel from `comments_viewed` → `comment_upvoted`
- **Onboarding completions** — [UwLli2s1](https://us.posthog.com/project/483112/insights/UwLli2s1): daily count of users completing onboarding

Dashboard subscription and alerts were skipped because the consent prompt was unavailable in this environment. To set them up manually, visit the dashboard and use the "Subscribe" and "Alerts" options in the PostHog UI.

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to `.env.example` (or any monorepo bootstrap scripts) so collaborators know what values to set.
- [ ] Confirm the returning-visitor path also calls `identify` — `SessionService.authenticate()` identifies on login, but verify that re-opens of the app with an existing session also trigger `identify` so returning sessions aren't left on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
