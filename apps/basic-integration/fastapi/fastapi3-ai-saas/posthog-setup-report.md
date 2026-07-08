# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Acme AI FastAPI SaaS application. The following changes were made:

- **`requirements.txt`** — Added `posthog>=3.0.0` dependency.
- **`.env`** — Added `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` environment variables.
- **`app/config.py`** — Added `posthog_project_token`, `posthog_host`, and `posthog_disabled` fields to the `Settings` class.
- **`app/middleware.py`** — Created `PostHogMiddleware` (pure ASGI) that wraps every HTTP request in a `new_context()` and identifies authenticated users from the session cookie.
- **`app/main.py`** — Imported and registered `PostHogMiddleware`; added PostHog init (`posthog.api_key`, `posthog.host`, `posthog.debug`) on startup and `posthog.flush()` on shutdown inside the lifespan context manager.
- **`app/routers/auth.py`** — Added `posthog.identify()` + `identify_context()` + `capture()` calls for `user_signed_up`, `user_logged_in`, and `user_logged_out` events.
- **`app/routers/generate.py`** — Added `capture()` calls for `content_generated` (on success) and `insufficient_credits` (on the 402 path).
- **`app/routers/api_keys.py`** — Added `capture()` calls for `api_key_created` and `api_key_revoked`.
- **`app/routers/settings.py`** — Added `capture()` calls for `settings_updated` and `password_changed`.

| Event | Description | File |
|---|---|---|
| `user_signed_up` | Fired when a new user successfully registers an account. | `app/routers/auth.py` |
| `user_logged_in` | Fired when a user successfully authenticates with email and password. | `app/routers/auth.py` |
| `user_logged_out` | Fired when a user ends their session by logging out. | `app/routers/auth.py` |
| `content_generated` | Fired when AI content is successfully generated, capturing the type and credits consumed. | `app/routers/generate.py` |
| `insufficient_credits` | Fired when a user attempts to generate content but lacks the required credits. | `app/routers/generate.py` |
| `api_key_created` | Fired when a user creates a new API key for programmatic access. | `app/routers/api_keys.py` |
| `api_key_revoked` | Fired when a user deactivates an existing API key. | `app/routers/api_keys.py` |
| `settings_updated` | Fired when a user saves updated account settings such as email. | `app/routers/settings.py` |
| `password_changed` | Fired when a user successfully changes their account password. | `app/routers/settings.py` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://us.posthog.com/project/483112/dashboard/1818059)
- [Daily signups & logins](https://us.posthog.com/project/483112/insights/mVrGjhi3)
- [Signup to first generation funnel](https://us.posthog.com/project/483112/insights/FUDnzHQ7)
- [Content generations by type](https://us.posthog.com/project/483112/insights/CCZUnuCS)
- [Insufficient credits (churn signal)](https://us.posthog.com/project/483112/insights/5Apa3963)
- [API key activity](https://us.posthog.com/project/483112/insights/Y2AFhzLZ)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
