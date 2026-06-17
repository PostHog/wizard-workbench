<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Hono-based Node.js link-saver API. The `posthog-node` SDK was installed, environment variables were configured, and event tracking was added across all meaningful write routes. A `getDistinctId` helper reads the `x-posthog-distinct-id` header (for frontend correlation), falls back to `x-forwarded-for` (client IP), and defaults to `'anonymous'`. Exception autocapture is enabled on the PostHog client. A `SIGINT` handler calls `posthog.shutdown()` for clean process exit.

| Event name | Description | File |
|---|---|---|
| `link created` | Fired when a user saves a new bookmark via POST /api/links. Includes `link_id`, `url`, `title`, `tags`, `has_description`. | index.js |
| `link updated` | Fired when a user updates an existing link via PATCH /api/links/:id. Includes `link_id`, `updated_fields`. | index.js |
| `link deleted` | Fired when a user deletes a link via DELETE /api/links/:id. Includes `link_id`, `title`, `tags`. | index.js |
| `links searched` | Fired when a user filters or searches links via GET /api/links with query parameters. Includes `tag`, `search`, `favorites_only`, `results_count`. | index.js |
| `link favorited` | Fired when a user marks or unmarks a link as a favorite (subset of link_updated, when the favorite field changes). Includes `link_id`, `favorited`. | index.js |

## Next steps

The dashboard could not be created automatically because the MCP API key lacks the required `dashboard:write` and `query:read` scopes. To create the recommended dashboard "Analytics basics (wizard)" manually, visit your PostHog project and add the following insights:

1. **Links created over time** — Trends insight on `link created`
2. **Links deleted over time** — Trends insight on `link deleted` (churn signal)
3. **Favorite rate** — Trends insight comparing `link favorited` (favorited=true) to `link created`
4. **Search usage** — Trends insight on `links searched`, broken down by `search` vs `tag` vs `favorites_only`
5. **Link lifecycle funnel** — Funnel from `link created` → `link favorited` → `link deleted`

[PostHog Project — Analytics basics (wizard)](https://us.posthog.com/project/2/dashboards)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_API_KEY` and `POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
