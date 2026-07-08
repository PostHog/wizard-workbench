<wizard-report>
# PostHog post-wizard report

The wizard has completed a full PostHog integration for this Express.js todo API. The `posthog-node` SDK was installed and initialized in `index.js` with `enableExceptionAutocapture: true`. The `setupExpressRequestContext` middleware was added before all routes so that incoming `x-posthog-distinct-id` and `x-posthog-session-id` headers are automatically propagated to captured events. Each mutating route — create, update, and delete — now captures a PostHog event with relevant properties. The `setupExpressErrorHandler` middleware was registered after all routes for automatic error tracking. A graceful shutdown handler flushes all queued events on `SIGINT`.

| Event name | Description | File |
|---|---|---|
| `todo created` | Fires when a user successfully creates a new todo item. | `index.js` |
| `todo updated` | Fires when a user updates an existing todo item's title or completion status. | `index.js` |
| `todo deleted` | Fires when a user successfully deletes an existing todo item. | `index.js` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1818128)
- [Todo actions over time](https://us.posthog.com/project/483112/insights/IgTiLyPZ)
- [Todos created (last 30 days)](https://us.posthog.com/project/483112/insights/TaR9bXf0)
- [Todo lifecycle funnel](https://us.posthog.com/project/483112/insights/wUxoNkNt)
- [Todo operations by type](https://us.posthog.com/project/483112/insights/MQysaoJZ)
- [Daily active users on todos](https://us.posthog.com/project/483112/insights/2cxBLYwo)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_API_KEY` and `POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
