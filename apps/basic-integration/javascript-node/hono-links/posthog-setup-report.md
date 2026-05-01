<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of the **hono-links** Hono/Node.js API. PostHog is now initialized in `index.js` using the `posthog-node` SDK with exception autocapture enabled. Four events are tracked across all mutating and search routes, error capture is wired into Hono's `onError` handler, and graceful shutdown is handled on `SIGINT`.

| Event | Description | File |
|---|---|---|
| `link_saved` | Fired after a new link is successfully created via `POST /api/links`. Includes `link_id`, `url`, `title`, `tags`, and `has_description`. | `index.js` |
| `link_updated` | Fired after a link is updated via `PATCH /api/links/:id`. Includes `link_id`, `fields_updated`, and `favorited` (non-null when favorite status changed). | `index.js` |
| `link_deleted` | Fired after a link is deleted via `DELETE /api/links/:id`. Includes `link_id`, `url`, and `title`. | `index.js` |
| `links_searched` | Fired when `GET /api/links` is called with at least one filter (`tag`, `search`, or `favorites`). Includes filter values and `results_count`. | `index.js` |

The distinct ID is read from the `x-user-id` request header on every call, falling back to `"anonymous"` when absent. Add authentication to the API and pass the user's ID in that header to correlate events per user.

## Next steps

We were unable to auto-create the PostHog dashboard because the provisioned API key does not have `dashboard:write` or `insight:write` scopes. Create the **"Analytics basics"** dashboard manually in PostHog and add these five insights:

1. **Links saved over time** — Trends chart on `link_saved` (daily)
2. **Links deleted over time** — Trends chart on `link_deleted` (daily)
3. **Link updates over time** — Trends chart on `link_updated` (daily)
4. **Save → Update → Delete funnel** — Funnel with steps: `link_saved` → `link_updated` → `link_deleted`
5. **Search activity over time** — Trends chart on `links_searched` broken down by `search` or `tag` property

Go to: https://us.posthog.com/project/2/dashboards

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
