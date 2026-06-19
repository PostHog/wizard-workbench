<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Acme AI FastAPI SaaS application. PostHog is now initialized at app startup via the lifespan context manager, flushed on shutdown, and wrapped in a pure ASGI middleware that automatically identifies authenticated users on every request. Ten business-critical events are tracked across authentication, AI content generation, API key management, and account settings flows. User identity is linked on login and signup using `posthog.identify()` with the user's email as the distinct ID, ensuring server-side events are correctly attributed.

| Event Name | Description | File |
|---|---|---|
| `user_signed_up` | Fired when a new user successfully creates an account. | `app/routers/auth.py` |
| `user_logged_in` | Fired when a user successfully logs in with email and password. | `app/routers/auth.py` |
| `user_logged_out` | Fired when a user logs out of the application. | `app/routers/auth.py` |
| `content_generated` | Fired when AI content is successfully generated, tracking the type and credits used. | `app/routers/generate.py` |
| `generation_failed_insufficient_credits` | Fired when a generation attempt fails because the user has too few credits. | `app/routers/generate.py` |
| `api_key_created` | Fired when a user creates a new API key. | `app/routers/api_keys.py` |
| `api_key_revoked` | Fired when a user revokes (deactivates) an API key. | `app/routers/api_keys.py` |
| `settings_updated` | Fired when a user successfully updates their account settings. | `app/routers/settings.py` |
| `password_changed` | Fired when a user successfully changes their password. | `app/routers/settings.py` |
| `dashboard_viewed` | Fired when a logged-in user views the main dashboard. | `app/routers/pages.py` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) Dashboard](https://us.i.posthog.com/project/2/dashboard/1799038)
- [User Signups Over Time](https://us.i.posthog.com/project/2/insights/9404946)
- [Signup to Generation Funnel](https://us.i.posthog.com/project/2/insights/9404947)
- [Content Generation by Type](https://us.i.posthog.com/project/2/insights/9404948)
- [Credit Exhaustion Events](https://us.i.posthog.com/project/2/insights/9404949)
- [API Key Creation Rate](https://us.i.posthog.com/project/2/insights/9404950)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to `.env.example` and any bootstrap scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
