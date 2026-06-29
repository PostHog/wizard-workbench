# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the AI Meeting Summarizer. The main changes were made to `server.py`: the PostHog Python SDK is initialized at module startup using environment variables (`POSTHOG_PROJECT_TOKEN`, `POSTHOG_HOST`), and `atexit.register` ensures all queued events are flushed on shutdown. Seven business-critical events are now captured across authentication and meeting lifecycle flows, user identification (person properties) is set on every successful login, and unhandled server exceptions are captured automatically via `enable_exception_autocapture=True` plus an explicit `capture_exception()` call in the POST error handler. The `requirements.txt` was updated to include `posthog>=3.0.0` and `python-dotenv>=1.0.0`, and a `.env` file was created with the project token and host.

| Event | Description | File |
|---|---|---|
| `user_logged_in` | Fired when a user successfully authenticates via the login endpoint. | server.py |
| `user_login_failed` | Fired when a login attempt fails due to invalid credentials or an inactive account. | server.py |
| `user_logged_out` | Fired when a user explicitly logs out of their session. | server.py |
| `meeting_created` | Fired when a meeting transcript is submitted and successfully analyzed by the AI summarizer. | server.py |
| `meeting_deleted` | Fired when a user permanently deletes one of their meetings. | server.py |
| `user_created` | Fired when an authenticated user provisions a new account in the system. | server.py |
| `user_deactivated` | Fired when a user account is deactivated or deleted from the system. | server.py |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) Dashboard](https://us.posthog.com/project/483112/dashboard/1775089)
- [Login Success vs Failure Rate](https://us.posthog.com/project/483112/insights/UKBPkoDQ)
- [Meeting Creation Trend](https://us.posthog.com/project/483112/insights/A2QfrKde)
- [Meeting Deletion Rate](https://us.posthog.com/project/483112/insights/adfCS70D)
- [Average Meeting Duration & Participant Count](https://us.posthog.com/project/483112/insights/PGDMhfY5)
- [User Churn (Deactivations vs New Users)](https://us.posthog.com/project/483112/insights/U2Q4JAEl)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to `.env.example` and any bootstrap scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` (via `posthog_client.set`) — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
