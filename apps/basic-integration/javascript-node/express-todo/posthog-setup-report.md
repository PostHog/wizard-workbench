<wizard-report>
# PostHog post-wizard report

The wizard has completed a server-side PostHog integration for this Express todo API. It installed `posthog-node`, initialized the SDK with environment variables, enabled exception autocapture, added server-side event capture for list/create/update/delete todo routes, and added error capture in Express error middleware. It also configured local `.env` values for PostHog and created a starter analytics dashboard with five insights focused on API usage and todo lifecycle behavior.

| Event name | Description | File |
| --- | --- | --- |
| `todos_listed` | Captures when the todo collection is fetched from the API. | `index.js` |
| `todo_created` | Captures when a new todo is successfully created. | `index.js` |
| `todo_updated` | Captures when an existing todo is modified. | `index.js` |
| `todo_deleted` | Captures when a todo is successfully deleted. | `index.js` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- Dashboard: https://us.posthog.com/project/483112/dashboard/1825308
- Insight: Todos listed trend (wizard) — https://us.posthog.com/project/483112/insights/WdD8WIIy
- Insight: Todo lifecycle volume (wizard) — https://us.posthog.com/project/483112/insights/FzR3L3yc
- Insight: Todo completion updates (wizard) — https://us.posthog.com/project/483112/insights/iJ7XWtUZ
- Insight: Created vs deleted mix (wizard) — https://us.posthog.com/project/483112/insights/CzfWkgJR
- Insight: Todo workflow funnel (wizard) — https://us.posthog.com/project/483112/insights/DsUNMb7a

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
