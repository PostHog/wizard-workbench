<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Flask social media application (Microblog). PostHog is initialised once in `create_app()` using environment variables, and event tracking has been added across the authentication, main, and API blueprints.

| Event | Description | File |
|---|---|---|
| `user_logged_in` | User successfully logs in via the web form | `app/auth/routes.py` |
| `user_signed_up` | New user completes registration | `app/auth/routes.py` |
| `user_logged_out` | User logs out | `app/auth/routes.py` |
| `password_reset_requested` | User submits the password reset request form | `app/auth/routes.py` |
| `password_reset_completed` | User successfully resets their password via the token link | `app/auth/routes.py` |
| `post_created` | User publishes a new post | `app/main/routes.py` |
| `user_followed` | User follows another user | `app/main/routes.py` |
| `user_unfollowed` | User unfollows another user | `app/main/routes.py` |
| `profile_updated` | User saves changes to their profile | `app/main/routes.py` |
| `message_sent` | User sends a private message | `app/main/routes.py` |
| `posts_export_started` | User initiates a post export task | `app/main/routes.py` |
| `search_performed` | User performs a search query | `app/main/routes.py` |
| `api_user_created` | New user account created via REST API | `app/api/users.py` |
| `api_token_created` | User obtains an API token | `app/api/tokens.py` |

## Next steps

Dashboard creation requires `dashboard:write` and `insight:write` scopes on the PostHog API key used by this MCP session. These scopes were not available during the wizard run. To create the recommended dashboard, add the required scopes to your PostHog personal API key and re-run the wizard, or create the following insights manually in PostHog:

1. **User signups over time** — Trends of `user_signed_up`
2. **Signup → post funnel** — Funnel: `user_signed_up` → `post_created`
3. **Core engagement** — Trends of `post_created`, `user_followed`, `message_sent`
4. **Login activity** — Trends of `user_logged_in`
5. **User retention** — Retention on `user_logged_in`

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to `.env.example` and any bootstrap scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
