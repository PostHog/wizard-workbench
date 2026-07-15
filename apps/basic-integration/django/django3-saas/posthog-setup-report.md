# PostHog post-wizard report

PostHog has been integrated into the Django application using the official Python SDK. The SDK is initialized at Django startup from `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST`, with exception autocapture and the Django request-context middleware enabled. Identified user properties are sent as person properties, while event captures use stable database user IDs and non-PII metadata only.

| Event name | Description | File |
| --- | --- | --- |
| `user_registered` | Tracks a completed account registration. | `accounts/views.py` |
| `project_created` | Tracks a completed project creation. | `dashboard/views.py` |
| `subscription_activated` | Tracks a successful demo or Stripe subscription activation. | `billing/views.py` |
| `subscription_canceled` | Tracks a completed subscription cancellation. | `billing/views.py` |

## Next steps

A dashboard and shareable notebook could not be created because the PostHog MCP service was unavailable in this run. Reconnect the service, then create **Analytics basics (wizard)** using the events above.

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

The Django integration skill is available in `.claude/skills/integration-django` for future agent development.
