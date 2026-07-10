<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of this Flask microblog application with PostHog. The integration installs the Python SDK dependency, adds environment-based PostHog configuration, initializes a shared PostHog client during app startup, and captures analytics across key authentication, social, API, export, and error-handling flows. It also adds person property updates for identified users during registration, login, profile edits, API token creation, and API user creation, while keeping PII on person profiles instead of event payloads.

| Event name | Description | File |
| --- | --- | --- |
| user_registered | Captures when a new user account is created through the registration form. | app/auth/routes.py |
| user_logged_in | Captures when an existing user successfully logs in with a username and password. | app/auth/routes.py |
| profile_updated | Captures when an authenticated user saves profile changes. | app/main/routes.py |
| post_created | Captures when an authenticated user publishes a new post. | app/main/routes.py |
| user_followed | Captures when a user follows another account. | app/main/routes.py |
| user_unfollowed | Captures when a user unfollows another account. | app/main/routes.py |
| message_sent | Captures when a user sends a direct message to another user. | app/main/routes.py |
| posts_export_requested | Captures when a user requests an export of their posts. | app/main/routes.py |
| api_token_created | Captures when an authenticated API client creates a personal access token. | app/api/tokens.py |
| api_token_revoked | Captures when an authenticated API client revokes a personal access token. | app/api/tokens.py |
| api_user_created | Captures when a new user is created through the API. | app/api/users.py |
| posts_export_completed | Captures when the background post export job completes successfully. | app/tasks.py |
| posts_export_failed | Captures when the background post export job fails with an exception. | app/tasks.py |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://us.posthog.com/project/483112/dashboard/1831001)
- [Registrations over time (wizard)](https://us.posthog.com/project/483112/insights/7R9hYuKp)
- [Content creation by type (wizard)](https://us.posthog.com/project/483112/insights/pMh0xmAo)
- [Social actions total (wizard)](https://us.posthog.com/project/483112/insights/bfMhsoSN)
- [Export pipeline outcomes (wizard)](https://us.posthog.com/project/483112/insights/TLXEMmNn)
- [Registration to posting funnel (wizard)](https://us.posthog.com/project/483112/insights/zxKRQKAY)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
