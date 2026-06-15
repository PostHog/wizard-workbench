<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of the AI Meeting Summarizer with PostHog analytics. A new `posthog_client.py` module was added to initialize a shared `Posthog` instance from environment variables and register `shutdown()` via `atexit`. `server.py` was instrumented with eight events covering the full user lifecycle and meeting workflow, including user identification on login. `user_service.py` was instrumented with two additional events for user registration and deactivation. No existing logic was altered — all PostHog calls are purely additive.

| Event | Description | File |
|---|---|---|
| `user_logged_in` | User successfully authenticated via the login form | server.py |
| `user_login_failed` | Login attempt failed — user not found or account inactive | server.py |
| `user_logged_out` | User ended their session by logging out | server.py |
| `meetings_listed` | User loaded their meetings dashboard (top of conversion funnel) | server.py |
| `meeting_viewed` | User opened a specific meeting to view its details and summary | server.py |
| `meeting_submitted` | User submitted a meeting transcript for AI analysis | server.py |
| `meeting_summarized` | AI summarization completed and meeting was saved successfully | server.py |
| `meeting_deleted` | User deleted a meeting from their history (churn signal) | server.py |
| `stats_viewed` | User checked their meeting statistics summary | server.py |
| `user_registered` | A new user account was created in the system | user_service.py |
| `user_deactivated` | A user account was deactivated (churn signal) | user_service.py |

## Next steps

A PostHog dashboard ("Analytics basics (wizard)") could not be created automatically because the configured API key is missing the `dashboard:write`, `insight:write`, and `query:read` scopes. To create it manually, add the following insights in PostHog:

1. **Meeting submission funnel** — Funnel: `meeting_submitted` → `meeting_summarized` (conversion rate for transcript analysis)
2. **User login trend** — Trends: `user_logged_in` over time (daily active users proxy)
3. **Login failure rate** — Trends: `user_login_failed` over time (monitor for abuse or UX friction)
4. **Meeting deletions** — Trends: `meeting_deleted` over time (churn signal)
5. **Registrations vs deactivations** — Trends: `user_registered` and `user_deactivated` on the same chart (growth health)

To grant the wizard dashboard-creation permissions, re-authenticate the MCP with a personal API key that includes `dashboard:write`, `insight:write`, and `query:read` scopes.

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to `.env.example` and any bootstrap scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
