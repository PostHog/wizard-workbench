# PostHog post-wizard report

PostHog has been integrated into the FastAPI SaaS application using the Python SDK. The SDK is initialized during the FastAPI lifespan with configuration loaded from environment variables, flushed on shutdown, and configured for exception autocapture. Authentication, content generation, API key management, settings, and password-change actions now capture stable user-scoped analytics events. Person email data is sent through person properties rather than event properties.

| Event | Description | File |
|---|---|---|
| `user_signed_up` | Tracks successful account creation. | `app/routers/auth.py` |
| `user_logged_in` | Tracks successful user authentication. | `app/routers/auth.py` |
| `user_logged_out` | Tracks when an authenticated user ends their session. | `app/routers/auth.py` |
| `content_generated` | Tracks successful AI content generation with type and credit usage metadata. | `app/routers/generate.py` |
| `generation_failed_insufficient_credits` | Tracks generation attempts blocked because the user lacks enough credits. | `app/routers/generate.py` |
| `api_key_created` | Tracks successful API-key creation without sending the key value. | `app/routers/api_keys.py` |
| `api_key_revoked` | Tracks successful API-key revocation. | `app/routers/api_keys.py` |
| `settings_updated` | Tracks successful account settings changes without sending entered profile data. | `app/routers/settings.py` |
| `password_changed` | Tracks successful password changes. | `app/routers/settings.py` |

## Next steps

Dashboard creation was unavailable because the PostHog MCP server could not connect in this run. No dashboard, insights, or notebook links were created.

## Verify before merging

- [ ] Run a full production build and fix any lint or type errors introduced by the integration.
- [ ] Run the test suite and update mocks or fixtures for the instrumented call sites.
- [ ] Add `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to `.env.example` and any bootstrap documentation used by collaborators.
- [ ] Confirm the returning-visitor path identifies authenticated users, not only fresh login and signup requests.

### Agent skill

The integration skill context is available in `.claude/skills/integration-fastapi` for future agent development.
