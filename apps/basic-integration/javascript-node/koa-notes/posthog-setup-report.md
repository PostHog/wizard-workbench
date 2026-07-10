# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the koa-notes Koa API. The `posthog-node` SDK was installed and initialized in `index.js` using environment variables. Six business events are now captured across all mutating routes. Error tracking is wired up via Koa's `app.on('error')` event, and the process handles graceful shutdown on `SIGINT`/`SIGTERM` so queued events always flush before exit. The `start` and `dev` npm scripts were updated to load `.env` via Node's built-in `--env-file` flag.

| Event name | Description | File |
|---|---|---|
| `note_created` | A user successfully creates a new note. | `index.js` |
| `note_updated` | A user successfully updates an existing note. | `index.js` |
| `note_deleted` | A user successfully deletes a note. | `index.js` |
| `note_searched` | A user searches notes by keyword. | `index.js` |
| `folder_created` | A user successfully creates a new folder. | `index.js` |
| `folder_deleted` | A user successfully deletes a folder. | `index.js` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard:** [Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1829191)
- [Notes created over time (wizard)](https://us.posthog.com/project/483112/insights/v5DcBTNH) — daily line chart of new note creations
- [Note activity breakdown (wizard)](https://us.posthog.com/project/483112/insights/pyihZi3b) — bar chart comparing note creations, updates, and deletions side by side
- [Note engagement funnel: create → update (wizard)](https://us.posthog.com/project/483112/insights/5fSeG9cK) — funnel measuring how many users who create a note go on to edit it within 14 days
- [Note deletion rate over time (wizard)](https://us.posthog.com/project/483112/insights/sByGCsXT) — area chart tracking note deletion volume (key churn signal)
- [Folder & note management overview (wizard)](https://us.posthog.com/project/483112/insights/2ApjGaTh) — line chart for folder creation, folder deletion, and note search activity

Dashboard subscription and alerts were not configured — the consent prompt was skipped in this environment. To add a weekly email digest of the dashboard or set up alerts (e.g. when the create→update funnel drops or note deletions spike), visit the dashboard and use the **Subscribe** and **Alerts** options in the PostHog UI.

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to `.env.example` (or any bootstrap script) so collaborators know what to set.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-javascript_node/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
