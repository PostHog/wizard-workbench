<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Hackers iOS app. The PostHog iOS SDK (v3.64.2) was added via Swift Package Manager, initialized at app launch in `HackersApp.swift`, and event tracking was wired into authentication, feed browsing, comments, and onboarding flows. User identification is called on login and reset on logout.

| Event name | Description | File |
|---|---|---|
| `user_logged_in` | User successfully authenticated with Hacker News credentials. | `Features/Authentication/Sources/Authentication/LoginViewModel.swift` |
| `user_logged_out` | User signed out from the app. | `Features/Authentication/Sources/Authentication/LoginViewModel.swift` |
| `login_failed` | User attempted to log in but authentication failed. | `Features/Authentication/Sources/Authentication/LoginViewModel.swift` |
| `feed_category_changed` | User switched to a different post category (news, ask, show, etc.). | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `post_searched` | User performed a search query on Hacker News. | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `post_upvoted` | User upvoted a post in the feed. | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `post_bookmarked` | User added or removed a post bookmark. | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `comments_viewed` | User opened a post's comments thread. | `Features/Comments/Sources/Comments/CommentsViewModel.swift` |
| `comment_upvoted` | User upvoted a comment. | `Features/Comments/Sources/Comments/CommentsViewModel.swift` |
| `onboarding_completed` | User finished the onboarding flow. | `Features/Onboarding/Sources/Onboarding/OnboardingService.swift` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard**: [Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1824660)
- [Login funnel](https://us.posthog.com/project/483112/insights/Ox7cqLv9) — Conversion from app open to login
- [Daily logins trend](https://us.posthog.com/project/483112/insights/cbHaP267) — Login and logout volume over time
- [Content engagement trends](https://us.posthog.com/project/483112/insights/6UAXX0Zt) — Upvotes, bookmarks, and comments views
- [Feed category popularity](https://us.posthog.com/project/483112/insights/vL9O0Vfw) — Which feed categories users switch to most
- [Onboarding completion rate](https://us.posthog.com/project/483112/insights/P74GBpvy) — Weekly onboarding completions

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
