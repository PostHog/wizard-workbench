# PostHog post-wizard report

The wizard has completed a deep integration of this Koa notes API with PostHog using the server-side `posthog-node` SDK. The integration adds shared PostHog initialization, per-request event capture helpers, exception capture through Koa's app error handler, graceful SDK shutdown on process signals, project environment variables for the PostHog token and host, and four saved PostHog insights collected on a new dashboard. Notebook mirroring could not be completed in this MCP session because notebook creation tooling is unavailable without the required notebook scope.

| Event name | Description | File |
| --- | --- | --- |
| `folder_created` | Captures when a new note folder is created successfully. | `index.js` |
| `folder_deleted` | Captures when a custom note folder is deleted and notes are reassigned. | `index.js` |
| `notes_list_filtered` | Captures when notes are listed with folder or search filters applied. | `index.js` |
| `note_created` | Captures when a new note is created successfully. | `index.js` |
| `note_viewed` | Captures when an individual note is opened. | `index.js` |
| `note_updated` | Captures when a note is edited or moved to another folder. | `index.js` |
| `note_deleted` | Captures when a note is deleted successfully. | `index.js` |

## Next steps

We've built some insights and a dashboard for ongoing visibility into note and folder behavior:

- [Analytics basics (wizard) dashboard](https://us.posthog.com/project/483112/dashboard/1846723)
- [Create to view funnel (wizard)](https://us.posthog.com/project/483112/insights/XfLVXkQl)
- [Notes created over time (wizard)](https://us.posthog.com/project/483112/insights/Gf8oTS42)
- [Folder operations (wizard)](https://us.posthog.com/project/483112/insights/ogoI6kyt)
- [Notes updated vs deleted (wizard)](https://us.posthog.com/project/483112/insights/59oNCIby)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names added here (`POSTHOG_PROJECT_API_KEY` and `POSTHOG_HOST`) to `.env.example` and any bootstrap scripts so collaborators know what to set.

### Agent skill

An agent skill folder remains in the project under `.claude/skills/integration-javascript_node/` for future agent-assisted PostHog work.
