<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of your Koa notes API with PostHog. The `posthog-node` SDK was installed and initialized in `index.js` with exception autocapture enabled. Event tracking was added to all mutating route handlers (folder and note creation, update, and deletion), plus search tracking. Error tracking is wired through Koa's `app.on('error')` handler. The PostHog client shuts down gracefully on `SIGINT` and `SIGTERM`. Distinct IDs and session IDs are read from the `X-PostHog-Distinct-ID` and `X-PostHog-Session-ID` request headers so frontend sessions can be correlated with backend events.

| Event name | Description | File |
|---|---|---|
| `folder created` | A user successfully created a new note folder. | `index.js` |
| `folder deleted` | A user successfully deleted a note folder. | `index.js` |
| `note created` | A user successfully created a new note. | `index.js` |
| `note updated` | A user successfully updated an existing note. | `index.js` |
| `note deleted` | A user successfully deleted a note. | `index.js` |
| `notes searched` | A user searched for notes using a text query. | `index.js` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1824493)
- [Notes activity over time (wizard)](https://us.posthog.com/project/483112/insights/MrNn9nb7)
- [Note creation funnel (wizard)](https://us.posthog.com/project/483112/insights/MMdbtzkS)
- [Folder events over time (wizard)](https://us.posthog.com/project/483112/insights/jjr8QCA7)
- [Note deletion rate (wizard)](https://us.posthog.com/project/483112/insights/N3Zr2yf9)
- [Notes searched over time (wizard)](https://us.posthog.com/project/483112/insights/hcvezhrV)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_API_KEY` and `POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
</wizard-report>
