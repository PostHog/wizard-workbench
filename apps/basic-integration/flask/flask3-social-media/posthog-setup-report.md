# PostHog post-wizard report

PostHog has been integrated into this Flask social-media application. The Python SDK is installed and initialized once in the application factory using `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` environment variables. The client is registered for graceful shutdown, authenticated users are identified with their stable internal user ID, and person properties are set separately from event data. Critical product actions and unhandled server errors are captured without including user-entered content or other PII in event properties.

| Event name | Description | File |
| --- | --- | --- |
| `user_logged_in` | A registered user successfully signs in through the web form. | `app/auth/routes.py` |
| `user_registered` | A new user account is successfully created through the web form. | `app/auth/routes.py` |
| `post_created` | An authenticated user publishes a new microblog post. | `app/main/routes.py` |
| `user_followed` | An authenticated user follows another user. | `app/main/routes.py` |
| `user_unfollowed` | An authenticated user unfollows another user. | `app/main/routes.py` |
| `message_sent` | An authenticated user successfully sends a private message. | `app/main/routes.py` |
| `post_export_requested` | An authenticated user starts an export of their posts. | `app/main/routes.py` |
| `api_token_created` | An authenticated API client requests an access token. | `app/api/tokens.py` |

## Next steps

The configured PostHog MCP service was unavailable in this environment, so a dashboard, insights, and shareable notebook could not be created during this run. Once the service is available, create **Analytics basics (wizard)** and add insights using the events above, prioritizing registration, post creation, social engagement, and export activity.

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
