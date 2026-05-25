<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the AI Meeting Summarizer application. The PostHog Python SDK was added alongside a shared client module (`posthog_client.py`) that initialises the instance once at startup and registers a graceful shutdown hook via `atexit`. No existing logic was changed — all PostHog calls are additive and guarded by a `posthog_client` null-check, so the app continues to work even if the environment variables are not set.

Three files were edited:
- **server.py** — tracks authentication events (login success/failure, logout) and all meeting lifecycle events (created, viewed, deleted) as well as user management actions (profile updated, user deleted), plus AI summarisation metadata.
- **user_service.py** — tracks user registration (with identification), deactivation, and hard-deletion from the admin/script layer.
- **posthog_client.py** *(new)* — singleton `Posthog` instance initialised from `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` environment variables, with `enable_exception_autocapture=True` and `atexit` shutdown registered.

| Event | Description | File |
|---|---|---|
| `user_logged_in` | User successfully authenticated; person properties (username) set on the profile. | server.py |
| `user_login_failed` | Login rejected — user not found or account inactive. Property: `reason`. | server.py |
| `user_logged_out` | User explicitly ended their session. | server.py |
| `meeting_created` | Transcript uploaded, analysed, and saved. Properties: `title_length`, `transcript_length`, `participant_count`, `action_item_count`, `key_point_count`, `duration_minutes`. | server.py |
| `meeting_viewed` | User opened the detail view of a meeting. Properties: `duration_minutes`, `participant_count`, `action_item_count`, `key_point_count`. | server.py |
| `meeting_deleted` | User permanently removed a meeting. | server.py |
| `transcript_analyzed` | AI summariser completed processing. Properties: `word_count`, `participant_count`, `action_item_count`, `key_point_count`, `duration_minutes`. | server.py |
| `user_profile_updated` | Profile fields changed via the API. Property: `fields_updated` (list of field names). | server.py |
| `user_deleted` | User account permanently removed. | server.py |
| `user_registered` | New account created via UserService. Properties: `has_full_name`, `has_metadata`. Person properties (username) set on the profile. | user_service.py |
| `user_deactivated` | Account soft-deleted via UserService. | user_service.py |

## Next steps

To create an "Analytics basics" dashboard in PostHog, navigate to [Dashboards](/dashboards) and click **New dashboard**. Recommended insights to add:

- **Logins over time** — Trends on `user_logged_in` vs `user_login_failed` (conversion funnel top).
- **Meeting creation funnel** — Funnel from `user_logged_in` → `meeting_created` to see drop-off.
- **Meetings created over time** — Trends on `meeting_created` broken down by `participant_count`.
- **Transcript analysis quality** — Trends on `transcript_analyzed` with `action_item_count` as the aggregated average.
- **Churn signals** — Trends on `user_deactivated` + `user_deleted` over time.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-python/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
