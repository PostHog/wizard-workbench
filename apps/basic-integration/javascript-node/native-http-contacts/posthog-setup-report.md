<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this native Node.js HTTP contacts API. The `posthog-node` SDK was installed and initialized using environment variables. A PostHog client is created at startup with `enableExceptionAutocapture: true`. All mutating API routes now emit `posthog.capture()` calls, the search endpoint tracks `contacts_searched` events, and the top-level error handler calls `posthog.captureException()` to forward unexpected server errors to PostHog. A `SIGINT` handler calls `posthog.shutdown()` so buffered events are flushed before the process exits. The distinct ID is derived from the `X-POSTHOG-DISTINCT-ID` header (for correlation with a frontend client) with a fallback to the request's remote IP address.

| Event | Description | File |
|---|---|---|
| `contact_created` | A new contact was successfully added to the system | `index.js` |
| `contact_updated` | An existing contact's details were modified | `index.js` |
| `contact_deleted` | A contact was removed from the system | `index.js` |
| `group_created` | A new contact group was created | `index.js` |
| `contacts_searched` | A user performed a search/filter on the contacts list | `index.js` |

## Next steps

A PostHog dashboard could not be created automatically because the MCP connection for this project does not have the required write scopes. You can create the **"Analytics basics (wizard)"** dashboard manually:

- [Create a new dashboard](https://us.posthog.com/project/2/dashboard)
- [Create a new insight](https://us.posthog.com/project/2/insights/new)

Suggested insights to add to the dashboard:

1. **Contact creation over time** — Trends: `contact_created` event count per day
2. **Contact deletions over time** — Trends: `contact_deleted` event count per day
3. **Group creation over time** — Trends: `group_created` event count per day
4. **Contact updates over time** — Trends: `contact_updated` event count per day
5. **Search activity** — Trends: `contacts_searched` broken down by `results_count`

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_API_KEY` and `POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
