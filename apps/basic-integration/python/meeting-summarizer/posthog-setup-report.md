# PostHog post-wizard report

The wizard integrated the PostHog Python SDK into the application's long-running server process. It loads the configured environment variables, initializes a reusable `Posthog` client with exception autocapture, and registers a shutdown handler to flush queued events. Successful logins set permitted person properties and capture an authentication event. Meeting creation and deletion capture aggregate, non-PII usage metadata. Handled POST and DELETE failures are also sent to PostHog error tracking with the authenticated stable user identifier when available.

| Event name | Description | File |
| --- | --- | --- |
| `user_logged_in` | Captures a successful authenticated sign-in using the account's stable identifier. | `server.py` |
| `meeting_created` | Captures successful AI analysis and persistence of a meeting transcript. | `server.py` |
| `meeting_deleted` | Captures a user's successful deletion of one of their meetings. | `server.py` |

## Next steps

The PostHog dashboard and notebook could not be created because the configured PostHog MCP server was unavailable in this environment. Create the dashboard **Analytics basics (wizard)** once MCP connectivity is restored, using trends for `meeting_created` and `meeting_deleted` plus a funnel from `user_logged_in` to `meeting_created`.

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
