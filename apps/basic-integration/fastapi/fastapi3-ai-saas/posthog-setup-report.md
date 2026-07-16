# PostHog post-wizard report

The wizard completed a server-side PostHog integration for this FastAPI SaaS. It added the `posthog` dependency, configured the SDK from `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST`, initializes a shared client with exception autocapture, flushes analytics during FastAPI shutdown, and registers shutdown handling at process exit. Authenticated users are identified with their stable database user ID; email is set only as a person property and is never included in event properties.

The integration captures signup, login, logout, successful and blocked content generation, API key lifecycle changes, and successful account settings actions. Event properties are limited to operational metadata such as generation type, credits, and active API key count; prompts, generated content, emails, API key names, and API key values are excluded.

| Event name | Description | File |
| --- | --- | --- |
| `user_signed_up` | Tracks successful creation of a new account. | `app/routers/auth.py` |
| `user_logged_in` | Tracks successful user authentication. | `app/routers/auth.py` |
| `user_logged_out` | Tracks authenticated users ending their session. | `app/routers/auth.py` |
| `content_generated` | Tracks successful AI content generation with selected content type and credit usage. | `app/routers/generate.py` |
| `generation_blocked` | Tracks attempts to generate content without sufficient credits. | `app/routers/generate.py` |
| `api_key_created` | Tracks successful API key creation without exposing the key or user-entered name. | `app/routers/api_keys.py` |
| `api_key_revoked` | Tracks successful API key revocation. | `app/routers/api_keys.py` |
| `email_updated` | Tracks successful account email changes. | `app/routers/settings.py` |
| `password_changed` | Tracks successful password updates. | `app/routers/settings.py` |

## Next steps

- Dashboard and insights: not created because the configured PostHog MCP endpoint was unavailable during setup.
- Shareable notebook: not created for the same reason.

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
