# PostHog post-wizard report

The wizard integrated PostHog into the native Node.js contacts API. It installed `posthog-node` and `dotenv`, loads configuration from `POSTHOG_API_KEY` and `POSTHOG_HOST`, initializes the server SDK with exception autocapture, and gracefully shuts down PostHog on process termination. Successful contact and group mutations now emit privacy-safe events using the caller's `x-posthog-distinct-id` header when supplied. Contact names, emails, phone numbers, companies, search values, and group names are not included in event properties. Request exceptions are captured with the request method and path.

| Event name | Description | File |
| --- | --- | --- |
| `contact_group_created` | A caller successfully creates a contact group. | `index.js` |
| `contact_created` | A caller successfully creates a contact. | `index.js` |
| `contact_updated` | A caller successfully updates a contact. | `index.js` |
| `contact_deleted` | A caller successfully deletes a contact. | `index.js` |

## Next steps

The PostHog MCP dashboard service was unavailable during this run, so no dashboard, insights, or shareable notebook could be created. After the service is available, create an **Analytics basics (wizard)** dashboard covering the events above.

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names `POSTHOG_API_KEY` and `POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
