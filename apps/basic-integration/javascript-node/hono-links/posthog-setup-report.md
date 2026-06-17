<wizard-report>
# PostHog post-wizard report

The wizard has completed a full integration of PostHog analytics into the `hono-links` Node.js API. The `posthog-node` SDK (v5.38.x) was installed and initialized with environment variables. Event capture was added to all write routes and filtered read routes, error tracking was wired into Hono's global error handler, and clean shutdown hooks were added for `SIGINT`/`SIGTERM`.

User identity is resolved per-request from the `X-POSTHOG-DISTINCT-ID` header (falling back to `'anonymous'`), following the recommended pattern for backend APIs without their own auth layer. Clients using `posthog-js` on the frontend can forward this header automatically by enabling `tracing_headers` for this host.

| Event | Description | File |
|---|---|---|
| `link created` | Fired on `POST /api/links` when a new link is saved; includes `link_id`, `title`, `url`, `tags`, and `has_description` | `index.js` |
| `link updated` | Fired on `PATCH /api/links/:id` when any field is changed; includes `link_id` and `fields_updated` array | `index.js` |
| `link favorited` | Fired on `PATCH /api/links/:id` when `favorite` transitions from `false` to `true`; includes `link_id` and `title` | `index.js` |
| `link deleted` | Fired on `DELETE /api/links/:id`; includes `link_id` and `title` | `index.js` |
| `links searched` | Fired on `GET /api/links?search=` when a search query is supplied; includes `query` and `result_count` | `index.js` |
| `links filtered by tag` | Fired on `GET /api/links?tag=` when a tag filter is applied; includes `tag` and `result_count` | `index.js` |

Exception capture (`posthog.captureException`) is registered via `app.onError`, so unhandled route errors are automatically sent to PostHog Error Tracking with the user's distinct ID attached.

## Next steps

The wizard couldn't create the PostHog dashboard automatically because the current API key is missing `dashboard:write` and `query:read` scopes. You can build the recommended dashboard manually:

- [New dashboard — "Analytics basics (wizard)"](https://us.posthog.com/project/2/dashboard)
- [New insight](https://us.posthog.com/project/2/insights/new)

Suggested insights to add:

1. **Links created over time** — Trends: `link created` by day
2. **Links deleted over time** — Trends: `link deleted` by day (churn signal)
3. **Create → favorite → delete funnel** — Funnel: `link created` → `link favorited` → `link deleted`
4. **Search and filter usage** — Trends: `links searched` + `links filtered by tag` by day
5. **Link update activity** — Trends: `link updated` by day, broken down by `fields_updated`

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_API_KEY` and `POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
