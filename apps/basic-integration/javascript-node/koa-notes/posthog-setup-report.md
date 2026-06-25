<wizard-report>
# PostHog post-wizard report

The wizard has completed a full integration of PostHog analytics into this Koa Notes API. The `posthog-node` SDK was installed and initialized in `index.js` using environment variables for the project token and host. Capture calls were added to every route handler that creates, updates, or deletes data, and error tracking was wired into Koa's `app.on('error')` event. Graceful shutdown handlers flush any pending events on `SIGINT`/`SIGTERM`.

| Event name | Description | File |
|---|---|---|
| `note_created` | A new note is successfully created in a folder. | `index.js` |
| `note_updated` | An existing note's title, content, or folder is updated. | `index.js` |
| `note_deleted` | A note is permanently deleted. | `index.js` |
| `folder_created` | A new folder is successfully created. | `index.js` |
| `folder_deleted` | A folder is deleted and its notes are moved to General. | `index.js` |
| `notes_searched` | A user searches notes by keyword. | `index.js` |

## Next steps

We've built some insights and linked them to your PostHog dashboard to help you keep an eye on user behavior:

- **Dashboard:** [Your starter dashboard](https://us.posthog.com/project/483112/dashboard/1751155)
- [Notes created over time](https://us.posthog.com/project/483112/insights/yy5lDM4v)
- [Note lifecycle funnel (created → updated)](https://us.posthog.com/project/483112/insights/Yq1BTyaK)
- [Notes deleted over time](https://us.posthog.com/project/483112/insights/W9bVu3fw)
- [Notes searched over time](https://us.posthog.com/project/483112/insights/te7crYVV)
- [Folder events over time](https://us.posthog.com/project/483112/insights/gWgkvHaQ)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_API_KEY` and `POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
