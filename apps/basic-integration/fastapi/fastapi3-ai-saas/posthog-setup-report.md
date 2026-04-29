<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Acme AI FastAPI SaaS application. The following changes were made:

- **`app/config.py`** — Added `posthog_project_token`, `posthog_host`, and `posthog_disabled` fields to `Settings`, loaded from environment variables.
- **`app/middleware.py`** — Implemented `PostHogMiddleware` (pure ASGI), which wraps every HTTP request in a PostHog context and automatically identifies authenticated users by their numeric ID.
- **`app/main.py`** — Initializes PostHog (`posthog.api_key`, `posthog.host`) on app startup and calls `posthog.flush()` on shutdown; adds `PostHogMiddleware` to the app.
- **`app/routers/auth.py`** — Captures `user_signed_up` (with `signup_method`, `initial_credits`) and `user_logged_in` (with `login_method`) events; calls `posthog.identify()` to set the `email` person property on both; captures `user_logged_out` on logout.
- **`app/routers/generate.py`** — Captures `content_generated` (with `generation_type`, `credits_used`, `credits_remaining`) on success; captures `generation_failed_insufficient_credits` (with `generation_type`, `credits_needed`, `credits_available`) before raising the 402 error.
- **`app/routers/api_keys.py`** — Captures `api_key_created` and `api_key_revoked` events.
- **`app/routers/settings.py`** — Captures `settings_updated` (with `field_changed: "email"`) on a successful email change; captures `password_changed` on a successful password update.
- **`requirements.txt`** — Added `posthog>=3.0.0`.
- **`.env`** — Added `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST`.

| Event | Description | File |
|---|---|---|
| `user_signed_up` | New user completed registration via the signup form | `app/routers/auth.py` |
| `user_logged_in` | User successfully logged in with email and password | `app/routers/auth.py` |
| `user_logged_out` | User explicitly logged out | `app/routers/auth.py` |
| `content_generated` | AI content successfully generated; includes generation_type, credits_used, credits_remaining | `app/routers/generate.py` |
| `generation_failed_insufficient_credits` | Generation attempt failed due to insufficient credits | `app/routers/generate.py` |
| `api_key_created` | User created a new API key | `app/routers/api_keys.py` |
| `api_key_revoked` | User revoked (deactivated) an API key | `app/routers/api_keys.py` |
| `settings_updated` | User successfully updated their account settings | `app/routers/settings.py` |
| `password_changed` | User successfully changed their password | `app/routers/settings.py` |

## Next steps

Create an **"Analytics basics"** dashboard in PostHog with the insights below. Click each link to open a pre-configured insight in your project:

- **Signup → First Generation funnel** — Track conversion from `user_signed_up` → `content_generated`: [Create funnel](https://us.posthog.com/project/2/insights/new#{"insight":"FUNNELS","events":[{"id":"user_signed_up","name":"user_signed_up","type":"events","order":0},{"id":"content_generated","name":"content_generated","type":"events","order":1}]})

- **Content generation trend by type** — `content_generated` event broken down by `generation_type`: [Create trend](https://us.posthog.com/project/2/insights/new#{"insight":"TRENDS","events":[{"id":"content_generated","name":"content_generated","type":"events","math":"total"}],"breakdown":"generation_type","breakdown_type":"event"})

- **Credit depletion (churn signal) trend** — `generation_failed_insufficient_credits` over time: [Create trend](https://us.posthog.com/project/2/insights/new#{"insight":"TRENDS","events":[{"id":"generation_failed_insufficient_credits","name":"generation_failed_insufficient_credits","type":"events","math":"total"}]})

- **New signups over time** — `user_signed_up` trend: [Create trend](https://us.posthog.com/project/2/insights/new#{"insight":"TRENDS","events":[{"id":"user_signed_up","name":"user_signed_up","type":"events","math":"total"}]})

- **API key lifecycle** — `api_key_created` vs `api_key_revoked` side-by-side: [Create trend](https://us.posthog.com/project/2/insights/new#{"insight":"TRENDS","events":[{"id":"api_key_created","name":"api_key_created","type":"events","math":"total"},{"id":"api_key_revoked","name":"api_key_revoked","type":"events","math":"total"}]})

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
