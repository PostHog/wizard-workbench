# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Flask social media application (Microblog). PostHog is now initialized in `create_app()` via environment variables and tracks 13 events across authentication, social interactions, content creation, and API usage. User identity is established at login and registration using the `new_context()` / `identify_context()` contextual API, ensuring all events are correlated to the correct user.

## Events instrumented

| Event | Description | File |
|-------|-------------|------|
| `user_logged_in` | Fired when a user successfully logs in with valid credentials | `app/auth/routes.py` |
| `user_logged_out` | Fired when a user logs out of their session | `app/auth/routes.py` |
| `user_registered` | Fired when a new user completes registration via the sign-up form | `app/auth/routes.py` |
| `password_reset_requested` | Fired when a user requests a password reset email | `app/auth/routes.py` |
| `password_reset_completed` | Fired when a user successfully resets their password via token | `app/auth/routes.py` |
| `post_created` | Fired when a user submits a new post to the feed | `app/main/routes.py` |
| `user_followed` | Fired when a user follows another user | `app/main/routes.py` |
| `user_unfollowed` | Fired when a user unfollows another user | `app/main/routes.py` |
| `message_sent` | Fired when a user sends a private message to another user | `app/main/routes.py` |
| `profile_updated` | Fired when a user saves changes to their profile | `app/main/routes.py` |
| `post_search_performed` | Fired when a user performs a post search | `app/main/routes.py` |
| `posts_export_requested` | Fired when a user requests an export of their posts | `app/main/routes.py` |
| `api_user_created` | Fired when a new user is created via the REST API endpoint | `app/api/users.py` |

## Next steps

The PostHog API key used by the wizard did not have `dashboard:write` or `insight:write` scopes, so the dashboard and insights could not be created automatically. Please create the **"Analytics basics (wizard)"** dashboard manually in PostHog with these recommended insights:

1. **Signup to login funnel** — Funnel: `user_registered` → `user_logged_in` (measures new user activation)
2. **Content creation trend** — Trend: `post_created` over time (tracks engagement growth)
3. **Social engagement** — Trend: `user_followed` and `user_unfollowed` over time (monitors follow/churn health)
4. **Messaging activity** — Trend: `message_sent` over time (tracks direct messaging engagement)
5. **New user registrations** — Trend: `user_registered` over time (monitors top-of-funnel growth)

- [PostHog Dashboards](https://us.posthog.com/project/2/dashboard)
- [Create a new insight](https://us.posthog.com/project/2/insights/new)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to `.env.example` and any bootstrap scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — the current integration identifies on fresh login and registration; verify that sessions resumed from a remember-me cookie or a pre-authenticated state are also identified correctly.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
