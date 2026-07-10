<wizard-report>
# PostHog post-wizard report

The wizard has completed a full PostHog integration of the AI Meeting Summarizer project. The `posthog` and `python-dotenv` packages were added to `requirements.txt` and installed. A shared `_init_posthog()` helper was added to both `server.py` and `user_service.py` to initialize the `Posthog` instance using environment variables, with `enable_exception_autocapture=True` for automatic exception tracking and `atexit.register(client.shutdown)` to flush events on process exit. Ten business events were instrumented across the two server-side files covering authentication, meeting lifecycle, and user management.

| Event | Description | File |
|---|---|---|
| `user_logged_in` | A user successfully authenticated and started a new session. | `server.py` |
| `user_login_failed` | A login attempt was rejected because the user was not found or inactive. | `server.py` |
| `user_logged_out` | A user explicitly ended their session by logging out. | `server.py` |
| `meeting_created` | A user submitted a transcript and the AI generated a meeting summary. | `server.py` |
| `meeting_deleted` | A user deleted one of their meeting summaries. | `server.py` |
| `meeting_viewed` | A user retrieved a specific meeting summary. | `server.py` |
| `stats_viewed` | A user viewed their meeting statistics dashboard. | `server.py` |
| `user_registered` | A new user account was created in the system. | `user_service.py` |
| `user_deactivated` | A user account was deactivated. | `user_service.py` |
| `user_profile_updated` | A user's profile information was updated via the API. | `server.py` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard:** [Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1829282)
- **Meetings Created Over Time** — [View insight](https://us.posthog.com/project/483112/insights/JSCu4EAJ) — Daily trend of `meeting_created` over the last 30 days.
- **Login to Meeting Created Funnel** — [View insight](https://us.posthog.com/project/483112/insights/quiGaQJ2) — Conversion funnel from `user_logged_in` → `meeting_created` with a 7-day window.
- **Login Success vs Failure** — [View insight](https://us.posthog.com/project/483112/insights/oqD4hiy0) — Daily bar chart comparing `user_logged_in` and `user_login_failed`.
- **New User Registrations** — [View insight](https://us.posthog.com/project/483112/insights/ujnYkyHX) — Weekly `user_registered` count over the last 90 days.
- **User Deactivations** — [View insight](https://us.posthog.com/project/483112/insights/VUiEh6w1) — Weekly `user_deactivated` count over the last 90 days (churn signal).

Dashboard subscriptions and alerts were skipped — the interactive prompt was not available in this run. You can set these up manually in PostHog: go to the dashboard, click "Subscribe" for a recurring email digest, or open any insight and click "Alerts" to add threshold-based notifications.

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to `.env.example` (or any bootstrap scripts) so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `posthog_client.set()` to identify users — the current login handler identifies on each login, which is correct, but verify sessions that resume without a fresh login still have the right `distinct_id` on their events.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
