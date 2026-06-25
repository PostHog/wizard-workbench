<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the Hono links API. The `posthog-node` SDK was installed, initialized with environment variables, and event capture calls were added to every mutating route handler. Exception capture was added around JSON parsing in POST and PATCH routes. A graceful shutdown handler was added to flush events before process exit.

| Event name | Description | File |
|---|---|---|
| `link_saved` | Fired when a user saves a new bookmark link via the API. | `index.js` |
| `link_updated` | Fired when a user updates an existing link's properties. | `index.js` |
| `link_deleted` | Fired when a user deletes a bookmark link. | `index.js` |
| `link_searched` | Fired when a user searches links by keyword. | `index.js` |
| `links_filtered_by_tag` | Fired when a user filters the link list by a specific tag. | `index.js` |
| `links_filtered_by_favorites` | Fired when a user filters the link list to show only favorites. | `index.js` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://us.i.posthog.com/project/483112/dashboard/1761137)
- [Links saved over time](https://us.i.posthog.com/project/483112/insights/9588740)
- [Links deleted (churn signal)](https://us.i.posthog.com/project/483112/insights/9588742)
- [Search and filter feature usage](https://us.i.posthog.com/project/483112/insights/9588743)
- [Links saved vs deleted](https://us.i.posthog.com/project/483112/insights/9588744)
- [Link lifecycle funnel: save → update → delete](https://us.i.posthog.com/project/483112/insights/9588745)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_API_KEY` and `POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
