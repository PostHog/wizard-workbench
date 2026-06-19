<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Fastify blog API. The `posthog-node` SDK was installed and initialized in `index.js` using environment variables for the API key and host. PostHog `capture()` calls were added to every write route handler — post creation, update, publishing, deletion, and comment addition. `identify()` is called when authors create posts or comments so their activity is linked to a person profile. A Fastify `setErrorHandler` was added to forward unhandled errors to PostHog exception tracking. Graceful shutdown handlers flush remaining events on `SIGINT`/`SIGTERM`.

| Event Name | Description | File |
|---|---|---|
| `post created` | Fires when a user successfully creates a new blog post. | `index.js` |
| `post updated` | Fires when a user successfully updates an existing blog post. | `index.js` |
| `post published` | Fires when a post is published (published field changes to true). | `index.js` |
| `post deleted` | Fires when a user deletes a blog post and all its associated comments. | `index.js` |
| `comment added` | Fires when a user successfully adds a comment to a blog post. | `index.js` |

## Next steps

The following dashboard and insights were planned for creation in PostHog. Dashboard creation requires `dashboard:write` and `insight:write` API key scopes which were not available in this environment — create them manually in PostHog:

**Dashboard:** "Analytics basics (wizard)" — navigate to Project → Dashboards → New Dashboard

**Suggested insights to add:**
1. **Post creation over time** — Trend for `post created` event
2. **Comment activity over time** — Trend for `comment added` event
3. **Post creation to publishing funnel** — Funnel from `post created` → `post published`
4. **Post deletions** — Trend for `post deleted` event
5. **Content engagement** — Combined trend for `post created` and `comment added`

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_API_KEY` and `POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
