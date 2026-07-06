<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of this pure Python meeting summarizer application. PostHog was added to the backend web server and background user service using environment-based configuration, exception autocapture, person property syncing, and graceful shutdown handling. Client-side analytics initialization was added to the login and dashboard flows using a server-provided config endpoint so browser code does not hardcode credentials. Product analytics now cover authentication, dashboard engagement, meeting creation and deletion, meeting detail views, and user lifecycle operations.

| Event name | Description | File |
| --- | --- | --- |
| user_logged_in | Captures successful sign-in attempts for authenticated users. | server.py |
| login_failed | Captures failed sign-in attempts when credentials do not match an active user. | server.py |
| meeting_created | Captures successful transcript uploads and AI summary generation for a meeting. | server.py |
| meeting_deleted | Captures when a user permanently deletes a meeting record. | server.py |
| meeting_viewed | Captures when a user opens a meeting detail view from the dashboard. | static/app.js |
| meeting_upload_started | Captures when a user submits a new transcript for analysis. | static/app.js |
| dashboard_loaded | Captures when an authenticated user loads the meetings dashboard. | static/app.js |
| logout_clicked | Captures when a user initiates logout from the dashboard. | static/app.js |
| user_registered | Captures successful user creation through the background user management flow. | user_service.py |
| user_deactivated | Captures when a user account is deactivated in the user management flow. | user_service.py |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- Dashboard: https://us.posthog.com/project/483112/dashboard/1807674
- Insight: Meeting engagement funnel — https://us.posthog.com/project/483112/insights/hL6t8aBX
- Insight: Login success funnel — https://us.posthog.com/project/483112/insights/DbMp2Ucx
- Insight: Meeting creation volume — https://us.posthog.com/project/483112/insights/Pls1ZiUZ
- Insight: Meeting lifecycle outcomes — https://us.posthog.com/project/483112/insights/W3LeA3KL
- Insight: Logins over time — https://us.posthog.com/project/483112/insights/RXBAdQuD

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
