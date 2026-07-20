# PostHog post-wizard report

The wizard installed the Node.js PostHog SDK and dotenv, configured PostHog through `POSTHOG_API_KEY` and `POSTHOG_HOST`, initialized a shared server client with exception autocapture, and instrumented all successful create, update, and delete operations. Event payloads contain only operational metadata—not contact names, email addresses, phone numbers, or other entered PII. Requests reuse `x-posthog-distinct-id` when supplied and otherwise receive a connection-scoped anonymous ID. Captures are flushed before responses, and request-handler exceptions are sent to PostHog Error Tracking.

| Event | Description | File |
| --- | --- | --- |
| `group_created` | A contact group was successfully created. | `index.js` |
| `contact_created` | A contact was successfully created. | `index.js` |
| `contact_updated` | An existing contact was successfully updated. | `index.js` |
| `contact_deleted` | An existing contact was successfully deleted. | `index.js` |

## Next steps

The PostHog MCP service was unavailable during setup, so the live dashboard, insights, and notebook could not be created. Retry that setup when MCP access is restored.

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_API_KEY` and `POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
