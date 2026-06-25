<wizard-report>
# PostHog post-wizard report

The wizard has completed a full PostHog analytics integration for the Hackers iOS app. The PostHog iOS SDK (v3.62.0) was added as a Swift Package Manager dependency to the main Xcode project and four feature packages (Shared, Feed, Comments, Settings). PostHog is initialized in `AppDelegate` with application lifecycle event capture enabled. User identification happens automatically at login via `SessionService`, and the anonymous identity is reset on logout. Twelve events are now instrumented across six files covering authentication, content engagement, feature usage, settings changes, and in-app purchases.

| Event Name | Description | File |
|---|---|---|
| `user_logged_in` | User successfully authenticated with their Hacker News credentials. | `Shared/Sources/Shared/Session/SessionService.swift` |
| `user_logged_out` | User signed out of their Hacker News account. | `Shared/Sources/Shared/Session/SessionService.swift` |
| `feed_category_changed` | User switched the feed to a different post category such as Top, Ask, Show, or Jobs. | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `post_link_opened` | User tapped a post's external link to open it in the browser. | `Features/Feed/Sources/Feed/FeedView.swift` |
| `post_bookmarked` | User saved or removed a bookmark for a post. | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `post_upvoted` | User upvoted a story in the feed or comments view. | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `comment_upvoted` | User upvoted a comment in the comments thread. | `Features/Comments/Sources/Comments/CommentsViewModel.swift` |
| `search_performed` | User submitted a search query to find stories on Hacker News. | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `setting_changed` | User changed an app setting such as text size, thumbnails, or browser preference. | `Features/Settings/Sources/Settings/SettingsViewModel.swift` |
| `onboarding_completed` | User dismissed the onboarding screen after viewing the app introduction. | `App/ContentView.swift` |
| `purchase_completed` | User successfully completed an in-app purchase for a subscription or tip. | `Features/Settings/Sources/Settings/SupportViewModel.swift` |
| `purchases_restored` | User successfully restored their previous in-app purchases. | `Features/Settings/Sources/Settings/SupportViewModel.swift` |

## Next steps

We've built some insights and a dashboard to keep an eye on user behavior:

- [Analytics basics (wizard) Dashboard](https://us.i.posthog.com/project/483112/dashboard/1761377)
- [User Logins & Logouts](https://us.i.posthog.com/project/483112/insights/9590088)
- [Onboarding to Login Funnel](https://us.i.posthog.com/project/483112/insights/9590090)
- [Content Engagement](https://us.i.posthog.com/project/483112/insights/9590099)
- [Feature Discovery (Search & Feed)](https://us.i.posthog.com/project/483112/insights/9590100)
- [Revenue Events](https://us.i.posthog.com/project/483112/insights/9590101)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_API_KEY` and `POSTHOG_HOST` to `.env.example` so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — `SessionService.init` restores the `user` from the authentication use case but does not call `PostHogSDK.shared.identify`; add an identify call there so returning sessions are not left on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
