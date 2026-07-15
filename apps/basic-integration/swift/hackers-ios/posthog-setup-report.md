# PostHog post-wizard report

PostHog has been integrated into the SwiftUI iOS app. The Xcode project now resolves the `PostHog` Swift Package Manager product, and the app initializes the SDK at launch using `POSTHOG_API_KEY` and `POSTHOG_HOST` build settings sourced from the local `.env` file. Error autocapture and iOS session replay are enabled.

Authentication now identifies users with a SHA-256-derived stable distinct ID; the username is stored only as a person property. Custom event payloads avoid user-entered PII. Sign-out resets the PostHog identity. Opening a post records its identifier, selected feed type, and whether it came from the feed or a deep link.

| Event name | Description | File |
| --- | --- | --- |
| `user_signed_in` | A Hacker News account authentication succeeds in the app. | `App/ContentView.swift` |
| `user_signed_out` | An authenticated user signs out of the app. | `App/ContentView.swift` |
| `post_opened` | A user opens a Hacker News post and its comments. | `App/NavigationStore.swift` |

## Next steps

The PostHog MCP service was unavailable in this environment, so a live dashboard, insights, and shareable notebook could not be created during this run. After the service is available, create an **Analytics basics (wizard)** dashboard with trends for `user_signed_in`, `user_signed_out`, and `post_opened`.

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
