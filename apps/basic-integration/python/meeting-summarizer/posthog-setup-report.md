# PostHog post-wizard report

PostHog analytics was added to the Python meeting summarizer. The server initializes one instance-based SDK client from `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST`, enables exception autocapture, registers shutdown flushing with `atexit`, identifies users with non-PII account metadata, and captures authentication, meeting, and handled-error actions with stable user IDs. The dependency manifest now includes `posthog` and `python-dotenv`; local configuration is stored in `.env`.

| Event | Description | File |
|---|---|---|
| `user_logged_in` | A user successfully authenticates and starts a session. | `server.py` |
| `user_login_failed` | A login attempt is rejected because the credentials are missing or the user is unavailable. | `server.py` |
| `user_logged_out` | An authenticated user ends their session. | `server.py` |
| `user_registered` | A new user account is successfully created. | `server.py` |
| `meeting_created` | An authenticated user successfully creates and summarizes a meeting. | `server.py` |
| `meeting_deleted` | An authenticated user successfully deletes one of their meetings. | `server.py` |
| `meetings_viewed` | An authenticated user retrieves their meeting list. | `server.py` |
| `meeting_processing_failed` | Meeting creation or request processing fails with a handled server error. | `server.py` |

## Next steps

Dashboard and notebook creation could not be completed because the configured PostHog MCP endpoint was unavailable during this run.

## Verify before merging

- [ ] Run a full production build and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite; instrumented request handlers may need updated mocks or fixtures.
- [ ] Add `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to `.env.example` and any deployment/bootstrap configuration.
- [ ] Start the server with PostHog environment variables configured and confirm the events appear in the PostHog project.

### Agent skill

The installed integration skill remains in `.claude/skills/integration-python/` for future agent development.
