# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the AI Meeting Summarizer. Changes were made to `server.py` and `user_service.py`. A `Posthog` client instance is initialized at module load in each file using environment variables, with `atexit.register(posthog_client.shutdown)` to guarantee all queued events are flushed before the process exits. Exception auto-capture is enabled in both initializations. User identification (`posthog_client.set`) is called on successful login and on new user registration to keep person profiles current. No PII appears in event properties — only opaque IDs, counts, and boolean flags.

| Event | Description | File |
|---|---|---|
| `user_logged_in` | Fires when a user successfully authenticates via the login endpoint. | `server.py` |
| `user_login_failed` | Fires when a login attempt fails due to user not found or inactive account. | `server.py` |
| `user_logged_out` | Fires when a user explicitly ends their session via the logout endpoint. | `server.py` |
| `meeting_created` | Fires when a meeting transcript is submitted and successfully summarized. | `server.py` |
| `meeting_deleted` | Fires when a user deletes one of their meetings. | `server.py` |
| `user_created` | Fires when an authenticated user creates a new account via the admin API. | `server.py` |
| `user_deleted` | Fires when an authenticated user permanently deletes an account via the admin API. | `server.py` |
| `user_profile_updated` | Fires when a user's profile fields are successfully updated. | `server.py` |
| `user_registered` | Fires when a new user is successfully registered through the UserService. | `user_service.py` |
| `user_deactivated` | Fires when a user account is soft-deleted (deactivated) through the UserService. | `user_service.py` |
| `user_deleted` | Fires when a user account is permanently removed through the UserService. | `user_service.py` |

## Next steps

We've built some insights and a dashboard to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1793506)
- [Daily Active Users (wizard)](https://us.posthog.com/project/483112/insights/jRRlG38C)
- [Meetings Created Over Time (wizard)](https://us.posthog.com/project/483112/insights/Di5NKhcX)
- [Login Success vs Failure (wizard)](https://us.posthog.com/project/483112/insights/3SJNMc4g)
- [New User Registrations (wizard)](https://us.posthog.com/project/483112/insights/iwjzEmBh)
- [Meeting Deletions (Churn Signal) (wizard)](https://us.posthog.com/project/483112/insights/AzIoJzdC)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to `.env.example` and any bootstrap scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `posthog_client.set` — the current implementation only identifies on fresh login; returning sessions that skip the login endpoint will stay on their existing person profile (which is fine if the session persists, but worth verifying).

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
