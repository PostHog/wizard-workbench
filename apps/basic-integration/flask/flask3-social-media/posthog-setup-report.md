# PostHog post-wizard report

The wizard integrated the PostHog Python SDK into the Flask application factory using environment-based configuration, automatic exception capture, and process-exit flushing. It identifies authenticated users with stable database IDs, keeps email and username on person profiles, captures key authentication and social-product actions without user-entered PII in event properties, and reports exceptions from Flask 500 handlers and background export jobs.

| Event | Description | File |
| --- | --- | --- |
| `user_registered` | A visitor successfully created an account through the web registration flow. | `app/auth/routes.py` |
| `user_logged_in` | A registered user successfully logged in through the web form. | `app/auth/routes.py` |
| `password_reset_requested` | A visitor submitted the password reset request flow. | `app/auth/routes.py` |
| `password_reset_completed` | A user successfully completed a password reset. | `app/auth/routes.py` |
| `post_created` | An authenticated user published a new post. | `app/main/routes.py` |
| `user_followed` | An authenticated user followed another user. | `app/main/routes.py` |
| `user_unfollowed` | An authenticated user unfollowed another user. | `app/main/routes.py` |
| `message_sent` | An authenticated user sent a private message. | `app/main/routes.py` |
| `post_export_requested` | An authenticated user requested an export of their posts. | `app/main/routes.py` |
| `api_user_created` | A user account was successfully created through the API. | `app/api/users.py` |
| `api_token_issued` | A user successfully obtained an API authentication token. | `app/api/tokens.py` |
| `api_token_revoked` | A user revoked their API authentication token. | `app/api/tokens.py` |

## Next steps

The PostHog MCP endpoint was unavailable during setup, so the live dashboard, insights, and notebook could not be created. Reconnect the PostHog MCP server and create an `Analytics basics (wizard)` dashboard using the event contract above.

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to `.env.example` and any bootstrap scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also identifies the authenticated user; identification currently occurs on registration, login, and API registration.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
