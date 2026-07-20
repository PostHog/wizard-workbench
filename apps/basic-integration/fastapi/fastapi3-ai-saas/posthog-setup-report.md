# PostHog post-wizard report

The wizard added server-side PostHog analytics to this FastAPI SaaS. It configured an instance-based Python client from environment variables, enabled exception autocapture, flushes events during application shutdown, and registers a final shutdown hook. Authentication now associates a stable database user ID with email as a person property, while business events contain only non-PII operational metadata.

| Event | Description | File |
|---|---|---|
| `user_signed_up` | A visitor successfully creates an account using the signup form. | `app/routers/auth.py` |
| `user_logged_in` | A registered user successfully logs in with a password. | `app/routers/auth.py` |
| `user_logged_out` | An authenticated user logs out of the application. | `app/routers/auth.py` |
| `generation_completed` | An authenticated user successfully generates AI content and consumes credits. | `app/routers/generate.py` |
| `generation_blocked_insufficient_credits` | A content generation attempt is blocked because the user lacks enough credits. | `app/routers/generate.py` |
| `api_key_created` | An authenticated user creates a new API key. | `app/routers/api_keys.py` |
| `api_key_revoked` | An authenticated user revokes one of their API keys. | `app/routers/api_keys.py` |
| `account_email_updated` | An authenticated user successfully changes the email associated with their account. | `app/routers/settings.py` |
| `account_password_changed` | An authenticated user successfully changes their account password. | `app/routers/settings.py` |

## Next steps

Dashboard and insight creation could not be completed because the configured PostHog MCP endpoint was unavailable during this run. Reconnect the PostHog MCP and create **Analytics basics (wizard)** with signup-to-generation conversion, generation volume by type, insufficient-credit blocks, API key lifecycle, and account security activity.

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names to any monorepo/bootstrap scripts so collaborators know what to set; `.env.example` has already been updated.
- [ ] Confirm the returning-visitor path also associates the stable user ID with PostHog — identification currently occurs on signup, login, and email change.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
