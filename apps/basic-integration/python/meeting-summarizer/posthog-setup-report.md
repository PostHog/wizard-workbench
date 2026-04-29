<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the AI Meeting Summarizer. The following changes were made:

- **`requirements.txt`** — Added `posthog>=3.0.0` and `python-dotenv>=1.0.0` dependencies.
- **`.env`** — Created with `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` environment variables.
- **`server.py`** — Initialized a `Posthog` client via `initialize_posthog()`, registered shutdown with `atexit`, added user identification (`posthog.set()`) on login, and instrumented all key API endpoints with `capture()` calls. Exception autocapture is enabled, and `capture_exception()` is called in all error handlers.
- **`user_service.py`** — Initialized a `Posthog` client, registered shutdown with `atexit`, and added `capture()` calls for user registration and account deactivation.

| Event | Description | File |
|---|---|---|
| `user_logged_in` | User successfully authenticated and a session was created | `server.py` |
| `user_logged_out` | User ended their session by logging out | `server.py` |
| `user_registered` | A new user account was created in the system | `server.py`, `user_service.py` |
| `meeting_created` | A new meeting was submitted, processed by AI, and saved successfully | `server.py` |
| `meeting_deleted` | A meeting was permanently deleted by the owner | `server.py` |
| `meeting_summarized` | AI analysis of a meeting transcript completed successfully | `server.py` |
| `user_deactivated` | A user account was deactivated (soft delete / churn signal) | `user_service.py` |
| `user_deleted` | A user account was permanently deleted from the system | `server.py` |
| `user_profile_updated` | A user's profile information was updated | `server.py` |

## Next steps

Create an **"Analytics basics"** dashboard in PostHog with these five recommended insights:

1. **Daily Active Users** — Trend of `user_logged_in` events over the last 30 days. Tracks daily engagement.
   - [Create insight](https://us.posthog.com/project/2/insights/new#insight=TRENDS&events=[{"id":"user_logged_in","name":"user_logged_in","type":"events"}])

2. **Signup → First Meeting Funnel** — Funnel from `user_registered` → `meeting_created`. Measures activation rate.
   - [Create insight](https://us.posthog.com/project/2/insights/new#insight=FUNNELS&events=[{"id":"user_registered","name":"user_registered","type":"events"},{"id":"meeting_created","name":"meeting_created","type":"events"}])

3. **Meetings Created Per Day** — Trend of `meeting_created` events. Core product usage metric.
   - [Create insight](https://us.posthog.com/project/2/insights/new#insight=TRENDS&events=[{"id":"meeting_created","name":"meeting_created","type":"events"}])

4. **Churn Signals** — Trend of `user_deactivated` and `user_deleted` events. Tracks account churn.
   - [Create insight](https://us.posthog.com/project/2/insights/new#insight=TRENDS&events=[{"id":"user_deactivated","name":"user_deactivated","type":"events"},{"id":"user_deleted","name":"user_deleted","type":"events"}])

5. **Meeting Retention (Create vs Delete)** — Trend comparing `meeting_created` vs `meeting_deleted`. Shows whether users keep their meeting summaries.
   - [Create insight](https://us.posthog.com/project/2/insights/new#insight=TRENDS&events=[{"id":"meeting_created","name":"meeting_created","type":"events"},{"id":"meeting_deleted","name":"meeting_deleted","type":"events"}])

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
