<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the AI Meeting Summarizer Python application. PostHog is now initialized in both `server.py` (the web server) and `user_service.py` (the standalone service) using environment variables from `.env`. The `posthog` Python SDK is loaded via `python-dotenv` and uses the instance-based `Posthog()` constructor with `enable_exception_autocapture=True` for automatic error tracking. A `atexit` handler is registered in both files to ensure events are flushed cleanly on exit. Users are identified (via `posthog_client.set()`) on login and registration so person properties are attached. Ten events are tracked across critical business flows including authentication, meeting creation, and user lifecycle.

| Event | Description | File |
|---|---|---|
| `user_logged_in` | User successfully authenticated via the login endpoint | `server.py` |
| `user_login_failed` | Login attempt failed because user was not found or is inactive | `server.py` |
| `user_logged_out` | User ended their session via the logout endpoint | `server.py` |
| `meeting_created` | User submitted a meeting transcript that was successfully summarized and saved | `server.py` |
| `meeting_deleted` | User deleted one of their meetings | `server.py` |
| `user_registered` | A new user account was successfully created via the API | `server.py` |
| `user_deleted` | A user account was permanently deleted via the API | `server.py` |
| `user_registered` | A new user was registered via the UserService | `user_service.py` |
| `user_deactivated` | A user account was deactivated via the UserService | `user_service.py` |
| `user_deleted` | A user account was permanently deleted via the UserService | `user_service.py` |

## Next steps

Create an "Analytics basics" dashboard in PostHog and add insights to track the key user behaviors we just instrumented. Use the links below to open pre-configured insights, then save each one to your dashboard:

- [Login Conversion Funnel](https://us.posthog.com/project/2/insights/new#eyJldmVudHMiOlt7ImlkIjoidXNlcl9yZWdpc3RlcmVkIiwidHlwZSI6ImV2ZW50cyIsIm9yZGVyIjowfSx7ImlkIjoidXNlcl9sb2dnZWRfaW4iLCJ0eXBlIjoiZXZlbnRzIiwib3JkZXIiOjF9XSwiaW5zaWdodCI6IkZVTk5FTCJ9) — Tracks the `user_registered` → `user_logged_in` conversion funnel. Spot where users drop off in onboarding.
- [Meeting Creation Trend](https://us.posthog.com/project/2/insights/new#eyJldmVudHMiOlt7ImlkIjoibWVldGluZ19jcmVhdGVkIiwidHlwZSI6ImV2ZW50cyIsIm9yZGVyIjowfV0sImRpc3BsYXkiOiJBY3Rpb25zTGluZUdyYXBoIiwiaW5zaWdodCI6IlRSRU5EUyIsImRhdGVfZnJvbSI6Ii0zMGQifQ==) — Trend of `meeting_created` events over the last 30 days. Monitor product usage and growth.
- [Login Failures](https://us.posthog.com/project/2/insights/new#eyJldmVudHMiOlt7ImlkIjoidXNlcl9sb2dpbl9mYWlsZWQiLCJ0eXBlIjoiZXZlbnRzIiwib3JkZXIiOjB9XSwiZGlzcGxheSI6IkFjdGlvbnNMaW5lR3JhcGgiLCJpbnNpZ2h0IjoiVFJFTkRTIiwiZGF0ZV9mcm9tIjoiLTMwZCJ9) — Trend of `user_login_failed` events. Spike detection for auth issues or brute-force attempts.
- [User Churn Events](https://us.posthog.com/project/2/insights/new#eyJldmVudHMiOlt7ImlkIjoidXNlcl9kZWFjdGl2YXRlZCIsInR5cGUiOiJldmVudHMiLCJvcmRlciI6MH0seyJpZCI6InVzZXJfZGVsZXRlZCIsInR5cGUiOiJldmVudHMiLCJvcmRlciI6MX1dLCJkaXNwbGF5IjoiQWN0aW9uc0JhciIsImluc2lnaHQiOiJUUkVORFMiLCJkYXRlX2Zyb20iOiItMzBkIn0=) — Compares `user_deactivated` vs `user_deleted` counts. Track churn and understand account loss rate.
- [Active Users (Logins vs Logouts)](https://us.posthog.com/project/2/insights/new#eyJldmVudHMiOlt7ImlkIjoidXNlcl9sb2dnZWRfaW4iLCJ0eXBlIjoiZXZlbnRzIiwib3JkZXIiOjB9LHsiaWQiOiJ1c2VyX2xvZ2dlZF9vdXQiLCJ0eXBlIjoiZXZlbnRzIiwib3JkZXIiOjF9XSwiZGlzcGxheSI6IkFjdGlvbnNMaW5lR3JhcGgiLCJpbnNpZ2h0IjoiVFJFTkRTIiwiZGF0ZV9mcm9tIjoiLTMwZCJ9) — Overlays `user_logged_in` and `user_logged_out` trends. Understand daily active session patterns.

To create the dashboard: visit [PostHog Dashboards](https://us.posthog.com/project/2/dashboards) → **New dashboard** → name it "Analytics basics" → add each saved insight as a tile.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-python/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
