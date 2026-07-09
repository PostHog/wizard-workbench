<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of your project. PostHog analytics were added to `index.js` using the `posthog-node` server-side SDK. The client is initialized at startup with exception autocapture enabled. Capture calls were added to every data-mutating route handler (create, update, delete for contacts; create for groups). Exception tracking was added to the top-level catch block, and graceful shutdown was wired to `SIGINT` so in-flight events are flushed before the process exits. PostHog credentials are loaded from environment variables stored in `.env`.

| Event | Description | File |
|---|---|---|
| `contact_created` | A new contact was successfully added to the system. | `index.js` |
| `contact_updated` | An existing contact's details were modified. | `index.js` |
| `contact_deleted` | A contact was removed from the system. | `index.js` |
| `group_created` | A new contact group was created. | `index.js` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard:** [Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1824497)
- [Contact creations over time (wizard)](https://us.posthog.com/project/483112/insights/Uktke11c)
- [Contact lifecycle funnel (wizard)](https://us.posthog.com/project/483112/insights/hIIftCUU)
- [All contact events breakdown (wizard)](https://us.posthog.com/project/483112/insights/QRn8pzc7)
- [Group creations over time (wizard)](https://us.posthog.com/project/483112/insights/NIolJ7If)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_API_KEY` and `POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
