# PostHog post-wizard report

The wizard has completed a deep integration of this project by adding PostHog to both the Python server and the browser flows for authentication and meeting management. The server now initializes a reusable PostHog Python client from environment variables, enables exception autocapture, forwards person properties on identified users, and captures server-side events for login, user creation, meeting creation failures, successful meeting creation, and meeting deletion. The browser now loads runtime PostHog configuration from the server, creates anonymous browser and session identifiers, forwards those identifiers to the backend for correlation, and captures client-side events around login submission, dashboard usage, meeting upload starts, meeting detail views, and logout.

| Event name | Description | File |
| --- | --- | --- |
| user_logged_in | Captures successful sign-in for an existing account. | server.py |
| user_login_failed | Captures unsuccessful sign-in attempts with a failure reason. | server.py |
| meeting_created | Captures successful meeting transcript analysis and creation. | server.py |
| meeting_creation_failed | Captures failed meeting creation or transcript analysis attempts. | server.py |
| meeting_deleted | Captures successful deletion of an owned meeting. | server.py |
| user_created | Captures successful user creation from the application API. | server.py |
| dashboard_loaded | Captures when the authenticated dashboard finishes loading in the browser. | static/app.js |
| meeting_detail_viewed | Captures when a user opens a meeting detail view. | static/app.js |
| meeting_upload_started | Captures when a user starts submitting a new meeting transcript. | static/app.js |
| logout_clicked | Captures when a user initiates logout from the dashboard. | static/app.js |
| login_submitted | Captures when a user submits the login form. | static/login.js |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- Dashboard: [Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1846788)
- Insight: [Successful logins (wizard)](https://us.posthog.com/project/483112/insights/z5BuI3VL)
- Insight: [Meetings created (wizard)](https://us.posthog.com/project/483112/insights/6D10ExIw)
- Insight: [Meeting detail views (wizard)](https://us.posthog.com/project/483112/insights/OXgzuwcq)
- Insight: [Login to meeting creation funnel (wizard)](https://us.posthog.com/project/483112/insights/sMGFyj2a)
- Insight: [Meeting creation failures (wizard)](https://us.posthog.com/project/483112/insights/HrnZWwDL)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
