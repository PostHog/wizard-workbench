# PostHog post-wizard report

PostHog analytics has been integrated into the Python meeting summarizer. The server initializes a shared `Posthog` client from `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST`, enables exception autocapture, and flushes events during process shutdown. Successful logins update person properties and the server captures the primary meeting lifecycle actions using stable application user IDs. Event properties deliberately contain only operational metadata; transcript content, meeting titles, and participant names are not captured.

| Event name | Description | File |
| --- | --- | --- |
| `user_logged_in` | Captures a successful authenticated sign-in. | `server.py` |
| `meeting_created` | Captures successful AI analysis and persistence of a meeting transcript. | `server.py` |
| `meeting_deleted` | Captures successful deletion of a meeting. | `server.py` |

## Next steps

The PostHog MCP service was unavailable while creating PostHog artifacts, so no dashboard, insights, or notebook could be created during this run. After MCP access is restored, create **Analytics basics (wizard)** and add trends for `user_logged_in`, `meeting_created`, and `meeting_deleted`.

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.

### Agent skill

An agent skill folder remains in the project for future Claude Code work, with current PostHog integration guidance.
