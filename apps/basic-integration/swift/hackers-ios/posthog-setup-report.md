<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Hackers iOS app. The PostHog iOS SDK (v3.64.1) was added via Swift Package Manager to the main Xcode project and to each relevant local Swift Package. PostHog is initialized once in `HackersApp.init()` with lifecycle event capture enabled. Users are identified by their HN username on login and the session is reset on logout. Twelve business events are captured across authentication, feed browsing, content engagement, search, settings, and onboarding.

| Event | Description | File |
|---|---|---|
| `user_logged_in` | User successfully authenticated with their Hacker News credentials. | `Features/Authentication/Sources/Authentication/LoginViewModel.swift` |
| `login_failed` | User attempted to log in but authentication failed. | `Features/Authentication/Sources/Authentication/LoginViewModel.swift` |
| `user_logged_out` | User logged out of their Hacker News account. | `Features/Authentication/Sources/Authentication/LoginViewModel.swift` |
| `onboarding_completed` | User dismissed the onboarding screen by tapping Continue or the close button. | `App/OnboardingCoordinator.swift` |
| `feed_category_changed` | User switched to a different feed category such as Top, Ask, Show, or Jobs. | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `post_upvoted` | User upvoted a story in the feed. | `Features/Feed/Sources/Feed/FeedView.swift` |
| `post_bookmarked` | User saved or removed a bookmark on a story. | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `post_link_opened` | User tapped the external link on a story to open it. | `Features/Feed/Sources/Feed/FeedView.swift` |
| `comments_opened` | User opened the comments view for a story. | `Features/Comments/Sources/Comments/CommentsView.swift` |
| `comment_upvoted` | User upvoted a comment on a story. | `Features/Comments/Sources/Comments/CommentsViewModel.swift` |
| `search_performed` | User submitted a search query on Hacker News. | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `setting_changed` | User changed an app setting such as text size, thumbnails, or browser preference. | `Features/Settings/Sources/Settings/SettingsViewModel.swift` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1818313)
- [Daily active users (wizard)](https://us.posthog.com/project/483112/insights/U72x3r1L)
- [Login success vs failure (wizard)](https://us.posthog.com/project/483112/insights/LNOkxAMg)
- [Onboarding to login funnel (wizard)](https://us.posthog.com/project/483112/insights/2zUl1YQR)
- [Content engagement (wizard)](https://us.posthog.com/project/483112/insights/GmbASMPV)
- [Feed category popularity (wizard)](https://us.posthog.com/project/483112/insights/v024CSNq)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to `.env.example` and any onboarding docs so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs. Consider calling `identify` on app launch if a stored HN username exists in `UserDefaults`.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
