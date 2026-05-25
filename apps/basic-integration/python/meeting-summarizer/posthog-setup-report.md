<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the AI Meeting Summarizer project. A new `posthog_client.py` module was created to initialize the PostHog Python SDK from environment variables, with automatic shutdown registered via `atexit`. The `requirements.txt` was updated with `posthog>=3.0.0` and `python-dotenv>=1.0.0`, and a `.env` file was created with `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST`. Both `server.py` (the HTTP server) and `user_service.py` (the admin service) were instrumented to capture key business events and set person properties on login and registration.

| Event | Description | File |
|-------|-------------|------|
| `user_logged_in` | User successfully authenticated and a session was created | `server.py` |
| `user_login_failed` | Login attempt failed because the user was not found or is inactive | `server.py` |
| `user_logged_out` | User session was destroyed and the user was logged out | `server.py` |
| `user_registered` | A new user account was created via the API; sets person properties (username, email) | `server.py` |
| `meeting_created` | A meeting transcript was submitted, analyzed by AI, and saved; properties: `transcript_word_count`, `participant_count`, `action_item_count`, `key_point_count`, `duration_minutes` | `server.py` |
| `meeting_deleted` | A meeting was permanently deleted by the owning user | `server.py` |
| `user_registered` | A new user account was created via the UserService; properties: `has_full_name`, `has_metadata` | `user_service.py` |
| `user_profile_updated` | A user's profile fields were updated; properties: `fields_updated` (count) | `user_service.py` |
| `user_deactivated` | A user account was deactivated (soft delete) | `user_service.py` |
| `user_deleted` | A user account was permanently deleted | `user_service.py` |

## Next steps

Dashboard creation was not available via the PostHog MCP in this environment. You can manually create an "Analytics basics" dashboard in [PostHog](https://us.posthog.com) with the following recommended insights:

- **Login funnel**: Funnel from `user_logged_in` → `meeting_created` to track activation
- **Meeting creation trend**: Trends chart of `meeting_created` over time
- **Auth events**: Trends chart showing `user_logged_in`, `user_login_failed`, and `user_logged_out` side by side
- **User churn signals**: Trends chart of `user_deactivated` and `user_deleted`
- **Meeting size breakdown**: Trends chart of `meeting_created` with `duration_minutes` as average aggregation

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-python/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
