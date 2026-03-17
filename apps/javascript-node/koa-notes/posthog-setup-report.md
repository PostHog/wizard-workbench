<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of the koa-notes API with PostHog. The `posthog-node` SDK was installed as a dependency, and `index.js` was updated with the following changes:

- **PostHog client initialization** at the top of `index.js` using `POSTHOG_KEY` and `POSTHOG_HOST` environment variables, with `enableExceptionAutocapture: true`
- **Per-request middleware** that reads the `X-POSTHOG-DISTINCT-ID` and `X-POSTHOG-SESSION-ID` headers to correlate server-side events with client-side sessions
- **Error tracking** via `app.on('error', ...)` that captures all unhandled Koa errors with `posthog.captureException()`
- **Six event capture calls** across the mutating routes (see table below)
- **Graceful shutdown** handlers for `SIGINT` and `SIGTERM` that call `posthog.shutdown()` to flush pending events before exit

| Event | Description | File |
|-------|-------------|------|
| `folder_created` | A new folder is created | `index.js` |
| `folder_deleted` | A folder is deleted (notes moved to General) | `index.js` |
| `note_created` | A new note is created | `index.js` |
| `note_updated` | An existing note is updated | `index.js` |
| `note_deleted` | A note is deleted | `index.js` |
| `notes_searched` | User performs a search query on notes | `index.js` |

## Next steps

To track user behavior, create an **"Analytics basics"** dashboard in PostHog (https://us.posthog.com/project/2/dashboards) with these recommended insights:

1. **Note creation trend** — Trends chart for `note_created` over time
2. **Content creation funnel** — Funnel: `folder_created` → `note_created` → `note_updated`
3. **Note lifecycle** — Trends: `note_created` vs `note_deleted` (retention/churn signal)
4. **Search engagement** — Trends for `notes_searched` with breakdown by `results_count`
5. **Folder management** — Trends: `folder_created` vs `folder_deleted`

To correlate backend events with frontend users, pass the PostHog distinct ID and session ID in the `X-POSTHOG-DISTINCT-ID` and `X-POSTHOG-SESSION-ID` request headers from your client-side code.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
