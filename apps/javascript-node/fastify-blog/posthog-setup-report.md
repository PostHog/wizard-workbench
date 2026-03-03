<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the `fastify-blog` Node.js application. The `posthog-node` SDK was installed and a singleton client (`posthog.js`) was created using environment variables for the API key and host. Event capture calls were added to all mutating route handlers, exception tracking was wired into Fastify's `setErrorHandler`, and graceful shutdown hooks ensure all buffered events are flushed before the process exits.

| Event | Description | File |
|---|---|---|
| `post_created` | A new blog post was created | `index.js` |
| `post_updated` | A blog post was updated (title, body, or published status changed) | `index.js` |
| `post_deleted` | A blog post and its comments were deleted | `index.js` |
| `comment_created` | A comment was added to a blog post | `index.js` |

## Next steps

To monitor user behavior, create an **"Analytics basics"** dashboard in PostHog (https://us.i.posthog.com) with the following suggested insights:

1. **Post creation trend** — Trend of `post_created` over time
2. **Comment creation trend** — Trend of `comment_created` over time
3. **Post deletion rate** — Trend of `post_deleted` over time
4. **Content funnel** — Funnel: `post_created` → `post_updated` (published=true) to track publish rate
5. **Top authors** — Breakdown of `post_created` by `distinctId` to see most active authors

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
