<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the AI Meeting Summarizer Python application. The `posthog` and `python-dotenv` packages were added to `requirements.txt`, and a `.env` file was created with the PostHog project token and host. Two source files were instrumented: the HTTP server (`server.py`) and the background user service (`user_service.py`). Each file initialises a `Posthog` instance from environment variables, registers `shutdown()` via `atexit` so events are never lost on exit, enables `enable_exception_autocapture=True` for automatic unhandled-exception tracking, and calls `capture_exception()` inside every existing error handler for handled errors. User identification (`set()`) is called on login and registration to build person profiles without sending PII in event properties.

| Event | Description | File |
|---|---|---|
| `user_logged_in` | User successfully authenticated and a session was created | `server.py` |
| `user_login_failed` | Login attempt failed — user not found or account inactive | `server.py` |
| `user_logged_out` | User explicitly ended their session | `server.py` |
| `meeting_created` | User submitted a transcript and a new meeting record with AI summary was saved | `server.py` |
| `meeting_summarized` | AI analysis completed; tracks transcript size, action items, key points, participants, and duration | `server.py` |
| `meeting_deleted` | User deleted one of their meeting records | `server.py` |
| `meeting_stats_viewed` | User loaded their aggregate meeting statistics | `server.py` |
| `user_registered` | A new user account was created via the API | `server.py` |
| `user_deleted` | A user account was permanently deleted via the API | `server.py` |
| `user_profile_updated` | User profile fields were updated | `server.py` |
| `user_service_registered` | A user was registered through the background user management service | `user_service.py` |
| `user_deactivated` | A user account was deactivated (soft delete) via the user service | `user_service.py` |

## Next steps

To visualise the instrumented events, create an **"Analytics basics"** dashboard in PostHog and add the following five insights:

1. **Login-to-meeting funnel** — Funnel: `user_logged_in` → `meeting_created`
   Track what fraction of active sessions convert into submitted meetings (the core value action).

2. **Meetings created over time** — Trend: `meeting_created` (daily count)
   Monitor product growth and spot drops in usage.

3. **Meeting summarization quality** — Average of `meeting_summarized.action_items_count` and `meeting_summarized.participants_count` over time
   Understand the richness of transcripts being analysed.

4. **Churn signals** — Trend: `meeting_deleted` and `user_deactivated` (daily count, stacked)
   Early warning for users removing content or deactivating their accounts.

5. **Error rate** — Trend: `$exception` (daily count)
   Automatic exception capture is enabled; watch this to catch regressions.

You can create these insights and a dashboard by logging into your PostHog project and using the **Insights** and **Dashboards** sections. The project token `sTMFPsFhdP1Ssg` is connected to host `https://us.i.posthog.com`.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-python/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
