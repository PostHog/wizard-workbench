<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Flask social-media application (Microblog). A `Posthog` client instance is initialized in `app/__init__.py` inside `create_app()`, registered for graceful shutdown with `atexit`, and exported as `posthog_client` for use across all blueprints. PostHog configuration is read from environment variables (`POSTHOG_PROJECT_TOKEN`, `POSTHOG_HOST`) set in `.env`. Eleven events are captured across four files covering authentication, social actions, messaging, and API user creation.

| Event | Description | File |
|---|---|---|
| `user_signed_up` | New user completes web registration | `app/auth/routes.py` |
| `user_logged_in` | User successfully logs in with password | `app/auth/routes.py` |
| `user_logged_out` | User explicitly logs out | `app/auth/routes.py` |
| `password_reset` | User successfully resets their password via token | `app/auth/routes.py` |
| `post_created` | User submits a new post; includes `language` property | `app/main/routes.py` |
| `profile_updated` | User saves changes to their profile | `app/main/routes.py` |
| `user_followed` | User follows another user | `app/main/routes.py` |
| `user_unfollowed` | User unfollows another user | `app/main/routes.py` |
| `message_sent` | User sends a private message; includes `message_length` | `app/main/routes.py` |
| `posts_export_requested` | User kicks off a posts export task | `app/main/routes.py` |
| `api_user_created` | New user created via the REST API | `app/api/users.py` |

## Next steps

To set up an **"Analytics basics"** dashboard, open each link below in PostHog, then click **Save to dashboard**:

1. **Signup & login funnel** — tracks the conversion from signup to first login:
   `https://us.posthog.com/project/2/insights/new#eyJldmVudHMiOlt7ImlkIjoidXNlcl9zaWduZWRfdXAiLCJ0eXBlIjoiZXZlbnRzIn0seyJpZCI6InVzZXJfbG9nZ2VkX2luIiwidHlwZSI6ImV2ZW50cyJ9XSwiaW5zaWdodCI6IkZVTk5FTFMifQ==`

2. **New signups over time** — daily trend of `user_signed_up`:
   `https://us.posthog.com/project/2/insights/new?insight=TRENDS&interval=day&events=[{"id":"user_signed_up","type":"events","math":"dau"}]`

3. **Posts created over time** — daily trend of `post_created`:
   `https://us.posthog.com/project/2/insights/new?insight=TRENDS&interval=day&events=[{"id":"post_created","type":"events","math":"total"}]`

4. **Social engagement (follows + messages)** — combined trend of `user_followed` and `message_sent`:
   `https://us.posthog.com/project/2/insights/new?insight=TRENDS&interval=day&events=[{"id":"user_followed","type":"events"},{"id":"message_sent","type":"events"}]`

5. **Churn signal — logouts** — daily trend of `user_logged_out` to track session-ending behaviour:
   `https://us.posthog.com/project/2/insights/new?insight=TRENDS&interval=day&events=[{"id":"user_logged_out","type":"events","math":"dau"}]`

Or create a fresh dashboard from scratch at:
`https://us.posthog.com/project/2/dashboard`

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-flask/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
