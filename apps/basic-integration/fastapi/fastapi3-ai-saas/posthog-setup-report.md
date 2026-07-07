# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Acme AI FastAPI SaaS application. Changes were made across 7 files: the app configuration, lifespan startup, a new ASGI middleware for per-request user context, and all five router modules. PostHog is initialised once at startup via `posthog.api_key` / `posthog.host` in the lifespan context manager, flushed on shutdown, and a pure-ASGI `PostHogMiddleware` wraps every HTTP request in a `new_context()` — automatically calling `identify_context(user.email)` for authenticated sessions so downstream `capture()` calls inherit the user identity without any extra plumbing.

| Event name | Description | File |
|---|---|---|
| `user_signed_up` | A new user completes the signup form and creates an account. | `app/routers/auth.py` |
| `user_logged_in` | An existing user successfully authenticates via the login form. | `app/routers/auth.py` |
| `user_logged_out` | A user ends their session by logging out. | `app/routers/auth.py` |
| `content_generated` | A user successfully generates AI content, consuming credits. | `app/routers/generate.py` |
| `generation_failed_insufficient_credits` | A content generation attempt was rejected due to insufficient credits. | `app/routers/generate.py` |
| `api_key_created` | A user creates a new API key for programmatic access. | `app/routers/api_keys.py` |
| `api_key_revoked` | A user deactivates an existing API key. | `app/routers/api_keys.py` |
| `settings_updated` | A user saves changes to their account settings (e.g. email). | `app/routers/settings.py` |
| `password_changed` | A user successfully changes their account password. | `app/routers/settings.py` |
| `dashboard_viewed` | A user views the main dashboard page. | `app/routers/pages.py` |
| `usage_stats_viewed` | A user fetches their usage statistics and generation history. | `app/routers/usage.py` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://us.posthog.com/project/483112/dashboard/1812164)
- [Signup to first generation funnel](https://us.posthog.com/project/483112/insights/xhVt6IWi) — tracks conversion from signup to first AI content generation
- [Content generations over time](https://us.posthog.com/project/483112/insights/nUhfDtGc) — daily generation volume broken down by type (blog, email, social)
- [New signups over time](https://us.posthog.com/project/483112/insights/LmADh40g) — daily new user registrations trend
- [Insufficient credits attempts](https://us.posthog.com/project/483112/insights/93l9KvwY) — churn-risk signal: users blocked by credit limits
- [User retention after signup](https://us.posthog.com/project/483112/insights/jc6EOpxk) — how many signed-up users return to generate content in subsequent days

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — the middleware identifies authenticated users on every request, but verify that session-resuming users (returning visitors with a valid cookie) are correctly identified before their events are captured.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
