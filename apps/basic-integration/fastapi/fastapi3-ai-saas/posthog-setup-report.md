<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the Acme AI FastAPI SaaS application. Changes were made to initialize PostHog via the lifespan context manager, add per-request user identification through ASGI middleware, and instrument ten key business events across authentication, content generation, API key management, settings, and the dashboard page.

| Event name | Description | File |
|---|---|---|
| `user_signed_up` | Fires when a new user successfully creates an account via the signup form. | `app/routers/auth.py` |
| `user_logged_in` | Fires when a user successfully authenticates via the login form. | `app/routers/auth.py` |
| `user_logged_out` | Fires when a user explicitly logs out of the application. | `app/routers/auth.py` |
| `content_generated` | Fires when a user successfully generates AI content, recording the type and credits used. | `app/routers/generate.py` |
| `insufficient_credits` | Fires when a content generation request fails due to the user having too few credits. | `app/routers/generate.py` |
| `api_key_created` | Fires when a user creates a new API key for programmatic access. | `app/routers/api_keys.py` |
| `api_key_revoked` | Fires when a user revokes (deactivates) an existing API key. | `app/routers/api_keys.py` |
| `settings_updated` | Fires when a user successfully updates their account settings such as email. | `app/routers/settings.py` |
| `password_changed` | Fires when a user successfully changes their account password. | `app/routers/settings.py` |
| `dashboard_viewed` | Fires when an authenticated user loads the main dashboard page. | `app/routers/pages.py` |

## Files changed

- **`requirements.txt`** — Added `posthog>=3.0.0` dependency.
- **`.env`** — Added `POSTHOG_PROJECT_TOKEN`, `POSTHOG_HOST`, and `POSTHOG_DISABLED` environment variables.
- **`app/config.py`** — Added `posthog_project_token`, `posthog_host`, and `posthog_disabled` fields to `Settings`.
- **`app/main.py`** — Imported and registered `PostHogMiddleware`; added PostHog initialization on startup and `posthog.flush()` on shutdown in the lifespan context manager.
- **`app/middleware.py`** — Implemented `PostHogMiddleware` as a pure ASGI middleware that wraps each HTTP request in a `new_context()` and calls `identify_context(user.email)` for authenticated users.
- **`app/routers/auth.py`** — Added `user_logged_in`, `user_signed_up`, and `user_logged_out` events; uses `identify_context()` and `tag()` on login and signup so events are tied to the correct distinct ID.
- **`app/routers/generate.py`** — Added `content_generated` event with type, credits, and prompt length properties; `insufficient_credits` event as a churn signal; and `posthog.capture_exception()` around the generation logic.
- **`app/routers/api_keys.py`** — Added `api_key_created` and `api_key_revoked` events.
- **`app/routers/settings.py`** — Added `settings_updated` event (email change) and `password_changed` event.
- **`app/routers/pages.py`** — Added `dashboard_viewed` event with credits remaining property.

## Next steps

Dashboard creation was not completed in this run because the CI environment API key does not have `dashboard:write` scope. Once you have a PostHog personal API key with the appropriate scopes (or use the PostHog UI), create a dashboard named **"Analytics basics (wizard)"** with these suggested insights:

1. **Signup → Login → Generate funnel** — `user_signed_up` → `user_logged_in` → `content_generated`
2. **Content generation by type** — `content_generated` broken down by `generation_type`
3. **Insufficient credits (churn signal)** — trend of `insufficient_credits` events
4. **Daily active users** — unique users who triggered `user_logged_in`
5. **API key adoption** — trend of `api_key_created`

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_PROJECT_TOKEN`, `POSTHOG_HOST`, and `POSTHOG_DISABLED` to `.env.example` and any bootstrap scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — the middleware identifies users on every authenticated request, so this should be covered, but verify that returning users show up with their email as the distinct ID rather than an anonymous ID.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
