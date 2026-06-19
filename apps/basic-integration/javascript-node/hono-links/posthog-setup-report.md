# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Hono bookmark/link saver API. A `PostHog` client was added to `index.js` using the `posthog-node` SDK, initialised from environment variables (`POSTHOG_API_KEY`, `POSTHOG_HOST`). Six events are captured across the API's route handlers covering every meaningful user action: saving, updating, deleting, and favoriting links, plus search and tag-filter operations. An `app.onError` handler was wired to `posthog.captureException()` for automatic error tracking.

| Event name | Description | File |
|---|---|---|
| `link_saved` | User saves a new bookmark link with a URL and title. | `index.js` |
| `link_updated` | User updates an existing bookmark link's properties. | `index.js` |
| `link_deleted` | User deletes a bookmark link. | `index.js` |
| `link_favorited` | User marks or unmarks a link as a favorite. | `index.js` |
| `link_searched` | User searches through their saved links by keyword. | `index.js` |
| `link_filtered_by_tag` | User filters their saved links by a specific tag. | `index.js` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://us.i.posthog.com/project/2/dashboard/906767)
- [Total links saved over time](https://us.i.posthog.com/project/2/insights/L2APBFLI)
- [Links saved vs deleted](https://us.i.posthog.com/project/2/insights/FECGXT5V)
- [Most common search terms](https://us.i.posthog.com/project/2/insights/VYXVS8ST)
- [Favorites activity](https://us.i.posthog.com/project/2/insights/2HL4VK06)
- [Tag filter usage](https://us.i.posthog.com/project/2/insights/3ZDPDBOE)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names (`POSTHOG_API_KEY`, `POSTHOG_HOST`) to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
