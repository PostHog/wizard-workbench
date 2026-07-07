<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the Fastify blog API. The `posthog-node` SDK was installed and a PostHog client was initialized in `index.js` using environment variables. Five events are now tracked across all write routes: post creation, post updates, post publication (a distinct transition event), post deletion, and comment creation. The `author` field from each request is used as the `distinctId` so events are attributed to individual users. A Fastify `setErrorHandler` was added to automatically capture unhandled exceptions with `captureException`. Graceful shutdown handlers (`SIGINT`/`SIGTERM`) ensure any queued events are flushed before the process exits.

| Event name | Description | File |
|---|---|---|
| `post created` | Fired when a user successfully creates a new blog post. | `index.js` |
| `post updated` | Fired when a user updates an existing blog post's title, body, or published status. | `index.js` |
| `post published` | Fired specifically when a post transitions from unpublished to published. | `index.js` |
| `post deleted` | Fired when a user deletes a blog post and its associated comments. | `index.js` |
| `comment added` | Fired when a user adds a comment to a blog post. | `index.js` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1812981)
- [Blog activity over time](https://us.posthog.com/project/483112/insights/xz4Tj9Oh)
- [Post creation to publication funnel](https://us.posthog.com/project/483112/insights/S0wbQrBQ)
- [Active authors](https://us.posthog.com/project/483112/insights/au8ZEaCW)
- [Post churn rate](https://us.posthog.com/project/483112/insights/BG8gRwhe)
- [Comment engagement trend](https://us.posthog.com/project/483112/insights/FlLNYt59)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_API_KEY` and `POSTHOG_HOST` to `.env.example` and any onboarding scripts so collaborators know what to set.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
