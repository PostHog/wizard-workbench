# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the AI Meeting Summarizer project. PostHog is initialized in both `server.py` (the HTTP server) and `user_service.py` (the background service) using the instance-based `Posthog()` constructor with `enable_exception_autocapture=True`. The SDK token and host are read from environment variables (`POSTHOG_PROJECT_TOKEN`, `POSTHOG_HOST`) via a `.env` file. Both modules register `posthog_client.shutdown` with `atexit` to ensure all queued events are flushed on process exit. User identification is performed on login and registration using `posthog_client.set()` to attach `username` and `email` as person properties.

| Event name | Description | File |
|---|---|---|
| `user_logged_in` | Fired when a user successfully authenticates via the login endpoint. | server.py |
| `user_login_failed` | Fired when a login attempt fails due to unknown user or inactive account. | server.py |
| `user_logged_out` | Fired when a user explicitly logs out and their session is destroyed. | server.py |
| `meeting_created` | Fired when a user submits a transcript and a new summarized meeting is saved. | server.py |
| `meeting_viewed` | Fired when a user retrieves the details of a specific meeting. | server.py |
| `meeting_deleted` | Fired when a user permanently deletes a meeting. | server.py |
| `meetings_listed` | Fired when a user fetches their list of meetings. | server.py |
| `stats_viewed` | Fired when a user requests their meeting statistics summary. | server.py |
| `user_registered` | Fired when a new user account is successfully created. | server.py |
| `user_deactivated` | Fired when a user account is deactivated via the user service. | user_service.py |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://us.posthog.com/project/483112/dashboard/1787455)
- [Meetings Created Over Time](https://us.posthog.com/project/483112/insights/5E3RTpMH)
- [Login to Meeting Creation Funnel](https://us.posthog.com/project/483112/insights/lKjG8F1H)
- [User Registrations vs Deactivations](https://us.posthog.com/project/483112/insights/202uwkiC)
- [Failed Login Attempts Over Time](https://us.posthog.com/project/483112/insights/jdABlYsy)
- [Meetings Deleted Over Time](https://us.posthog.com/project/483112/insights/9C7QrBs1)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to `.env.example` and any bootstrap scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
