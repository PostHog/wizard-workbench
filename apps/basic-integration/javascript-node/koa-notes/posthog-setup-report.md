<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of this Koa notes API with PostHog by installing the `posthog-node` SDK, wiring server-side initialization through environment variables, adding event capture for core folder and note lifecycle routes, and adding PostHog exception capture for request errors. The integration keeps the existing API structure intact while instrumenting the main creation, update, deletion, and retrieval flows that matter for activation and churn analysis.

| Event name | Description | File |
| --- | --- | --- |
| folder_created | Captures when a new folder is created successfully. | `index.js` |
| folder_deleted | Captures when a non-default folder is deleted and its notes are moved. | `index.js` |
| notes_list_viewed | Captures when the notes list is queried with filters or search. | `index.js` |
| note_created | Captures when a new note is created successfully. | `index.js` |
| note_viewed | Captures when a single note is fetched successfully. | `index.js` |
| note_updated | Captures when a note is edited successfully. | `index.js` |
| note_deleted | Captures when a note is deleted successfully. | `index.js` |

## Next steps

We've built some insights and a dashboard for ongoing monitoring of the newly instrumented events:

- [Analytics basics (wizard) dashboard](https://us.posthog.com/project/483112/dashboard/1831032)
- [Folder to note creation funnel (wizard)](https://us.posthog.com/project/483112/insights/bJ04mnfc)
- [Notes created over time (wizard)](https://us.posthog.com/project/483112/insights/7SgEhCjD)
- [Notes updated over time (wizard)](https://us.posthog.com/project/483112/insights/38zXPprY)
- [Folder management volume (wizard)](https://us.posthog.com/project/483112/insights/KUAZW5EZ)
- [Notes deleted over time (wizard)](https://us.posthog.com/project/483112/insights/UdJ09s7u)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>