<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the AI Meeting Summarizer project. PostHog SDK was added to both `server.py` (the HTTP web server) and `user_service.py` (the standalone user management script). The `posthog` and `python-dotenv` packages were added to `requirements.txt`. Environment variables `POSTHOG_API_KEY` and `POSTHOG_HOST` are loaded from a `.env` file (auto-added to `.gitignore`). Each file initialises a `Posthog` instance with `enable_exception_autocapture=True`, registers `shutdown()` with `atexit`, and captures the relevant events listed below.

| Event | Description | File |
|-------|-------------|------|
| `user_logged_in` | Fired when a user successfully logs in via the web interface. Also calls `posthog.set()` to identify the user's person profile. | `server.py` |
| `user_login_failed` | Fired when a login attempt fails (user not found or inactive). Captured with `distinct_id='anonymous'` to avoid PII. | `server.py` |
| `user_logged_out` | Fired when a user logs out of the web interface. | `server.py` |
| `user_created` | Fired when a new user account is created via the web API. | `server.py` |
| `meeting_created` | Fired when a user submits a meeting transcript and the AI summary is generated — the core conversion event. Properties: `meeting_id`, `duration_minutes`, `participant_count`, `action_item_count`, `transcript_word_count`. | `server.py` |
| `meeting_deleted` | Fired when a user deletes a meeting record — a potential churn signal. | `server.py` |
| `user_registered` | Fired when a new user is registered via the UserService. Also calls `posthog.set()` to initialise the user's person profile. | `user_service.py` |
| `user_profile_updated` | Fired when a user's profile details are updated via UserService. Properties: `fields_updated` (list of changed field names). | `user_service.py` |
| `user_deactivated` | Fired when a user account is deactivated — a churn signal. | `user_service.py` |
| `user_deleted` | Fired when a user account is permanently deleted — a strong churn signal. | `user_service.py` |

Exception autocapture is enabled globally (via `enable_exception_autocapture=True`), and `capture_exception()` is called in all HTTP request exception handlers in `server.py` to track handled errors.

## Next steps

We recommend building an **"Analytics basics"** dashboard in your PostHog project with the following five insights:

1. **Meeting Creation Trend** — Trend of `meeting_created` over time. This is your core business metric showing how many meetings are being summarized per day/week.
2. **Login → Meeting Funnel** — Funnel from `user_logged_in` → `meeting_created`. Shows what fraction of sessions result in a meeting being created (activation rate).
3. **Churn Signals Trend** — Trend of `user_deactivated` + `user_deleted` events over time. Early warning of customer dissatisfaction.
4. **Login Failure Rate** — Trend of `user_login_failed` vs `user_logged_in`. A spike in failures may indicate a UX issue or credential problems.
5. **New User Registrations** — Trend of `user_registered` + `user_created` over time. Tracks growth and acquisition.

You can create this dashboard at:
**https://us.posthog.com/project/2/dashboard/new**

And add insights at:
**https://us.posthog.com/project/2/insights/new**

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-python/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
