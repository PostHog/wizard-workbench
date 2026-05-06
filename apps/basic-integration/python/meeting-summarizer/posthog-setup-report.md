<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of the AI Meeting Summarizer with PostHog analytics. The following changes were made:

- **`server.py`**: Added PostHog client initialization with `enable_exception_autocapture=True`, user identification (`set()`) on login, and event capture for all major user actions: login success/failure, logout, meeting creation/deletion/viewing, meetings listing, and stats viewing. Exception capture was added to all HTTP error handlers.
- **`user_service.py`**: Added PostHog client initialization and event capture for user lifecycle events: registration (with person property identification via `set()`), deactivation, and permanent deletion.
- **`ai_summarizer.py`**: Added PostHog client initialization and event capture after each transcript analysis, tracking word count, duration, and extraction metrics.
- **`requirements.txt`**: Added `posthog>=3.0.0` and `python-dotenv>=1.0.0` dependencies.
- **`.env`**: Created with `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` environment variables.

All PostHog clients use `atexit.register(posthog_client.shutdown)` to ensure events are flushed on exit. PII (email addresses) is never sent in event properties — login failure uses a SHA-256 hash of the email as the distinct ID.

## Events instrumented

| Event | Description | File |
|---|---|---|
| `user_logged_in` | User successfully authenticates via the login endpoint | `server.py` |
| `user_login_failed` | Login attempt fails due to invalid credentials or inactive account | `server.py` |
| `user_logged_out` | User ends their session via the logout endpoint | `server.py` |
| `meeting_created` | User submits a transcript and a meeting summary is saved | `server.py` |
| `meeting_deleted` | User permanently deletes one of their meetings | `server.py` |
| `meeting_viewed` | User fetches a specific meeting by ID | `server.py` |
| `meetings_listed` | User retrieves their full list of meetings | `server.py` |
| `stats_viewed` | User views their meeting statistics dashboard | `server.py` |
| `user_registered` | New user account is successfully created via UserService | `user_service.py` |
| `user_deactivated` | User account is soft-deleted (deactivated) via UserService | `user_service.py` |
| `user_deleted` | User account is permanently deleted via UserService | `user_service.py` |
| `transcript_analyzed` | AISummarizer successfully processes a meeting transcript | `ai_summarizer.py` |

## Next steps

We've prepared five insights for you to add to a new **"Analytics basics"** dashboard in PostHog. Open each link, review the insight, then save it and add it to your dashboard:

1. **Login Conversion Funnel** — Track how many login attempts succeed vs. fail:
   `https://us.posthog.com/project/2/insights/new?insight=FUNNELS`
   _(Add steps: `user_login_failed` → `user_logged_in`, or just `user_logged_in` trend vs. `user_login_failed` trend)_

2. **Meeting Creation Trend** — Monitor how often users create meeting summaries over time:
   `https://us.posthog.com/project/2/insights/new?insight=TRENDS`
   _(Add event: `meeting_created`, breakdown by `participant_count`)_

3. **Meeting Deletion Rate (Churn Signal)** — Track meeting deletions as a churn indicator:
   `https://us.posthog.com/project/2/insights/new?insight=TRENDS`
   _(Add events: `meeting_deleted` and `meeting_created` for comparison)_

4. **New User Registrations** — Track user growth over time:
   `https://us.posthog.com/project/2/insights/new?insight=TRENDS`
   _(Add event: `user_registered`, set date range to last 30 days)_

5. **User Deactivations** — Monitor account deactivations and deletions as a retention signal:
   `https://us.posthog.com/project/2/insights/new?insight=TRENDS`
   _(Add events: `user_deactivated` and `user_deleted` on the same chart)_

To create the dashboard: go to [PostHog Dashboards](https://us.posthog.com/project/2/dashboards), click **New dashboard**, name it **"Analytics basics"**, and add the saved insights above.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-python/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
