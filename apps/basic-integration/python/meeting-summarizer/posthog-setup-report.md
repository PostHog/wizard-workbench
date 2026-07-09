<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of this project by installing the Python PostHog SDK dependencies, adding a shared PostHog client helper with environment-based configuration and graceful shutdown handling, instrumenting server-side authentication, meeting workflow, and user lifecycle events, and wiring person-property identification for authenticated users without placing PII on captured event properties.

| Event name | Description | File |
| --- | --- | --- |
| `user_logged_in` | Captures successful user authentication for an existing account. | `server.py` |
| `login_failed` | Captures failed authentication attempts with a non-PII failure reason. | `server.py` |
| `meetings_list_viewed` | Captures when an authenticated user loads the meetings dashboard list. | `server.py` |
| `meeting_viewed` | Captures when a user opens a specific meeting detail view. | `server.py` |
| `dashboard_stats_viewed` | Captures when a user requests meeting summary statistics. | `server.py` |
| `meeting_created` | Captures successful transcript analysis and meeting creation. | `server.py` |
| `meeting_deleted` | Captures successful deletion of a meeting owned by the user. | `server.py` |
| `user_created` | Captures successful creation of a new user account through the API. | `server.py` |
| `user_profile_updated` | Captures successful updates to an existing user profile. | `server.py` |
| `user_deleted` | Captures successful deletion of a user account through the API. | `server.py` |
| `user_registered` | Captures successful user registration in the background user service. | `user_service.py` |
| `user_deactivated` | Captures successful account deactivation in the background user service. | `user_service.py` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- Dashboard: https://us.posthog.com/project/483112/dashboard/1825390
- Insight: Meeting creation trend (wizard) — https://us.posthog.com/project/483112/insights/aIbJyr4b
- Insight: Login success vs failure (wizard) — https://us.posthog.com/project/483112/insights/TzR36Liw
- Insight: Meeting engagement funnel (wizard) — https://us.posthog.com/project/483112/insights/VgHrBg9r
- Insight: Meeting deletion trend (wizard) — https://us.posthog.com/project/483112/insights/3raR08Hv
- Insight: User lifecycle actions (wizard) — https://us.posthog.com/project/483112/insights/Vnu9RqCh

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
