<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the AI Meeting Summarizer project. The `posthog` and `python-dotenv` packages were added as dependencies, a `_init_posthog()` initializer was introduced in both `server.py` and `user_service.py`, and event capture calls were added at all key user-action points. The PostHog client uses `enable_exception_autocapture=True` and registers `client.shutdown` with `atexit` to ensure events are flushed before the process exits. Credentials are loaded from the `.env` file and never hardcoded.

| Event | Description | File(s) |
|---|---|---|
| `user_logged_in` | User successfully authenticated and started a session | `server.py` |
| `user_login_failed` | Login attempt failed (user not found or inactive) | `server.py` |
| `user_logged_out` | User ended their session | `server.py` |
| `meeting_created` | Meeting transcript submitted and summarized record saved (with `transcript_length`, `participant_count`, `action_item_count`, `key_point_count`, `duration_minutes`) | `server.py` |
| `meeting_deleted` | User deleted a meeting record | `server.py` |
| `user_registered` | New user account created | `server.py`, `user_service.py` |
| `user_deleted` | User account permanently removed | `server.py`, `user_service.py` |
| `user_deactivated` | User account soft-deactivated (churn signal) | `user_service.py` |

## Next steps

Build the following insights on an **"Analytics basics"** dashboard in PostHog to monitor user behavior:

1. **Login Conversion Funnel** — Funnel: `user_registered` → `user_logged_in`. Highlights drop-off between signup and first login.
2. **Meeting Creation Trend** — Trend of `meeting_created` over time. Core product engagement metric.
3. **User Churn** — Trend combining `user_deactivated` and `user_deleted`. Key retention health signal.
4. **Auth Success vs Failure** — Side-by-side trend of `user_logged_in` vs `user_login_failed`. Identifies login issues.
5. **Meeting Lifecycle** — Trend of `meeting_created` vs `meeting_deleted`. Shows net meeting retention.

Navigate to [https://us.posthog.com/project/2/dashboards](https://us.posthog.com/project/2/dashboards) to create this dashboard.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-python/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
