<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of this Koa notes API by installing `posthog-node`, initializing a shared PostHog client from environment variables, adding server-side event capture for folder and note lifecycle routes, identifying authenticated request actors when a stable request identifier is present, and wiring Koa error capture plus graceful PostHog shutdown handling.

| Event | Description | File |
| --- | --- | --- |
| `folder_created` | Captures when a new notes folder is created successfully. | `index.js` |
| `folder_deleted` | Captures when an existing folder is deleted and its notes are reassigned. | `index.js` |
| `note_created` | Captures when a new note is created successfully. | `index.js` |
| `note_updated` | Captures when an existing note is updated successfully. | `index.js` |
| `note_deleted` | Captures when an existing note is deleted successfully. | `index.js` |

## Next steps

We've built some insights and a dashboard for monitoring the newly added server-side analytics:

- Dashboard: https://us.posthog.com/project/483112/dashboard/1825352
- Insight: Notes created over time (wizard) — https://us.posthog.com/project/483112/insights/jU1K6sQk
- Insight: Folder activity mix (wizard) — https://us.posthog.com/project/483112/insights/QfrPrcKC
- Insight: Note lifecycle funnel (wizard) — https://us.posthog.com/project/483112/insights/ebRIGKNT
- Insight: Note updates over time (wizard) — https://us.posthog.com/project/483112/insights/ZdrfzaNc
- Insight: Note deletions total (wizard) — https://us.posthog.com/project/483112/insights/fd9gPj0N

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
