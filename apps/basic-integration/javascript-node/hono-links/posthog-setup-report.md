# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the hono-links Hono.js bookmark API. The integration adds the `posthog-node` SDK to `index.js`, initialises a PostHog client from environment variables, and instruments every meaningful user action across the API's route handlers. A per-request Hono middleware uses `posthog.withContext` to attach the caller's distinct ID (read from the `x-posthog-distinct-id` header, falling back to `'anonymous'`) and optional session ID to all events captured during that request. An `app.onError` handler calls `posthog.captureException` so unexpected runtime errors are forwarded to PostHog Error Tracking. Graceful shutdown handlers flush queued events on `SIGINT`/`SIGTERM`.

| Event name | Description | File |
|---|---|---|
| `link_created` | A user saves a new link bookmark to the list. | `index.js` |
| `link_updated` | A user updates the details of an existing link. | `index.js` |
| `link_deleted` | A user removes a link from their bookmark list. | `index.js` |
| `link_favorited` | A user marks a link as a favorite. | `index.js` |
| `links_searched` | A user searches links by keyword query. | `index.js` |
| `links_filtered_by_tag` | A user filters the links list by a specific tag. | `index.js` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1818117)
- [All link actions](https://us.posthog.com/project/483112/insights/7UuxHrtB)
- [Links created over time](https://us.posthog.com/project/483112/insights/tlhPMXJ5)
- [Search & discovery usage](https://us.posthog.com/project/483112/insights/J7hEXS3L)
- [Link engagement funnel: created to favorited](https://us.posthog.com/project/483112/insights/QW6bbb9K)
- [Content churn: creates vs deletes](https://us.posthog.com/project/483112/insights/HoX5REJv)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_API_KEY` and `POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
