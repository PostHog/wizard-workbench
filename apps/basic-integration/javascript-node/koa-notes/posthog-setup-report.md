<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the Koa Notes API. The `posthog-node` SDK was installed and a singleton client is initialised at startup using `POSTHOG_API_KEY` and `POSTHOG_HOST` environment variables (written to `.env`). A Koa middleware runs for every request and uses `posthog.withContext()` to bind a `distinctId` (read from the `X-POSTHOG-DISTINCT-ID` request header, falling back to the client IP) and an optional session ID (`X-POSTHOG-SESSION-ID`) to all downstream `capture()` calls, so every event is automatically correlated to the correct user without passing the distinct ID to each call site. Six business events were added across the folder and note CRUD routes, exception autocapture was enabled, Koa's `app.on('error', ...)` handler forwards server errors to PostHog, and a `SIGINT` handler calls `posthog.shutdown()` for graceful process exit.

| Event name | Description | File |
|---|---|---|
| `folder created` | A new folder is successfully created via POST /api/folders | `index.js` |
| `folder deleted` | A folder is successfully deleted via DELETE /api/folders/:id, with a count of notes moved to General | `index.js` |
| `note created` | A new note is successfully created via POST /api/notes | `index.js` |
| `note updated` | An existing note is successfully updated via PATCH /api/notes/:id | `index.js` |
| `note deleted` | A note is successfully deleted via DELETE /api/notes/:id | `index.js` |
| `notes searched` | A user searches notes via GET /api/notes with a search query parameter | `index.js` |

## Next steps

We've set up the events — create a dashboard named **"Analytics basics (wizard)"** in PostHog and add insights for the events above. Suggested insights:

1. **Notes created over time** — Trends: `note created`
2. **Folders created vs deleted** — Trends: `folder created` and `folder deleted` on the same chart
3. **Search usage** — Trends: `notes searched`, broken down by `result_count`
4. **Note update activity** — Trends: `note updated`, broken down by `updated_title`, `updated_content`, `updated_folder`
5. **CRUD funnel** — Funnel: `note created` → `note updated` → `note deleted`

[Open dashboards in PostHog](https://us.posthog.com/project/2/dashboard) · [Create a new insight](https://us.posthog.com/project/2/insights/new)

> **Note:** The wizard's MCP token did not have `dashboard:write` and `query:read` scopes, so the dashboard and insights could not be created automatically. Follow the links above to build them manually, or re-run the wizard after adding those scopes to the API key.

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_API_KEY` and `POSTHOG_HOST` to `.env.example` and any bootstrap scripts so collaborators know what to set.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
