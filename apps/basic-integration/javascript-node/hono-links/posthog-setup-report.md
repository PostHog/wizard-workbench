# PostHog post-wizard report

The wizard completed a server-side PostHog integration for this Hono-based link saver API. It installed `posthog-node` and `dotenv`, added environment-based PostHog initialization with exception autocapture and immediate flushing, and instrumented key API actions for creating, updating, deleting, searching, filtering, and listing link data. The integration keeps all configuration in environment variables and avoids sending raw URL strings beyond a derived host value in event properties.

| Event name | Description | File |
| --- | --- | --- |
| `link_created` | Captures when a new bookmark is saved successfully. | `index.js` |
| `link_updated` | Captures when an existing bookmark is edited successfully. | `index.js` |
| `link_deleted` | Captures when a bookmark is removed successfully. | `index.js` |
| `links_searched` | Captures when the links collection is filtered with search or tag criteria. | `index.js` |
| `favorite_filter_used` | Captures when the favorites-only filter is used while browsing links. | `index.js` |
| `tags_listed` | Captures when aggregated tag usage is requested. | `index.js` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://us.posthog.com/project/483112/dashboard/1846719)
- [Links created over time (wizard)](https://us.posthog.com/project/483112/insights/O0N13QeA)
- [Link searches (wizard)](https://us.posthog.com/project/483112/insights/TDcEai7Y)
- [Link edits vs deletions (wizard)](https://us.posthog.com/project/483112/insights/TuCTsqpN)
- [Search to save funnel (wizard)](https://us.posthog.com/project/483112/insights/ORnL9ifm)
- [Tags requested over time (wizard)](https://us.posthog.com/project/483112/insights/wkw6Qj2a)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.

### Agent skill

An agent skill folder was left in the project at `.claude/skills/integration-javascript_node`. This can be reused for further agent-driven PostHog work with up-to-date integration guidance.
