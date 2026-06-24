<wizard-report>
# PostHog post-wizard report

The wizard has completed a full PostHog integration for the Fastify blog API. Changes were made exclusively to `index.js` and `package.json`. A `posthog-node` client is initialized at startup using environment variables, with `enableExceptionAutocapture: true` enabled. Every mutating route now calls `posthog.capture()` with contextual properties; the single read route (`GET /api/posts/:id`) fires a `post_viewed` event at the top of the content-engagement funnel. The `author` field is used as the `distinctId` throughout, and `posthog.identify()` is called on first post creation to associate the author name with their profile. A Fastify `setErrorHandler` forwards all unhandled errors to `posthog.captureException()`. Graceful shutdown on `SIGINT`/`SIGTERM` calls `posthog.shutdown()` to flush any remaining queued events before the process exits. The `package.json` scripts were updated with `--env-file .env` so PostHog credentials are loaded automatically when running `npm start` or `npm run dev`.

| Event name | Description | File |
|---|---|---|
| `post_created` | Fires when a user successfully creates a new blog post. | `index.js` |
| `post_published` | Fires when a post's published status is set to true via the update endpoint. | `index.js` |
| `post_updated` | Fires when a post's title or body is updated (excluding publish-only changes). | `index.js` |
| `post_deleted` | Fires when a blog post and its comments are successfully deleted. | `index.js` |
| `comment_added` | Fires when a user successfully adds a comment to a post. | `index.js` |
| `post_viewed` | Fires when a single post is fetched — top of the content engagement funnel. | `index.js` |

## Next steps

We've built some insights and added them to your PostHog dashboard so you can monitor user behaviour based on the events we just instrumented:

- **Dashboard:** [Your starter dashboard](https://us.posthog.com/project/483112/dashboard/1751155)
- [Post creation trend (wizard)](https://us.posthog.com/project/483112/insights/JLXnEuID) — daily count of posts created over the last 30 days
- [Content engagement funnel (wizard)](https://us.posthog.com/project/483112/insights/fVsaQT3M) — funnel from `post_viewed` → `post_created` → `post_published`
- [Comment engagement over time (wizard)](https://us.posthog.com/project/483112/insights/URY1Dnk4) — daily count of comments added over the last 30 days
- [Post deletion rate — churn signal (wizard)](https://us.posthog.com/project/483112/insights/nPCCqnQC) — daily post deletions as a churn indicator
- [Post update activity (wizard)](https://us.posthog.com/project/483112/insights/F8QIX1Ta) — daily post updates vs. publishes over the last 30 days

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_API_KEY` and `POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh post creation can leave returning sessions on anonymous distinct IDs (consider also identifying on comment authorship).

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
