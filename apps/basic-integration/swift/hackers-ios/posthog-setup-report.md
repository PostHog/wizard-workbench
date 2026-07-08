<wizard-report>
# PostHog post-wizard report

The wizard has completed a full PostHog integration for the Hackers iOS app. The PostHog iOS SDK (v3.64.1) was added via Swift Package Manager to the main Xcode project and to each local Swift package that captures events. PostHog is initialized once in `AppDelegate.didFinishLaunchingWithOptions`, with the project token shipped in the binary (safe for iOS) and an optional Xcode-scheme environment variable override for local development. Ten events covering authentication, engagement, search, and in-app purchases are now captured, along with `identify` on login and `reset` on logout.

| Event | Description | File |
|---|---|---|
| `user_logged_in` | Fired when a user successfully authenticates with their HN credentials. | `Features/Authentication/Sources/Authentication/LoginViewModel.swift` |
| `user_logged_out` | Fired when a user taps logout and their session is cleared. | `Features/Authentication/Sources/Authentication/LoginViewModel.swift` |
| `post_upvoted` | Fired when a user upvotes a post. | `Shared/Sources/Shared/ViewModels/VotingViewModel.swift` |
| `comment_upvoted` | Fired when a user upvotes a comment. | `Shared/Sources/Shared/ViewModels/VotingViewModel.swift` |
| `post_bookmarked` | Fired when a user toggles a bookmark on a post (add or remove). | `Shared/Sources/Shared/Services/BookmarksController.swift` |
| `feed_category_changed` | Fired when a user switches to a different feed category (e.g., Top, New, Ask). | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `post_searched` | Fired when a user performs a search in the feed. | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `purchase_completed` | Fired when a user successfully completes a tip or subscription purchase. | `Features/Settings/Sources/Settings/SupportViewModel.swift` |
| `purchase_restored` | Fired when a user successfully restores prior purchases. | `Features/Settings/Sources/Settings/SupportViewModel.swift` |
| `cache_cleared` | Fired when a user manually clears the app cache from settings. | `Features/Settings/Sources/Settings/SettingsViewModel.swift` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1818372)
- [Daily logins](https://us.posthog.com/project/483112/insights/vdpu1fkR)
- [Login → logout churn funnel](https://us.posthog.com/project/483112/insights/49Leiy2X)
- [Engagement: votes & bookmarks](https://us.posthog.com/project/483112/insights/Luyfj7TZ)
- [Feed category breakdown](https://us.posthog.com/project/483112/insights/87VMKgUx)
- [In-app purchases](https://us.posthog.com/project/483112/insights/Rq4styJh)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to `.env.example` and any bootstrap scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
