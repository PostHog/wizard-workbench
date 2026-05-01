<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the AI Meeting Summarizer Python application. A shared `posthog_client.py` module was created to initialize the PostHog SDK using environment variables. Event tracking, user identification, and automatic exception capture were added to `server.py` (the HTTP server) and `user_service.py` (the user management service). The `posthog` package was added to `requirements.txt` and credentials were written to `.env`.

| Event | Description | File |
|---|---|---|
| `user_logged_in` | User successfully authenticated via the login endpoint | `server.py` |
| `user_login_failed` | Login attempt failed — user not found or inactive | `server.py` |
| `user_logged_out` | User ended their session | `server.py` |
| `meeting_created` | Meeting transcript uploaded and AI summary generated | `server.py` |
| `meeting_deleted` | User deleted a meeting | `server.py` |
| `user_registered` | New user account created via the user service | `user_service.py` |
| `user_deactivated` | User account deactivated via the user service | `user_service.py` |

Person properties (username, name, email) are set via `posthog_client.set()` on login and registration. Automatic exception capture is enabled globally via `enable_exception_autocapture=True` and `capture_exception()` is called in POST and DELETE error handlers.

## Next steps

We recommend building an **"Analytics basics"** dashboard in PostHog with the following five insights:

1. **Login success rate** — Trend of `user_logged_in` vs `user_login_failed` over time. Helps monitor authentication health.
   - [Create this insight](https://us.posthog.com/project/2/insights/new#insight=TRENDS)

2. **Login → Meeting created funnel** — Conversion funnel: `user_logged_in` → `meeting_created`. Shows how many logged-in users go on to create a meeting.
   - [Create this insight](https://us.posthog.com/project/2/insights/new#insight=FUNNELS)

3. **Meeting creation volume** — Trend of `meeting_created` events over time, broken down by `participant_count`. Tracks core product usage.
   - [Create this insight](https://us.posthog.com/project/2/insights/new#insight=TRENDS)

4. **Meeting deletion rate** — Trend of `meeting_deleted` vs `meeting_created`. High deletion rates may signal quality issues with AI summaries.
   - [Create this insight](https://us.posthog.com/project/2/insights/new#insight=TRENDS)

5. **User churn** — Trend of `user_deactivated` events over time. Tracks account churn from the user service.
   - [Create this insight](https://us.posthog.com/project/2/insights/new#insight=TRENDS)

[Create the "Analytics basics" dashboard](https://us.posthog.com/project/2/dashboard/new)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-python/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
