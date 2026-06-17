<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Koa Notes API. The `posthog-node` SDK was installed, a PostHog client was initialized using environment variables, and `posthog.capture()` calls were added to every route handler that creates, updates, or deletes data. Error tracking was wired into Koa's application-level error event, and a graceful shutdown handler ensures all queued events are flushed before the process exits.

| Event name | Description | File |
|---|---|---|
| `note created` | A new note was created, including which folder it was placed in | `index.js` |
| `note updated` | An existing note was updated (title, content, or folder changed) | `index.js` |
| `note deleted` | A note was deleted | `index.js` |
| `folder created` | A new folder was created | `index.js` |
| `folder deleted` | A folder was deleted and its notes moved to General | `index.js` |
| `notes searched` | User searched notes using a query string | `index.js` |

## Next steps

Create the **"Analytics basics (wizard)"** dashboard in PostHog and add the following insights:

- [New dashboard](https://us.posthog.com/project/2/dashboard) — create one named `Analytics basics (wizard)`
- [Notes created over time](https://us.posthog.com/project/2/insights/new) — Trends: `note created`
- [Note edits and deletes over time](https://us.posthog.com/project/2/insights/new) — Trends: `note updated` and `note deleted`
- [Folder operations over time](https://us.posthog.com/project/2/insights/new) — Trends: `folder created` and `folder deleted`
- [Search usage over time](https://us.posthog.com/project/2/insights/new) — Trends: `notes searched`
- [Note creation funnel](https://us.posthog.com/project/2/insights/new) — Funnel: `folder created` → `note created`

> **Note:** Dashboard creation required API key write scopes (`dashboard:write`, `insight:write`) that are not available in the current session. Use the links above to create the dashboard and insights manually in PostHog.

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_API_KEY` and `POSTHOG_HOST` to `.env.example` and any bootstrap scripts so collaborators know what to set.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
