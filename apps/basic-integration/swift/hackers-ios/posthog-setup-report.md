# PostHog post-wizard report

The wizard completed a SwiftUI PostHog integration for Hackers by adding the PostHog iOS SDK through Swift Package Manager and the Xcode project, wiring token and host values through environment-backed build settings and Info.plist entries, initializing PostHog once during app launch, identifying authenticated users on session restoration and login, resetting analytics state on logout, and capturing core product events across authentication, content engagement, bookmarks, onboarding completion, settings access, and support purchases. The integration also enabled PostHog lifecycle capture and iOS error autocapture in the app configuration.

| Event name | Description | File |
| --- | --- | --- |
| `login_succeeded` | Captures when a user successfully signs into the app. | `Shared/Sources/Shared/Session/SessionService.swift` |
| `post_opened` | Captures when a user opens a Hacker News post from the feed. | `App/NavigationStore.swift` |
| `comment_thread_viewed` | Captures when a post's comments thread finishes loading. | `Features/Comments/Sources/Comments/CommentsViewModel.swift` |
| `bookmark_toggled` | Captures when a user adds or removes a bookmark for a post. | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `support_purchase_completed` | Captures when a support subscription or tip purchase succeeds. | `Features/Settings/Sources/Settings/SupportViewModel.swift` |
| `onboarding_completed` | Captures when the user completes the onboarding flow. | `App/OnboardingCoordinator.swift` |
| `settings_opened` | Captures when the settings sheet is opened. | `App/NavigationStore.swift` |
| `feed_category_selected` | Captures when the user switches between feed categories. | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `logout_completed` | Captures when the user signs out before analytics state reset. | `Shared/Sources/Shared/Session/SessionService.swift` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://us.posthog.com/project/483112/dashboard/1846919)
- [Login to post open funnel (wizard)](https://us.posthog.com/project/483112/insights/qocbKBpU)
- [Successful logins (wizard)](https://us.posthog.com/project/483112/insights/wnUJjWws)
- [Comment threads viewed (wizard)](https://us.posthog.com/project/483112/insights/my6m8bUZ)
- [Bookmarks saved or removed (wizard)](https://us.posthog.com/project/483112/insights/zPCvIdHz)
- [Support purchases completed (wizard)](https://us.posthog.com/project/483112/insights/VvBaJWWx)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
