<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of your project. PostHog was added to the Xcode project through Swift Package Manager references, initialized during app launch, wired to environment-backed Info.plist configuration, and connected to core product flows across app launch, feed usage, story opening, bookmarking, comments engagement, authentication, settings access, and support purchase conversion.

| Event name | Description | File |
| --- | --- | --- |
| app_opened | Captures when the app finishes launching and analytics becomes available. | App/AppDelegate.swift |
| feed_viewed | Captures when a feed category is loaded so feed usage can be compared across sections. | Features/Feed/Sources/Feed/FeedView.swift |
| post_opened | Captures when a story or external link is opened from the feed. | Features/Feed/Sources/Feed/FeedView.swift |
| bookmark_toggled | Captures when a user saves or removes a bookmark from a post. | Features/Feed/Sources/Feed/FeedView.swift |
| comments_viewed | Captures when a post comments screen is loaded. | Features/Comments/Sources/Comments/CommentsView.swift |
| comment_thread_toggled | Captures when a comment thread is collapsed or expanded. | Features/Comments/Sources/Comments/CommentsView.swift |
| login_succeeded | Captures when a user successfully signs in to the app. | Shared/Sources/Shared/Session/SessionService.swift |
| logout_completed | Captures when an authenticated user signs out. | Shared/Sources/Shared/Session/SessionService.swift |
| settings_viewed | Captures when the settings screen is presented. | Features/Settings/Sources/Settings/SettingsView.swift |
| support_products_loaded | Captures when support products are fetched for the support screen. | Features/Settings/Sources/Settings/SupportViewModel.swift |
| support_purchase_started | Captures when a user begins a subscription or tip purchase. | Features/Settings/Sources/Settings/SupportViewModel.swift |
| support_purchase_completed | Captures when a subscription or tip purchase succeeds. | Features/Settings/Sources/Settings/SupportViewModel.swift |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- Dashboard: https://us.posthog.com/project/483112/dashboard/1807708
- Insight: App opens — https://us.posthog.com/project/483112/insights/8oPaV0RK
- Insight: Authentication conversion — https://us.posthog.com/project/483112/insights/gpIvd6hU
- Insight: Support purchase conversion — https://us.posthog.com/project/483112/insights/Ta0bSckW
- Insight: Settings views — https://us.posthog.com/project/483112/insights/stiiQ2ca
- Insight: Comments viewed — https://us.posthog.com/project/483112/insights/PJ87UugZ

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>