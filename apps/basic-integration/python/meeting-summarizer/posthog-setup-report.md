<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the AI Meeting Summarizer. The `posthog` and `python-dotenv` packages were added to `requirements.txt` and a `.env` file was created with the PostHog project token and host. A `Posthog` client instance is initialized at module level in both `server.py` and `user_service.py`, with `enable_exception_autocapture=True` for automatic error tracking and `atexit.register(client.shutdown)` to ensure all queued events are flushed on process exit. Events are captured at key business actions across all API endpoints and the user management service.

| Event | Description | File |
|---|---|---|
| `user_logged_in` | User successfully authenticated and a session was created. | `server.py` |
| `user_login_failed` | A login attempt was made but the user was not found or is inactive. | `server.py` |
| `user_logged_out` | User session was destroyed via the logout endpoint. | `server.py` |
| `meeting_created` | A meeting transcript was submitted, analyzed by AI, and saved successfully. | `server.py` |
| `meeting_deleted` | A user deleted one of their meeting records. | `server.py` |
| `user_created` | A new user account was created via the API. | `server.py` |
| `user_profile_updated` | An existing user's profile fields were updated. | `server.py` |
| `user_deleted` | A user account was permanently deleted via the API. | `server.py` |
| `user_registered` | A new user was registered through the UserService. | `user_service.py` |
| `user_deactivated` | A user account was deactivated (soft-deleted) through the UserService. | `user_service.py` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) Dashboard](https://us.posthog.com/project/483112/dashboard/1761250)
- [Login to Meeting Created Funnel](https://us.posthog.com/project/483112/insights/QVJNsZZi)
- [Meetings Created Over Time](https://us.posthog.com/project/483112/insights/pz9k9Jy7)
- [Login Success vs Failure](https://us.posthog.com/project/483112/insights/afgc8SUK)
- [New User Registrations](https://us.posthog.com/project/483112/insights/PIBRxX6K)
- [User Churn Events](https://us.posthog.com/project/483112/insights/zzpXWkHQ)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to `.env.example` and any onboarding scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `set()` to keep person properties up to date — the current implementation only sets properties on login, so users who return without logging in again will have stale profiles until their next login.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
