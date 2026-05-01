<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Koa.js notes API. Here's a summary of what was done:

- **Installed** `posthog-node` as a dependency
- **Initialized** the PostHog client in `index.js` with `enableExceptionAutocapture: true` for automatic uncaught error capture
- **Added event tracking** to all mutating route handlers (create, update, delete) for both folders and notes
- **Added error tracking** via Koa's `app.on('error')` handler using `posthog.captureException()`
- **Added graceful shutdown** via `process.on('SIGINT')` to flush all queued events before exit
- **Set up environment variables** in `.env` (`POSTHOG_API_KEY`, `POSTHOG_HOST`)

> **Note:** This API has no authentication layer, so events are captured with `distinctId: 'anonymous'`. If you add user authentication in future, update the `distinctId` in each capture call to reflect the authenticated user's ID.

## Events instrumented

| Event | Description | File |
|---|---|---|
| `folder_created` | A new folder is successfully created via POST /api/folders | `index.js` |
| `folder_deleted` | A folder is successfully deleted via DELETE /api/folders/:id | `index.js` |
| `note_created` | A new note is successfully created via POST /api/notes | `index.js` |
| `note_updated` | A note is successfully updated via PATCH /api/notes/:id | `index.js` |
| `note_deleted` | A note is successfully deleted via DELETE /api/notes/:id | `index.js` |

## Next steps

Create an **"Analytics basics"** dashboard in PostHog with these 5 recommended insights:

1. **Notes created over time** — Trend of `note_created` events, shows content creation velocity
   [Create insight →](https://us.posthog.com/project/2/insights/new?insight=TRENDS)

2. **Notes deleted over time** — Trend of `note_deleted` events, a proxy for churn/dissatisfaction
   [Create insight →](https://us.posthog.com/project/2/insights/new?insight=TRENDS)

3. **Create-to-delete funnel** — Funnel from `note_created` → `note_deleted`, shows note retention
   [Create insight →](https://us.posthog.com/project/2/insights/new?insight=FUNNELS)

4. **Folder usage** — Trend of `folder_created` and `folder_deleted`, shows how users organise notes
   [Create insight →](https://us.posthog.com/project/2/insights/new?insight=TRENDS)

5. **Application errors** — Trend of `$exception` events, monitors server health
   [Create insight →](https://us.posthog.com/project/2/insights/new?insight=TRENDS)

[Create new dashboard →](https://us.posthog.com/project/2/dashboard/new)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
