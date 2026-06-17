<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Flask social-media microblog application. The PostHog Python SDK is now initialised globally in `app/__init__.py` via the `Posthog()` class constructor, with credentials read from environment variables. The client is shut down gracefully on exit via `atexit`. Thirteen events are captured across five files covering the full user lifecycle — authentication, content creation, social actions, messaging, and API usage — along with server-side error tracking on 500 responses.

| Event | Description | File |
|---|---|---|
| `user_signed_up` | New user completes registration via the signup form | `app/auth/routes.py` |
| `user_logged_in` | User successfully logs in with username and password | `app/auth/routes.py` |
| `user_logged_out` | User logs out of the application | `app/auth/routes.py` |
| `password_reset_requested` | User submits the password reset request form | `app/auth/routes.py` |
| `password_reset_completed` | User successfully resets their password via the reset token link | `app/auth/routes.py` |
| `post_created` | User submits a new post on the home feed | `app/main/routes.py` |
| `user_followed` | User follows another user | `app/main/routes.py` |
| `user_unfollowed` | User unfollows another user | `app/main/routes.py` |
| `message_sent` | User sends a private message to another user | `app/main/routes.py` |
| `profile_updated` | User saves changes to their profile | `app/main/routes.py` |
| `posts_export_started` | User triggers a background task to export all their posts | `app/main/routes.py` |
| `post_translated` | User requests translation of a post to another language | `app/main/routes.py` |
| `api_token_issued` | An API token is successfully issued via the API | `app/api/tokens.py` |

Users are identified with `identify_context(str(user.id))` on login and signup, with `username` set as a person property via `tag()`. Server-side 500 errors are captured via `posthog_client.capture_exception(error)` in the error handler.

## Next steps

The PostHog MCP API key did not have the `dashboard:write` and `query:read` scopes needed to create the dashboard automatically. To create the "Analytics basics (wizard)" dashboard manually in PostHog, add the following five insights:

1. **Signup & Login trend** — Trends insight tracking `user_signed_up` and `user_logged_in` over time. Shows new-user acquisition vs. returning logins.
2. **Auth conversion funnel** — Funnel insight with steps: `user_signed_up` → `user_logged_in` → `post_created`. Highlights drop-off between registration and first post.
3. **Social engagement trend** — Trends insight tracking `user_followed`, `message_sent`, and `post_created` over time. Measures content and social activity.
4. **Churn signals** — Trends insight tracking `user_logged_out` and `posts_export_started`. Export is a leading churn indicator.
5. **Password reset funnel** — Funnel with steps: `password_reset_requested` → `password_reset_completed`. Identifies friction in the account recovery flow.

Once the API key has `dashboard:write` and `query:read` scopes, the wizard can create this dashboard automatically on the next run.

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to `.env.example` and any bootstrap scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — the current integration identifies on login and signup, but a user who returns mid-session (e.g. via a remembered cookie) without hitting the login route will be anonymous until they log in again.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
