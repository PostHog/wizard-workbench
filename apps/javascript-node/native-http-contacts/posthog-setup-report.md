<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this native Node.js HTTP contacts API. The `posthog-node` SDK was installed and initialized in `index.js` using environment variables for the API key and host. Five business-critical events are now tracked across the contacts and groups API routes, exception capture was added to the global error handler, and graceful shutdown ensures queued events are flushed on process exit.

| Event | Description | File |
|---|---|---|
| `contact created` | Fired when a new contact is successfully added via `POST /api/contacts` | `index.js` |
| `contact updated` | Fired when an existing contact is successfully updated via `PATCH /api/contacts/:id` | `index.js` |
| `contact deleted` | Fired when a contact is successfully deleted via `DELETE /api/contacts/:id` | `index.js` |
| `group created` | Fired when a new contact group is successfully created via `POST /api/groups` | `index.js` |
| `contact searched` | Fired when a user searches contacts using the `search` query parameter | `index.js` |

## Next steps

You can build insights and dashboards to monitor user behavior using the events above in your PostHog project:

- [PostHog project — Analytics](https://us.posthog.com/project/238460/insights)
- [Create a new dashboard](https://us.posthog.com/project/238460/dashboard)

Suggested insights to create:
1. **Contacts created over time** — Trend of `contact created` events to monitor growth
2. **Contacts deleted vs. created** — Compare `contact created` and `contact deleted` to track net contact growth
3. **Group creation trend** — Trend of `group created` events
4. **Contact management funnel** — Funnel from `contact created` → `contact updated` to see engagement with contacts after creation
5. **Search usage** — Trend of `contact searched` with `result_count` breakdown

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
