# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the Acme AI FastAPI SaaS application. The integration covers the full user lifecycle (signup → login → content generation → logout) and key business-critical events including credit exhaustion, API key management, and settings changes. PostHog is initialized in the FastAPI lifespan context manager and flushed on shutdown. A pure ASGI middleware automatically wraps each request in a PostHog context and identifies authenticated users by email.

| Event | Description | File |
|---|---|---|
| `user_signed_up` | Fired when a new user successfully completes registration | `app/routers/auth.py` |
| `user_logged_in` | Fired when a user successfully authenticates with email and password | `app/routers/auth.py` |
| `user_logged_out` | Fired when a user logs out | `app/routers/auth.py` |
| `content_generated` | Fired when AI content is successfully generated; includes generation_type, credits_used, credits_remaining, prompt_length | `app/routers/generate.py` |
| `credits_insufficient` | Fired when a user attempts to generate content but lacks sufficient credits (churn signal) | `app/routers/generate.py` |
| `api_key_created` | Fired when a user creates a new API key | `app/routers/api_keys.py` |
| `api_key_revoked` | Fired when a user revokes (deactivates) an API key | `app/routers/api_keys.py` |
| `settings_updated` | Fired when a user successfully updates their account settings | `app/routers/settings.py` |
| `password_changed` | Fired when a user successfully changes their password | `app/routers/settings.py` |
| `dashboard_viewed` | Fired when a user views their dashboard; top of engagement funnel | `app/routers/pages.py` |

## Next steps

Visit [PostHog Dashboards](https://us.posthog.com/project/2/dashboard) to create a dashboard named "Analytics basics (wizard)". Recommended insights to add:

1. **Signup → Login → Content Generated funnel** — Create a funnel insight at [PostHog Insights](https://us.posthog.com/project/2/insights/new) using `user_signed_up` → `user_logged_in` → `content_generated` to measure conversion rates.

2. **Content Generation trend over time** — Trend insight tracking `content_generated` broken down by `generation_type` (blog, email, social) to see which content type is most popular.

3. **Credits Insufficient (churn signal) trend** — Trend insight tracking `credits_insufficient` over time. Spikes here indicate users are hitting credit limits and potentially churning.

4. **Signup growth** — Trend insight for `user_signed_up` over time to track top-of-funnel growth.

5. **API key adoption** — Trend insight for `api_key_created` to track power user adoption of the API.

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to `.env.example` and any bootstrap scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — the middleware identifies users on every request, but verify that returning sessions are linked to the same PostHog person as their first login.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
