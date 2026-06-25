<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of your project. PostHog was installed as a dependency (`posthog-node`) and initialized in `index.js` using environment variables for the API key and host. Five analytics events were instrumented across the contacts and groups API routes, covering every write operation. Exception capture was added to the top-level error handler so unhandled server errors are automatically reported. A graceful shutdown hook ensures all queued events are flushed before the process exits. Client-side session correlation is supported via the `X-POSTHOG-DISTINCT-ID` request header.

| Event name | Description | File |
|---|---|---|
| `contact_created` | Fires when a new contact is successfully added to the address book. | `index.js` |
| `contact_updated` | Fires when an existing contact's details are successfully modified. | `index.js` |
| `contact_deleted` | Fires when a contact is permanently removed from the address book. | `index.js` |
| `group_created` | Fires when a new contact group is successfully created. | `index.js` |
| `contact_searched` | Fires when a user performs a search query against the contacts list. | `index.js` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Dashboard: Your starter dashboard](https://us.posthog.com/project/483112/dashboard/1751155)
- [Contacts created over time](https://us.posthog.com/project/483112/insights/blwxfpuP/)
- [Contact actions breakdown](https://us.posthog.com/project/483112/insights/fvZyQKhG/)
- [Contact creation funnel](https://us.posthog.com/project/483112/insights/BY4lBhkI/)
- [Groups created over time](https://us.posthog.com/project/483112/insights/1yItVbu5/)
- [Contact searches over time](https://us.posthog.com/project/483112/insights/2J0GGS2Q/)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set (`POSTHOG_API_KEY`, `POSTHOG_HOST`).

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
