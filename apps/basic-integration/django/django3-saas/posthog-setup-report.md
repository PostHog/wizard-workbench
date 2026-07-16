# PostHog post-wizard report

PostHog has been integrated into the Django application with a server-side Python client initialized from environment variables. Django request context middleware is enabled after authentication, exception autocapture is enabled, and the client is shut down cleanly at process exit. User registration and password login set person properties separately from event data. Product and billing events use authenticated user IDs with non-PII metadata.

| Event name | Description | File |
| --- | --- | --- |
| `user_registered` | Captures successful account registration after the user is signed in. | `accounts/views.py` |
| `user_logged_in` | Captures successful password authentication. | `accounts/views.py` |
| `project_created` | Captures successful creation of a project. | `dashboard/views.py` |
| `subscription_started` | Captures subscriptions created in demo mode or confirmed by a Stripe checkout webhook. | `billing/views.py` |
| `subscription_plan_changed` | Captures successful subscription plan changes. | `billing/views.py` |
| `subscription_canceled` | Captures successful subscription cancellations. | `billing/views.py` |

## Next steps

The configured PostHog MCP server was unavailable while creating dashboard resources, so no dashboard, insights, or shareable notebook could be created during this run. After the MCP service is available, create an **Analytics basics (wizard)** dashboard with trends for registrations, project creation, subscriptions started, plan changes, and cancellations.

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

An agent skill folder remains in the project to provide current PostHog integration context for future Claude Code work.
