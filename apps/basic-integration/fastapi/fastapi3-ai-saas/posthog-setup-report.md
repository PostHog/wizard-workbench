<wizard-report>
# PostHog post-wizard report

The wizard has completed a full PostHog analytics integration for the Acme AI FastAPI SaaS application. The `posthog` Python SDK (v3+) was installed and wired into the app startup lifecycle. A `PostHogMiddleware` wraps every HTTP request in a PostHog context and identifies authenticated users by their internal integer ID (not their email, to avoid PII in event properties). Nine business-critical events are now captured across four router files, covering the full user journey from signup through AI content generation, API key management, and account settings.

| Event name | Description | File |
|---|---|---|
| `user_signed_up` | Fired when a new user successfully completes account registration. | `app/routers/auth.py` |
| `user_logged_in` | Fired when an existing user successfully authenticates with email and password. | `app/routers/auth.py` |
| `user_logged_out` | Fired when a user explicitly logs out of the application. | `app/routers/auth.py` |
| `content_generated` | Fired when a user successfully generates AI content (blog, email, or social post). | `app/routers/generate.py` |
| `content_generation_failed` | Fired when a content generation request fails due to insufficient credits. | `app/routers/generate.py` |
| `api_key_created` | Fired when a user creates a new API key. | `app/routers/api_keys.py` |
| `api_key_revoked` | Fired when a user revokes (deactivates) an existing API key. | `app/routers/api_keys.py` |
| `settings_updated` | Fired when a user successfully updates their account settings (e.g. email). | `app/routers/settings.py` |
| `password_changed` | Fired when a user successfully changes their account password. | `app/routers/settings.py` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1824446)
- [User signups over time](https://us.posthog.com/project/483112/insights/nFTAD3y2)
- [Signup to content generation funnel](https://us.posthog.com/project/483112/insights/ZWU5FLVu)
- [Content generations by type](https://us.posthog.com/project/483112/insights/mzXw7Gv7)
- [Failed generations (insufficient credits)](https://us.posthog.com/project/483112/insights/Guu9kxPf)
- [Login vs logout trend](https://us.posthog.com/project/483112/insights/ry8GC0uG)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to `.env.example` and any bootstrap scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — the middleware identifies users on every request, but verify that the `PostHogMiddleware` correctly resolves the session cookie in your deployment environment.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
</wizard-report>
