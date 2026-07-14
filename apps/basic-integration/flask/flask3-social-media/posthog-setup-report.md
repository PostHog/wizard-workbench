# PostHog post-wizard report

The wizard has completed a deep integration of your Flask project by installing the Python PostHog SDK, initializing a shared PostHog client in the application factory, wiring PostHog configuration through environment variables, adding reusable analytics helpers, instrumenting key authentication, content, messaging, export, and API token flows, and capturing server-side 500 errors with PostHog error tracking.

| Event name | Description | File |
| --- | --- | --- |
| `user_logged_in` | Captures when a registered user successfully logs into the web app. | `app/auth/routes.py` |
| `user_registered` | Captures when a new user account is successfully created. | `app/auth/routes.py` |
| `password_reset_requested` | Captures when a password reset email flow is requested for an existing account. | `app/auth/routes.py` |
| `password_reset_completed` | Captures when a user successfully sets a new password with a reset token. | `app/auth/routes.py` |
| `post_created` | Captures when an authenticated user publishes a new post. | `app/main/routes.py` |
| `user_followed` | Captures when a user successfully follows another account. | `app/main/routes.py` |
| `user_unfollowed` | Captures when a user successfully unfollows another account. | `app/main/routes.py` |
| `message_sent` | Captures when a direct message is successfully sent to another user. | `app/main/routes.py` |
| `posts_export_requested` | Captures when a user starts an export of their posts. | `app/main/routes.py` |
| `api_user_created` | Captures when the API successfully creates a new user account. | `app/api/users.py` |
| `api_token_issued` | Captures when an API access token is successfully generated. | `app/api/tokens.py` |
| `api_token_revoked` | Captures when an authenticated API token is revoked. | `app/api/tokens.py` |
| `posts_export_completed` | Captures when the background export job finishes preparing a user's posts export. | `app/tasks.py` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- Dashboard: [Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1846666)
- Insight: [Registrations over time (wizard)](https://us.posthog.com/project/483112/insights/cFjT8LUV)
- Insight: [Login to post funnel (wizard)](https://us.posthog.com/project/483112/insights/dX6IUebh)
- Insight: [Messages sent over time (wizard)](https://us.posthog.com/project/483112/insights/dzqOMjGM)
- Insight: [Follows vs unfollows (wizard)](https://us.posthog.com/project/483112/insights/cAkDygUQ)
- Insight: [Post exports requested (wizard)](https://us.posthog.com/project/483112/insights/g9GwgVYa)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
