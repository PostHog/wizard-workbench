<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Fastify blog API. `posthog-node` was installed and initialized in `index.js` using environment variables. Five events are now captured across all mutating and engagement routes. A Fastify `setErrorHandler` was added to forward unhandled errors to PostHog Error Tracking, and graceful shutdown hooks flush the SDK queue on `SIGINT`/`SIGTERM`.

| Event | Description | File |
|---|---|---|
| `post_created` | Fired when a user successfully creates a new blog post | `index.js` |
| `post_updated` | Fired when a user updates an existing blog post (title, body, or published status) | `index.js` |
| `post_deleted` | Fired when a user deletes a blog post and its associated comments | `index.js` |
| `post_viewed` | Fired when a user views a single blog post — top of content engagement funnel | `index.js` |
| `comment_created` | Fired when a user successfully adds a comment to a blog post | `index.js` |

## Next steps

We were unable to automatically create a PostHog dashboard in this session because the required API scopes (`dashboard:write`, `insight:write`, `query:read`) were not available. You can create the dashboard manually:

- [Create a new dashboard](https://us.posthog.com/project/2/dashboard) — name it **"Analytics basics (wizard)"**
- [Create new insights](https://us.posthog.com/project/2/insights/new) — suggested insights:
  1. **Post creation trend** — Trends for `post_created` over time
  2. **Content engagement** — Trends for `post_viewed` over time
  3. **Comment activity** — Trends for `comment_created` over time
  4. **Content lifecycle funnel** — Funnel: `post_created` → `post_viewed` → `comment_created`
  5. **Post deletion rate** — Trends for `post_deleted` over time

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_API_KEY` and `POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
