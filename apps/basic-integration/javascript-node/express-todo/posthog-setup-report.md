<wizard-report>
# PostHog post-wizard report

The wizard has completed a PostHog integration for this Express.js todo API. The `posthog-node` SDK was installed and initialized in `index.js` using the `setupExpressRequestContext` middleware (which automatically enriches events with request metadata and reads the `x-posthog-distinct-id` and `x-posthog-session-id` headers from clients) and `setupExpressErrorHandler` (which captures unhandled Express errors into PostHog Error Tracking). Event capture calls were added to every mutating route: creating, completing, updating, and deleting todos.

| Event name | Description | File |
|---|---|---|
| `todo_created` | A new todo item was successfully created via the API. | `index.js` |
| `todo_completed` | A todo item was marked as completed. | `index.js` |
| `todo_updated` | A todo item's title was updated. | `index.js` |
| `todo_deleted` | A todo item was deleted from the list. | `index.js` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard:** [Your starter dashboard](https://us.i.posthog.com/project/483112/dashboard/1751155)
- [Todos created over time](https://us.i.posthog.com/project/483112/insights/pw1WDGEJ)
- [Todo completion funnel](https://us.i.posthog.com/project/483112/insights/OZRlLcTm)
- [Todos deleted over time](https://us.i.posthog.com/project/483112/insights/kTYCGXmg)
- [Todo events breakdown](https://us.i.posthog.com/project/483112/insights/I98ybADl)
- [Todo activity retention](https://us.i.posthog.com/project/483112/insights/4AN048IP)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set. Variables added: `POSTHOG_API_KEY`, `POSTHOG_HOST`.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
