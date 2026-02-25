<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Hono links API. The `posthog-node` SDK was installed and configured in `index.js` with a clean `initializePosthog()` helper that reads credentials from environment variables. A `trackEvent()` helper wraps all `posthog.capture()` calls so analytics can be gracefully skipped if the API key is not set. Exception autocapture is enabled, an `app.onError()` handler reports unhandled errors to PostHog, and a graceful-shutdown block flushes buffered events before the process exits.

| Event | Description | File |
|---|---|---|
| `link_created` | Fired when a user saves a new bookmark via `POST /api/links`. Properties: `link_id`, `has_description`, `tag_count`, `total_links`. | `index.js` |
| `link_updated` | Fired when a user updates one or more fields (url, title, description, tags) on an existing link via `PATCH /api/links/:id`. Properties: `link_id`, `updated_fields`. | `index.js` |
| `link_favorited` | Fired when a user toggles the `favorite` status on a link via `PATCH /api/links/:id`. Properties: `link_id`, `favorited`. | `index.js` |
| `link_deleted` | Fired when a user deletes a link via `DELETE /api/links/:id`. Properties: `link_id`, `was_favorite`, `tag_count`, `age_hours`. | `index.js` |
| `links_searched` | Fired when a user searches or tag-filters links via `GET /api/links`. Represents the top of the save-link conversion funnel. Properties: `search_query`, `tag_filter`, `favorites_only`, `results_count`. | `index.js` |

## Next steps

We were not able to auto-create the PostHog dashboard and insights in this environment because the API key did not have the `dashboard:write` or `insight:write` scopes. You can build the following insights manually in PostHog and add them to an **"Analytics basics"** dashboard:

1. **Links created over time** — Trends chart for the `link_created` event, grouped by day. Shows your overall bookmark growth rate.
2. **Search-to-save funnel** — Funnel from `links_searched` → `link_created`. Reveals how many searches result in a saved link.
3. **Link action breakdown** — Stacked bar/trends chart comparing `link_created`, `link_updated`, and `link_deleted` over time. Shows overall engagement health.
4. **Favorite rate** — Bar chart of `link_favorited` events filtered to `favorited = true`, as a percentage of `link_created`. Indicates content quality/relevance.
5. **Deletion age distribution** — Histogram of `link_deleted` events broken down by the `age_hours` property. Helps understand how quickly links are discarded.

Visit your PostHog project to create these: [https://us.posthog.com/project/238460](https://us.posthog.com/project/238460)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-javascript_node/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
