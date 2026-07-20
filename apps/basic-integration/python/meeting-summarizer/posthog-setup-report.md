# PostHog post-wizard report

The wizard integrated the instance-based PostHog Python SDK into the meeting summarizer server. It loads the project token and host from environment variables, enables automatic exception capture, flushes events during graceful shutdown, identifies authenticated users with person properties, and captures six server-side business events without placing PII or transcript content in event properties.

| Event | Description | File |
|---|---|---|
| `user_logged_in` | A user successfully authenticated and started a session. | `server.py` |
| `user_created` | An authenticated user created another user account. | `server.py` |
| `meeting_created` | A user submitted a transcript and successfully generated a meeting summary. | `server.py` |
| `meeting_deleted` | A user permanently deleted one of their meetings. | `server.py` |
| `user_updated` | An authenticated user successfully updated a user account. | `server.py` |
| `user_deleted` | An authenticated user permanently deleted a user account. | `server.py` |

## Next steps

A dashboard and notebook could not be created because the PostHog MCP endpoint was unavailable during setup. Create an **Analytics basics (wizard)** dashboard when connectivity is restored, using the event names above.

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names (`POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST`) to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also sets person properties — identification currently occurs on fresh login.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
