# PostHog post-wizard report

The wizard integrated the PostHog iOS SDK through Swift Package Manager and initializes it once during application launch. The configuration reads `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from the app bundle, supplied as build settings through the local `.env` configuration. Application lifecycle capture, iOS error autocapture, and session replay are enabled.

The integration identifies authenticated Hacker News users using their username as the stable distinct ID and stores that username as a person property. Custom event properties intentionally exclude usernames and other user-entered information.

| Event name | Description | File |
| --- | --- | --- |
| `user_logged_in` | Captures a successful Hacker News account login. | `App/ContentView.swift` |
| `user_logged_out` | Captures an explicit account logout before analytics identity is reset. | `App/ContentView.swift` |
| `post_opened` | Captures opening a Hacker News post and its comments. | `App/NavigationStore.swift` |
| `bookmark_toggled` | Captures adding or removing a post bookmark. | `Features/Feed/Sources/Feed/FeedViewModel.swift` |
| `support_purchase_completed` | Captures a completed subscription or tip purchase. | `Features/Settings/Sources/Settings/SupportViewModel.swift` |
| `support_purchase_failed` | Captures a support purchase failure without customer details. | `Features/Settings/Sources/Settings/SupportViewModel.swift` |
| `support_purchases_restored` | Captures a completed restoration of prior support purchases. | `Features/Settings/Sources/Settings/SupportViewModel.swift` |

## Next steps

A dashboard and shareable notebook could not be created because the configured PostHog MCP service was unavailable during this run. Once it is available, create **Analytics basics (wizard)** with insights for login activity, post opens, bookmark actions, and support-purchase outcomes.

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

An agent skill folder has been installed in this project under `.claude/skills/integration-swift`. Use it for future PostHog-related development to retain the framework-specific integration context.
