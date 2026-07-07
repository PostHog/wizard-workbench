# PostHog post-wizard report

The wizard has completed a deep integration of your project. PostHog analytics have been added to `index.js` using the `posthog-node` SDK. A PostHog client is initialized at startup using environment variables, exception autocapture is enabled, and graceful shutdown handlers flush all buffered events on process exit. Five events are now captured across the contacts and groups API routes, with contextual properties on each. Errors in the main request handler are forwarded to PostHog via `captureException`.

| Event name | Description | File |
|---|---|---|
| `contact_created` | A new contact was successfully added to the contacts list. | `index.js` |
| `contact_updated` | An existing contact's details were modified via PATCH. | `index.js` |
| `contact_deleted` | A contact was removed from the contacts list. | `index.js` |
| `group_created` | A new contact group was successfully created. | `index.js` |
| `contact_searched` | A search query was performed against the contacts list. | `index.js` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1812967)
- [Contacts created (wizard)](https://us.posthog.com/project/483112/insights/AoWTGLaD)
- [Contact lifecycle funnel (wizard)](https://us.posthog.com/project/483112/insights/loNqLlVI)
- [Contact mutations over time (wizard)](https://us.posthog.com/project/483112/insights/ALEa0zNW)
- [Groups created (wizard)](https://us.posthog.com/project/483112/insights/aiTOo12I)
- [Contact searches (wizard)](https://us.posthog.com/project/483112/insights/0v6DUOKd)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_API_KEY` and `POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
