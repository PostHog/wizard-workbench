<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Koa notes API. A `PostHog` client is initialized at startup using environment variables (`POSTHOG_API_KEY`, `POSTHOG_HOST`). Six capture events were added across the route handlers in `index.js`, covering all mutating actions and the search flow. Error tracking is wired up via Koa's `app.on('error')` handler using `posthog.captureException`. Each event uses the `x-posthog-distinct-id` request header as the `distinctId` when present, falling back to the client IP, so API consumers can correlate server events with client-side sessions by sending that header.

| Event name | Description | File |
|---|---|---|
| `folder_created` | Fired when a user successfully creates a new folder. | index.js |
| `folder_deleted` | Fired when a user successfully deletes a folder. | index.js |
| `note_created` | Fired when a user successfully creates a new note. | index.js |
| `note_updated` | Fired when a user successfully updates an existing note. | index.js |
| `note_deleted` | Fired when a user successfully deletes a note. | index.js |
| `note_searched` | Fired when a user searches notes by keyword. | index.js |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1787363)
- [Note creation trend over time](https://us.posthog.com/project/483112/insights/a2SVPt4e)
- [Note lifecycle funnel](https://us.posthog.com/project/483112/insights/x6aJ8o7o)
- [Search usage trend](https://us.posthog.com/project/483112/insights/Sl3SWJza)
- [Folder management: created vs deleted](https://us.posthog.com/project/483112/insights/vvUuWLeL)
- [Most active events overview](https://us.posthog.com/project/483112/insights/WrbAoWTA)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names (`POSTHOG_API_KEY`, `POSTHOG_HOST`) to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
