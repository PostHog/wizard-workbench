<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Acme AI FastAPI SaaS application. A `Posthog` client instance (with `enable_exception_autocapture=True`) is initialized in a new `app/analytics.py` module and registered for graceful shutdown via `atexit`. A pure ASGI `PostHogMiddleware` (added to `app/middleware.py`) wraps every HTTP request in a `new_context()` and automatically identifies authenticated users from the session cookie, so all downstream route handlers capture events under the correct `distinct_id` without extra boilerplate. User identification is also performed explicitly at login and signup time using `identify_context()`. The lifespan in `app/main.py` calls `posthog_client.flush()` on shutdown to ensure no events are lost. Environment variables (`POSTHOG_PROJECT_TOKEN`, `POSTHOG_HOST`) are stored in `.env` and read through the Pydantic `Settings` class.

| Event name | Description | File |
|---|---|---|
| `user_signed_up` | Fired when a new user completes the signup form and account is created. | `app/routers/auth.py` |
| `user_logged_in` | Fired when a user successfully authenticates via the login form. | `app/routers/auth.py` |
| `user_logged_out` | Fired when a user explicitly logs out of their session. | `app/routers/auth.py` |
| `content_generated` | Fired when a user successfully generates AI content, capturing type and credits used. | `app/routers/generate.py` |
| `generation_failed_insufficient_credits` | Fired when a content generation attempt fails because the user lacks sufficient credits. | `app/routers/generate.py` |
| `api_key_created` | Fired when a user creates a new API key for programmatic access. | `app/routers/api_keys.py` |
| `api_key_revoked` | Fired when a user deactivates an existing API key. | `app/routers/api_keys.py` |
| `settings_updated` | Fired when a user saves changes to their account settings (e.g., email). | `app/routers/settings.py` |
| `password_changed` | Fired when a user successfully changes their account password. | `app/routers/settings.py` |
| `dashboard_viewed` | Fired when a user loads the main dashboard page. | `app/routers/pages.py` |
| `usage_stats_viewed` | Fired when a user fetches their usage history and statistics. | `app/routers/usage.py` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://us.posthog.com/project/483112/dashboard/1777424)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — the middleware identifies users from the session cookie on every request, but verify this works correctly after session renewal or cookie expiry.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
