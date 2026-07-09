<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of this Flask microblog project by installing the Python PostHog SDK, initializing a shared PostHog client in the application factory, wiring in environment-based configuration, and instrumenting key authentication, social, messaging, API, export, and error-handling flows with server-side analytics and exception capture.

| Event name | Description | File |
| --- | --- | --- |
| user_logged_in | Tracks successful user sign-ins through the web login flow. | `app/auth/routes.py` |
| user_logged_out | Tracks authenticated logout actions from the web app. | `app/auth/routes.py` |
| user_signed_up | Tracks successful account registrations through the web signup flow. | `app/auth/routes.py` |
| password_reset_requested | Tracks when a password reset email is requested for an existing account. | `app/auth/routes.py` |
| password_reset_completed | Tracks successful password reset completions using a valid reset token. | `app/auth/routes.py` |
| post_created | Tracks when an authenticated user publishes a new post. | `app/main/routes.py` |
| profile_updated | Tracks when a user saves changes to their profile details. | `app/main/routes.py` |
| user_followed | Tracks when a user follows another account. | `app/main/routes.py` |
| user_unfollowed | Tracks when a user unfollows another account. | `app/main/routes.py` |
| message_sent | Tracks successful private message sends between users. | `app/main/routes.py` |
| messages_viewed | Tracks when a user opens the inbox and marks messages as read. | `app/main/routes.py` |
| posts_export_requested | Tracks when a user starts an export of their posts. | `app/main/routes.py` |
| api_user_created | Tracks successful user creation through the API. | `app/api/users.py` |
| api_user_updated | Tracks successful profile updates through the API. | `app/api/users.py` |
| posts_export_completed | Tracks successful completion of a background posts export job. | `app/tasks.py` |
| server_error_handled | Tracks handled server error responses from the Flask error handler. | `app/errors/handlers.py` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- Dashboard: https://us.posthog.com/project/483112/dashboard/1825322
- Insight: Registrations over time (wizard) — https://us.posthog.com/project/483112/insights/vdD1dEca
- Insight: Signup to first post funnel (wizard) — https://us.posthog.com/project/483112/insights/ieE2lGU8
- Insight: Messaging engagement (wizard) — https://us.posthog.com/project/483112/insights/VQTJLm6E
- Insight: Follow activity mix (wizard) — https://us.posthog.com/project/483112/insights/dPfOLWqP
- Insight: Exports requested vs completed (wizard) — https://us.posthog.com/project/483112/insights/zkgRI3TV

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names added here to `.env.example` and any bootstrap or deployment docs so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls identify — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
