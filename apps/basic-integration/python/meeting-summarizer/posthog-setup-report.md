# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the AI Meeting Summarizer Python application. The PostHog Python SDK was installed and initialized in both `server.py` (the HTTP server) and `user_service.py` (the background user management service). Environment variables are loaded via `python-dotenv`. Person identification is set on login and user registration using `posthog_client.set()`. Exception autocapture is enabled on both clients. Both clients register `shutdown()` via `atexit` to guarantee event flushing on process exit.

| Event | Description | File |
|---|---|---|
| `user_logged_in` | Fired when a user successfully authenticates via the login endpoint. | server.py |
| `user_login_failed` | Fired when a login attempt fails due to invalid credentials or inactive account. | server.py |
| `user_logged_out` | Fired when a user ends their session via the logout endpoint. | server.py |
| `user_registered` | Fired when a new user account is created in the system. | server.py |
| `meeting_created` | Fired when a meeting transcript is submitted and successfully summarized. | server.py |
| `meeting_creation_failed` | Fired when a meeting submission fails to be saved to the database. | server.py |
| `meeting_deleted` | Fired when a user deletes one of their meetings. | server.py |
| `user_profile_updated` | Fired when a user's profile information is updated. | server.py |
| `user_deactivated` | Fired when a user account is deactivated via the user management service. | user_service.py |
| `stats_viewed` | Fired when a user requests their meeting statistics dashboard data. | server.py |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1818197)
- [Daily active users](https://us.posthog.com/project/483112/insights/wojqsJsn)
- [Login to meeting creation funnel](https://us.posthog.com/project/483112/insights/CDc3Stv4)
- [Meetings created over time](https://us.posthog.com/project/483112/insights/XMYdrGDC)
- [Meeting created vs deleted](https://us.posthog.com/project/483112/insights/DPL5Lcfc)
- [User churn events](https://us.posthog.com/project/483112/insights/j9tcwHRB)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to `.env.example` and any bootstrap scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
