<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the AI Meeting Summarizer Python application. The PostHog Python SDK was added to `requirements.txt`, environment variables were configured in `.env`, and all key user and meeting lifecycle events are now tracked in `server.py`.

A `Posthog` instance is initialized at module load using `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from environment variables, with `enable_exception_autocapture=True` for automatic exception tracking. The instance is registered with `atexit` to flush all queued events cleanly on shutdown. User identity is set via `posthog.set()` on successful login. Exception capture is wired into all HTTP handler error paths.

| Event | Description | File |
|---|---|---|
| `user_logged_in` | User successfully authenticated and a session was created | `server.py` |
| `user_login_failed` | Authentication attempt failed (user not found or account inactive) | `server.py` |
| `user_logged_out` | User explicitly ended their session via the logout endpoint | `server.py` |
| `meeting_created` | User submitted a transcript and a new meeting record with AI summary was persisted | `server.py` |
| `meeting_deleted` | User deleted one of their existing meeting records | `server.py` |
| `user_registered` | An authenticated user created a new account via the API | `server.py` |
| `user_deleted` | A user account was permanently removed from the system | `server.py` |

## Next steps

We've set up the event tracking so you can build insights and a dashboard to monitor user behavior. Here are recommended insights for an **Analytics basics** dashboard in PostHog:

1. **Login funnel** — Trend of `user_logged_in` vs `user_login_failed` to monitor auth success rate
2. **Meetings created over time** — Trend of `meeting_created` to track core feature adoption
3. **User registration rate** — Trend of `user_registered` to measure growth
4. **Meeting deletion rate** — Trend of `meeting_deleted` as a churn signal
5. **Login-to-meeting conversion funnel** — Funnel from `user_logged_in` → `meeting_created` to measure activation

Create these at: https://us.posthog.com/project/2/insights/new

Dashboard: https://us.posthog.com/project/2/dashboards

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
