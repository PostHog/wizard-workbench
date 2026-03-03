<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your Fastify blog API. The `posthog-node` SDK was installed and initialized in `index.js` using environment variables for the API key and host. Four event captures were added across the route handlers that represent the most business-critical actions: post creation, post publishing (the key conversion event), post deletion (a churn signal), and comment creation (an engagement signal). A Fastify error handler was wired up to automatically capture exceptions via `posthog.captureException()`, and graceful shutdown hooks ensure all queued events are flushed before the process exits.

| Event name | Description | File |
|---|---|---|
| `post_created` | A new blog post has been created by an author | `index.js` |
| `post_published` | A blog post has been published (published set to true) | `index.js` |
| `post_deleted` | A blog post and its comments have been deleted | `index.js` |
| `comment_added` | A comment has been added to a blog post | `index.js` |

## Next steps

We've designed an "Analytics basics" dashboard with five insights to keep an eye on user behavior. Create them in your PostHog project at **https://us.i.posthog.com/project/2**:

1. **Post creation trend** — Trends insight on `post_created`, broken down over time. Shows content velocity.
2. **Post publish funnel** — Funnel from `post_created` → `post_published`. Reveals how many drafts make it to publication.
3. **Post deletions (churn signal)** — Trends insight on `post_deleted`. Spikes here may indicate dissatisfied authors.
4. **Comment engagement trend** — Trends insight on `comment_added`. Tracks reader engagement with published content.
5. **Top authors by activity** — Trends insight on `post_created` broken down by `distinctId`. Surfaces your most active contributors.

To create the dashboard: go to **Dashboards → New dashboard**, name it "Analytics basics", then add each insight above using **+ Add insight**.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-javascript_node/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
