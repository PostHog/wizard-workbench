<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of your FastAPI project. PostHog was added as a dependency, environment-backed settings were introduced for the project token and host, a shared PostHog client was initialized for application startup and shutdown, and reusable helpers were added to keep user identification and event capture consistent across authenticated routes. Server-side analytics were instrumented for signup, login, logout, dashboard usage, AI generation success and credit failures, API key lifecycle actions, usage views, and account settings updates.

| Event name | Description | File |
| --- | --- | --- |
| signup_completed | Captures when a new account is successfully created and the user is signed in. | app/routers/auth.py |
| login_succeeded | Captures when an existing user successfully authenticates and starts a session. | app/routers/auth.py |
| logout_completed | Captures when an authenticated user ends their session. | app/routers/auth.py |
| dashboard_viewed | Captures when an authenticated user loads the main dashboard. | app/routers/pages.py |
| content_generated | Captures when AI content generation succeeds for a selected content type. | app/routers/generate.py |
| generation_blocked_insufficient_credits | Captures when a generation request is rejected because the user lacks credits. | app/routers/generate.py |
| credits_viewed | Captures when a user requests their current remaining credit balance. | app/routers/generate.py |
| api_key_created | Captures when a user successfully creates a new API key. | app/routers/api_keys.py |
| api_key_revoked | Captures when a user revokes an existing API key. | app/routers/api_keys.py |
| api_key_creation_blocked_limit | Captures when API key creation is blocked because the active key limit was reached. | app/routers/api_keys.py |
| usage_viewed | Captures when a user loads usage statistics and recent generation history. | app/routers/usage.py |
| settings_viewed | Captures when a user opens the account settings page. | app/routers/settings.py |
| email_updated | Captures when a user successfully changes their account email. | app/routers/settings.py |
| password_changed | Captures when a user successfully updates their password. | app/routers/settings.py |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1831022)
- [Signups over time (wizard)](https://us.posthog.com/project/483112/insights/acP3YsSU)
- [Signup to generation funnel (wizard)](https://us.posthog.com/project/483112/insights/670LgQeW)
- [Content generation by type (wizard)](https://us.posthog.com/project/483112/insights/LvctVSSJ)
- [API key lifecycle (wizard)](https://us.posthog.com/project/483112/insights/BMLM8FB1)
- [Credit blocks by generation type (wizard)](https://us.posthog.com/project/483112/insights/q23xDW0c)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
