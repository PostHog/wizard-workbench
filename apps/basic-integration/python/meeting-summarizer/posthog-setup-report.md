# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the AI Meeting Summarizer Python application. A new `posthog_client.py` module was created to initialise the `Posthog` SDK instance once at import time, register a graceful `shutdown()` on exit via `atexit`, and expose it to the rest of the application. `server.py` and `user_service.py` were instrumented with `posthog_client.capture()` and `posthog_client.set()` calls covering all key user and meeting lifecycle events. The PostHog token and host are read from environment variables (`.env`), and exception autocapture is enabled so unhandled errors are automatically reported to PostHog Error Tracking.

| Event name | Description | File |
|---|---|---|
| `user_logged_in` | Fired when a user successfully authenticates via the login endpoint. | `server.py` |
| `login_failed` | Fired when a login attempt is rejected because the user is not found or inactive. | `server.py` |
| `user_logged_out` | Fired when a user ends their session via the logout endpoint. | `server.py` |
| `meeting_submitted` | Fired when a user submits a meeting transcript and it is successfully analyzed and saved. | `server.py` |
| `meeting_deleted` | Fired when a user deletes one of their meetings. | `server.py` |
| `user_created` | Fired when a new user account is created via the admin API. | `server.py` |
| `user_updated` | Fired when an existing user's profile is updated. | `server.py` |
| `user_deleted` | Fired when a user account is permanently deleted. | `server.py` |
| `user_registered` | Fired when a new user is successfully registered through the UserService. | `user_service.py` |
| `user_deactivated` | Fired when a user account is deactivated through the UserService. | `user_service.py` |

## Next steps

The dashboard write scope was not available on the current PostHog API key, so the dashboard and insights below need to be created manually. Visit your PostHog project and create a dashboard named **"Analytics basics (wizard)"** with the following five insights:

1. **Meeting Submissions Over Time** — Trends chart for `meeting_submitted` over the last 30 days.
2. **Login Success vs Failure** — Trends chart comparing `user_logged_in` and `login_failed` side by side.
3. **User Registrations Over Time** — Trends chart for `user_registered` and `user_created`.
4. **Meeting & User Deletions** — Trends chart for `meeting_deleted` and `user_deactivated` to monitor churn signals.
5. **Login → Meeting Submission Funnel** — Funnel insight from `user_logged_in` → `meeting_submitted` to measure activation rate.

- [PostHog Dashboards](https://us.posthog.com/project/2/dashboard)
- [Create a new insight](https://us.posthog.com/project/2/insights/new)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — `posthog_client.set()` is currently called only on fresh login; returning sessions that resume from a stored cookie will have the correct `distinct_id` on events but no repeated `set()` call to refresh person properties.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
