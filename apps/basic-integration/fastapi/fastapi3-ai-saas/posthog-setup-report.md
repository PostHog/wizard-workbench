<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the Acme AI FastAPI SaaS application. The `posthog` Python SDK is now installed and wired into the app lifecycle. A `Posthog` client instance is created at startup (in `app/main.py`) using environment variables, flushed on shutdown, and exposed to all route handlers via a FastAPI dependency (`PostHogClient`). User identification is performed on every login and signup using `posthog.set()`. Ten server-side events now cover the full user journey from signup to content generation and account management.

## Changes made

| File | Change |
|------|--------|
| `requirements.txt` | Added `posthog>=3.0.0` |
| `.env` | Added `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` |
| `app/config.py` | Added `posthog_project_token` and `posthog_host` settings fields |
| `app/main.py` | Initialised `Posthog` client at module level; registered `atexit` shutdown; added `posthog_client.flush()` to lifespan shutdown |
| `app/dependencies.py` | Added `get_posthog()` provider and `PostHogClient` type alias for dependency injection |
| `app/routers/auth.py` | Captures `user_signed_up`, `user_logged_in`, `login_failed`, `user_logged_out`; sets person properties on login and signup |
| `app/routers/generate.py` | Captures `content_generated`, `content_generation_failed` |
| `app/routers/api_keys.py` | Captures `api_key_created`, `api_key_revoked` |
| `app/routers/settings.py` | Captures `settings_updated`, `password_changed` |

## Events instrumented

| Event name | Description | File |
|---|---|---|
| `user_signed_up` | New user account created via the signup form | `app/routers/auth.py` |
| `user_logged_in` | User successfully authenticated | `app/routers/auth.py` |
| `login_failed` | Login attempt failed (invalid credentials) | `app/routers/auth.py` |
| `user_logged_out` | User logged out of their session | `app/routers/auth.py` |
| `content_generated` | AI content successfully generated; includes `generation_type`, `credits_used`, `credits_remaining`, `prompt_length` | `app/routers/generate.py` |
| `content_generation_failed` | Generation failed due to insufficient credits; includes `generation_type`, `credits_needed`, `credits_available` | `app/routers/generate.py` |
| `api_key_created` | User created a new API key | `app/routers/api_keys.py` |
| `api_key_revoked` | User deactivated an API key | `app/routers/api_keys.py` |
| `settings_updated` | User successfully updated their email | `app/routers/settings.py` |
| `password_changed` | User successfully changed their password | `app/routers/settings.py` |

## Next steps

We recommend building an **"Analytics basics"** dashboard in PostHog with these five insights:

1. **Signup conversion funnel** — Funnel: `user_signed_up` → `user_logged_in` → `content_generated`
   - Reveals where users drop off between registration and first use
2. **Content generation volume** — Trend: `content_generated` broken down by `generation_type` (blog / email / social)
   - Shows which content types are most popular
3. **Credit exhaustion rate** — Trend: `content_generation_failed` where `failure_reason = insufficient_credits`
   - Early warning for churn — users who hit the credit wall without upgrading
4. **API key adoption** — Trend: `api_key_created` and `api_key_revoked` over time
   - Indicates power-user engagement and potential churn signal
5. **Daily active users** — Trend: `user_logged_in` with unique users, daily breakdown
   - Core engagement health metric

Create the dashboard here: https://us.posthog.com/project/2/dashboard/new

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-fastapi/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
