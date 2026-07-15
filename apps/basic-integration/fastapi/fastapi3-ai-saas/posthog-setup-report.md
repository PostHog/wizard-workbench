# PostHog post-wizard report

The wizard has completed a FastAPI server-side PostHog integration. The Python SDK is initialized during the application lifespan using environment-based configuration, with exception autocapture enabled and client shutdown registered for reliable delivery. Authenticated business operations now capture events using stable database user IDs; email addresses are only set as person properties, never event properties.

| Event name | Description | File |
| --- | --- | --- |
| `user_signed_up` | A visitor successfully creates an Acme AI account. | `app/routers/auth.py` |
| `user_logged_in` | An existing user successfully signs in to Acme AI. | `app/routers/auth.py` |
| `content_generated` | An authenticated user successfully generates AI content. | `app/routers/generate.py` |
| `api_key_created` | An authenticated user creates a new programmatic access key. | `app/routers/api_keys.py` |
| `api_key_revoked` | An authenticated user revokes an existing programmatic access key. | `app/routers/api_keys.py` |
| `account_email_updated` | An authenticated user successfully updates their account email address. | `app/routers/settings.py` |
| `password_changed` | An authenticated user successfully changes their password. | `app/routers/settings.py` |

## Next steps

A dashboard and notebook could not be created because the configured PostHog MCP endpoint was unavailable during setup. Once access is restored, create **Analytics basics (wizard)** with insights based on `user_signed_up`, `user_logged_in`, `content_generated`, `api_key_created`, and `api_key_revoked`.

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
