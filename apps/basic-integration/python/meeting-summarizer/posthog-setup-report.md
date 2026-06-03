<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the AI Meeting Summarizer Python application. The `posthog` Python SDK was added as a dependency alongside `python-dotenv` for environment variable management. A module-level PostHog client is initialized in `server.py` using the instance-based `Posthog()` constructor with `enable_exception_autocapture=True`, and is registered with `atexit` to flush events on server shutdown. `user_service.py` received its own client instance, shut down explicitly in the `shutdown()` method. All PostHog credentials are read from environment variables — never hardcoded.

Ten events were instrumented across two files, covering authentication, user management, and the core meeting summarization flow. Person properties (username) are set on login and registration via `posthog_client.set()`. No PII is sent in event properties.

| Event | Description | File |
|---|---|---|
| `user_logged_in` | Fired when a user successfully authenticates | `server.py` |
| `user_login_failed` | Fired when a login attempt is rejected (user not found or inactive) | `server.py` |
| `user_logged_out` | Fired when a user explicitly logs out | `server.py` |
| `user_registered` | Fired when a new user account is successfully created via the API | `server.py` |
| `user_profile_updated` | Fired when a user's profile is updated | `server.py` |
| `user_deleted` | Fired when a user account is permanently deleted | `server.py` |
| `meeting_created` | Fired when a transcript is submitted, AI-analyzed, and stored. Properties: `transcript_word_count`, `action_item_count`, `key_point_count`, `participant_count`, `duration_minutes` | `server.py` |
| `meeting_viewed` | Fired when a user retrieves a specific meeting's details. Properties: `duration_minutes`, `action_item_count`, `key_point_count`, `participant_count` | `server.py` |
| `meeting_deleted` | Fired when a user deletes a meeting | `server.py` |
| `user_deactivated` | Fired when a user is soft-deleted via the management service | `user_service.py` |

## Next steps

A PostHog dashboard could not be created automatically because the configured API key is missing the required scopes (`dashboard:write`, `insight:write`, `query:read`). To create a dashboard, add those scopes to your PostHog personal API key, then re-run the wizard or create insights manually in [PostHog](/insights).

Suggested insights to build in [PostHog](/insights):

- **Login funnel** — `user_logged_in` → `meeting_created` (measures how many logged-in users actually submit a transcript)
- **Meeting creation trend** — `meeting_created` over time (tracks core value delivery)
- **Login failures trend** — `user_login_failed` over time (identifies authentication friction)
- **Churn signals** — `user_deleted` and `user_deactivated` combined over time
- **Meeting engagement** — `meeting_viewed` volume compared to `meeting_created` (are users revisiting their summaries?)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
