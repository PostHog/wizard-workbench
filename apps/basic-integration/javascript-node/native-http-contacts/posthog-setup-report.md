# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this native Node.js HTTP contacts API. The `posthog-node` SDK was installed and initialized in `index.js` with `enableExceptionAutocapture: true`. A `getDistinctId` helper reads the `X-POSTHOG-DISTINCT-ID` request header (for client-correlation) and falls back to the client IP. Event captures were added to every mutating route handler, and `captureException` was wired into the top-level error handler. Graceful shutdown via `posthog.shutdown()` is registered on both `SIGINT` and `SIGTERM`. The npm start/dev scripts were updated to load the `.env` file via `--env-file=.env`.

| Event name | Description | File |
|---|---|---|
| `contact created` | A new contact was successfully added to the system. | `index.js` |
| `contact updated` | An existing contact's details were successfully updated. | `index.js` |
| `contact deleted` | A contact was removed from the system. | `index.js` |
| `group created` | A new contact group was successfully created. | `index.js` |
| `contact search performed` | A user searched for contacts by name, email, or phone. | `index.js` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://us.posthog.com/project/483112/dashboard/1787365)
- [Contacts created over time](https://us.posthog.com/project/483112/insights/GLAPFHVs)
- [Contact churn rate over time](https://us.posthog.com/project/483112/insights/0nG5lgxk)
- [Contact management funnel: search → create](https://us.posthog.com/project/483112/insights/HOaX87Mq)
- [Contact mutations breakdown](https://us.posthog.com/project/483112/insights/VZEhl5GS)
- [Group creation trend over time](https://us.posthog.com/project/483112/insights/ghh62l9e)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names (`POSTHOG_API_KEY`, `POSTHOG_HOST`) to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
