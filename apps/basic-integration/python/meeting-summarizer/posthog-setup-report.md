<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the AI Meeting Summarizer Python application. A new `posthog_client.py` module was added to initialize the PostHog SDK using environment variables, with `atexit`-based shutdown to ensure all queued events are flushed when the process exits. Event tracking was added to `server.py` (the HTTP server) and `user_service.py` (the user management service), covering authentication flows, meeting lifecycle, and user account changes. Exception autocapture was enabled globally and `capture_exception` calls were added to each HTTP verb's error handler.

| Event Name | Description | File |
|---|---|---|
| `user_logged_in` | Fired when a user successfully authenticates via the login endpoint. | `server.py` |
| `user_login_failed` | Fired when a login attempt fails because the user is not found or inactive. | `server.py` |
| `user_logged_out` | Fired when a user ends their session by calling the logout endpoint. | `server.py` |
| `meeting_created` | Fired when a user submits a transcript and a new meeting summary is successfully created. | `server.py` |
| `meeting_viewed` | Fired when a user opens a specific meeting detail — top of the review funnel. | `server.py` |
| `meeting_deleted` | Fired when a user permanently removes a meeting from their account. | `server.py` |
| `user_registered` | Fired when a new user account is successfully created via the user service. | `user_service.py` |
| `user_deactivated` | Fired when a user account is deactivated (churn signal). | `user_service.py` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard:** [Analytics basics (wizard)](https://us.posthog.com/project/2/dashboard/1760003)
- [Signup to first meeting funnel](https://us.posthog.com/project/2/insights/ins9800006) — conversion funnel from registration to first meeting created
- [Meeting creation over time](https://us.posthog.com/project/2/insights/ins9800007) — core product usage trend
- [Login failures over time](https://us.posthog.com/project/2/insights/ins9800008) — authentication health signal
- [Meeting deletions over time](https://us.posthog.com/project/2/insights/ins9800009) — engagement churn signal
- [User deactivations over time](https://us.posthog.com/project/2/insights/ins9800010) — account churn signal

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to `.env.example` and any bootstrap scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
