<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Flask social media application (Microblog). PostHog is initialised once in the application factory (`create_app()`) using environment variables, and events are captured server-side across the auth, main, and API blueprints. User identification is performed at login and registration so that all subsequent events are correlated to the correct person in PostHog.

| Event name | Description | File |
|---|---|---|
| `user_logged_in` | User successfully authenticated with username and password. | `app/auth/routes.py` |
| `user_registered` | New user account created via the registration form. | `app/auth/routes.py` |
| `password_reset_requested` | User submitted the password reset request form. | `app/auth/routes.py` |
| `password_reset_completed` | User successfully reset their password using a reset token. | `app/auth/routes.py` |
| `post_created` | User submitted a new post to the feed. | `app/main/routes.py` |
| `user_followed` | User started following another user. | `app/main/routes.py` |
| `user_unfollowed` | User stopped following another user. | `app/main/routes.py` |
| `message_sent` | User sent a direct message to another user. | `app/main/routes.py` |
| `export_posts_started` | User initiated a background task to export their posts. | `app/main/routes.py` |
| `profile_edited` | User saved changes to their profile username or bio. | `app/main/routes.py` |
| `api_user_created` | New user account created via the REST API. | `app/api/users.py` |
| `api_token_revoked` | User revoked their API authentication token. | `app/api/tokens.py` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard:** [Analytics basics (wizard)](https://us.i.posthog.com/project/481489/dashboard/1745993)
- **Signup → Login Conversion Funnel:** https://us.i.posthog.com/project/481489/insights/2dG0EB6T
- **Post Creation Trend Over Time:** https://us.i.posthog.com/project/481489/insights/w0ncRkn4
- **Active Engagement: Follows & Messages Over Time:** https://us.i.posthog.com/project/481489/insights/uN3LaWiB
- **New User Growth Over Time:** https://us.i.posthog.com/project/481489/insights/Fn5EPxD8
- **API Signups Trend:** https://us.i.posthog.com/project/481489/insights/emdgxDSm

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_PROJECT_TOKEN`, `POSTHOG_HOST`, and `POSTHOG_DISABLED` to `.env.example` and any bootstrap scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — the current integration identifies users on login and registration, but returning sessions that skip the login form (e.g. via "remember me" cookie) will not re-identify. Consider adding an `identify_context` call in the `before_request` hook for already-authenticated users.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
