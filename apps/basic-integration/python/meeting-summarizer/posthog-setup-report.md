<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the AI Meeting Summarizer Python application. The `posthog` and `python-dotenv` packages were added to `requirements.txt`. A shared PostHog client (using the instance-based `Posthog()` constructor) was initialized in both `server.py` and `user_service.py`, loading credentials from environment variables via `python-dotenv`. `atexit.register` ensures events are flushed on clean exit. Eight analytics events were added across two files, covering login, logout, meeting lifecycle, and user management. User identification calls (`set()` and `set_once()`) were placed at login and registration so that person profiles in PostHog are populated with non-PII metadata.

| Event | Description | File |
|-------|-------------|------|
| `user_logged_in` | User successfully authenticated and a session was created | `server.py` |
| `user_login_failed` | User attempted to log in but authentication was unsuccessful | `server.py` |
| `user_logged_out` | User ended their session by logging out | `server.py` |
| `meeting_created` | User submitted a meeting transcript that was processed and summarized | `server.py` |
| `meeting_viewed` | User fetched the detail view of a specific meeting | `server.py` |
| `meeting_deleted` | User permanently deleted a meeting record | `server.py` |
| `user_registered` | A new user account was created in the system | `server.py` |
| `user_deactivated` | A user account was deactivated (soft-deleted) | `user_service.py` |

## Next steps

To monitor key user behaviors, create an **"Analytics basics"** dashboard in PostHog with these five recommended insights:

1. **User Logins Over Time** — Trends insight on `user_logged_in`, daily interval, last 30 days. Tracks active engagement over time.

2. **Meeting Creation Funnel** — Funnel insight with steps `user_logged_in` → `meeting_created`. Shows how many users who log in actually create a meeting (core conversion rate).

3. **Login Success vs Failure** — Trends insight comparing `user_logged_in` and `user_login_failed` event counts. Helps detect auth issues or brute-force attempts.

4. **Meeting Deletions (Churn Signal)** — Trends insight on `meeting_deleted` over time. A spike in deletions signals dissatisfaction or churn risk.

5. **Meeting Lifecycle Overview** — Trends insight showing `meeting_created`, `meeting_viewed`, and `meeting_deleted` side by side. Gives a holistic view of the meeting management funnel.

Create these at [/insights](/insights) and group them into a new dashboard at [/dashboards](/dashboards).

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-python/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
