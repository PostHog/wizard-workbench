# PostHog post-wizard report

The wizard has completed a deep integration of this Fastify blog API. `posthog-node` was installed and a `PostHog` client is initialized at startup using `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` environment variables. Five analytics events are now captured across the blog's mutation routes, and uncaught errors are forwarded to PostHog error tracking via `captureException` in a Fastify `setErrorHandler`.

| Event | Description | File |
|---|---|---|
| `post_created` | Fired when a new blog post is created via POST /api/posts | `index.js` |
| `post_updated` | Fired when a blog post is updated via PATCH /api/posts/:id | `index.js` |
| `post_published` | Fired when a post's published flag transitions to true | `index.js` |
| `post_deleted` | Fired when a blog post and its comments are deleted | `index.js` |
| `comment_added` | Fired when a comment is added to a blog post | `index.js` |

## Next steps

The PostHog MCP API key in use did not have `dashboard:write` / `insight:write` / `query:read` scopes, so the dashboard could not be created automatically. Create a dashboard named **"Analytics basics (wizard)"** in PostHog manually with these five suggested insights:

1. **Post creation trend** — Trends chart for `post_created` over time (weekly).
2. **Post publishing funnel** — Funnel: `post_created` → `post_published` (conversion rate from draft to live).
3. **Comment engagement trend** — Trends chart for `comment_added` over time.
4. **Post deletion (churn signal)** — Trends chart for `post_deleted` over time; spikes may indicate content dissatisfaction.
5. **Active authors** — Trends chart for `post_created` broken down by `author` property.

[Open PostHog dashboards](https://us.posthog.com/project/2/dashboards)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
