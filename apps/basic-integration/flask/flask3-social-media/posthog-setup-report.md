# PostHog post-wizard report

PostHog has been integrated into the Flask application using the Python SDK. The SDK is initialized once during application creation from `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST`, exception autocapture is enabled, and shutdown is registered with `atexit`. Authentication, posting, social, messaging, export, and server error flows now emit analytics events. User properties are sent with `set()` while event properties contain only non-PII metadata.

| Event | Description | File |
|---|---|---|
| `user_logged_in` | Tracks a successful user login. | `app/auth/routes.py` |
| `user_signed_up` | Tracks a completed user registration. | `app/auth/routes.py` |
| `user_logged_out` | Tracks a user logout. | `app/auth/routes.py` |
| `post_created` | Tracks when an authenticated user publishes a post. | `app/main/routes.py` |
| `user_followed` | Tracks when a user successfully follows another user. | `app/main/routes.py` |
| `user_unfollowed` | Tracks when a user successfully unfollows another user. | `app/main/routes.py` |
| `message_sent` | Tracks when a user successfully sends a direct message. | `app/main/routes.py` |
| `post_export_started` | Tracks when a user starts an asynchronous post export. | `app/main/routes.py` |
| `post_export_failed` | Tracks when an asynchronous post export fails. | `app/tasks.py` |

## Next steps

A live dashboard and notebook could not be created because the PostHog MCP server was unavailable during this run.

## Verify before merging

- [ ] Run a full production build and fix any lint or type errors introduced by the integration.
- [ ] Run the test suite; instrumented call sites may require updated mocks or fixtures.
- [ ] Add `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to `.env.example` and deployment/bootstrap configuration.
- [ ] Confirm returning authenticated visitors are identified, not only users who freshly log in.

### Agent skill

The integration skill remains in `.claude/skills/integration-flask/` for future development.
