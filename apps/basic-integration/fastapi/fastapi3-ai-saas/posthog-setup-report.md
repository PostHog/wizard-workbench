<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Acme AI FastAPI SaaS application. A `Posthog()` client instance (instance-based API) was initialized in a dedicated `app/posthog_client.py` module with `enable_exception_autocapture=True` and `atexit.register(posthog_client.shutdown)` for reliable event flushing. A `PostHogMiddleware` was added to `app/main.py` that wraps every HTTP request in a `new_context()` and calls `identify_context(str(user.id))` for authenticated users, so all events within a request are automatically attributed to the correct user. Nine business-critical events were instrumented across four router files covering the full user lifecycle: registration, authentication, AI content generation, API key management, and account settings. Environment variables `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` were added to `.env` and wired into `app/config.py` via Pydantic Settings — no secrets are hardcoded.

| Event name | Description | File |
|---|---|---|
| `user_signed_up` | A new user successfully registers for an account. | `app/routers/auth.py` |
| `user_logged_in` | A user successfully authenticates and logs in. | `app/routers/auth.py` |
| `user_logged_out` | A user logs out of their session. | `app/routers/auth.py` |
| `content_generated` | A user successfully generates AI content, consuming credits. | `app/routers/generate.py` |
| `content_generation_failed` | A content generation request failed due to insufficient credits. | `app/routers/generate.py` |
| `api_key_created` | A user creates a new API key for programmatic access. | `app/routers/api_keys.py` |
| `api_key_revoked` | A user deactivates an existing API key. | `app/routers/api_keys.py` |
| `settings_updated` | A user successfully updates their account settings. | `app/routers/settings.py` |
| `password_changed` | A user successfully changes their account password. | `app/routers/settings.py` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) Dashboard](https://us.posthog.com/project/483112/dashboard/1787343)
- [Conversion Funnel: Signup to Content Generated](https://us.posthog.com/project/483112/insights/HUGi7gl3)
- [Content Generation by Type](https://us.posthog.com/project/483112/insights/KtH8kMqr)
- [Credit Exhaustion Rate](https://us.posthog.com/project/483112/insights/fPISNlbJ)
- [Daily Active Users](https://us.posthog.com/project/483112/insights/P8MXzW5h)
- [New Signups & API Key Adoption](https://us.posthog.com/project/483112/insights/S70M1xpS)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to `.env.example` and any bootstrap scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — the `PostHogMiddleware` identifies users on every authenticated request, but verify that session restoration after a cookie expiry still correctly re-identifies the user in PostHog.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
