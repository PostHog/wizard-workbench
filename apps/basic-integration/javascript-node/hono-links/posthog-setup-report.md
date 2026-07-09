<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of this Hono-based Node.js links API. It installed `posthog-node`, initialized the PostHog server SDK using environment variables, added server-side event capture for core link lifecycle actions and filtered list usage, added exception capture around instrumented API handlers, and configured graceful shutdown flushing for queued analytics events.

| Event name | Description | File |
| --- | --- | --- |
| `link_created` | Captures when a new link is saved to the API with metadata about tags, description presence, and favorite state. | `index.js` |
| `link_updated` | Captures when an existing link is modified, including which fields changed and the resulting tag and favorite state. | `index.js` |
| `link_deleted` | Captures when a saved link is removed from the API. | `index.js` |
| `links_filtered` | Captures when the links listing endpoint is used with tag, search, or favorites filters. | `index.js` |
| `link_not_found` | Captures when read, update, or delete operations request a missing link. | `index.js` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- Dashboard: https://us.posthog.com/project/483112/dashboard/1825351
- Insight: Links created over time (wizard) — https://us.posthog.com/project/483112/insights/nQ35GX40
- Insight: Link lifecycle funnel (wizard) — https://us.posthog.com/project/483112/insights/ZQCNFCOH
- Insight: Filters used by type (wizard) — https://us.posthog.com/project/483112/insights/HyGgYuEL
- Insight: Not found operations (wizard) — https://us.posthog.com/project/483112/insights/1oAOtVMa
- Insight: Links deleted over time (wizard) — https://us.posthog.com/project/483112/insights/uEbTf6H5

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
