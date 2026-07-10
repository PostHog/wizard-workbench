<wizard-report>
# PostHog post-wizard report

The wizard completed a PostHog integration for this pure Python meeting summarizer by adding a shared Python PostHog client, wiring server-side event capture and exception reporting into authentication and meeting lifecycle endpoints, and adding browser-side analytics for login, dashboard engagement, and meeting interactions. Environment-backed browser configuration is now served from the app so no PostHog token or host is hardcoded in source, and the project dependency list now includes the PostHog Python SDK and python-dotenv.

| Event | Description | File |
| --- | --- | --- |
| `user_logged_in` | Tracks successful user login on the server and links the authenticated user profile. | `server.py` |
| `meeting_created` | Tracks successful transcript analysis and meeting creation for an authenticated user. | `server.py` |
| `meeting_deleted` | Tracks when a user deletes one of their analyzed meetings. | `server.py` |
| `meetings_viewed` | Tracks when the dashboard loads a user’s meeting list. | `static/app.js` |
| `meeting_detail_viewed` | Tracks when a user opens a specific meeting detail view. | `static/app.js` |
| `meeting_upload_submitted` | Tracks when a user submits a transcript for analysis from the dashboard. | `static/app.js` |
| `user_login_submitted` | Tracks when a user submits the login form. | `static/login.js` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://us.posthog.com/project/483112/dashboard/1831066)
- [Login attempts (wizard)](https://us.posthog.com/project/483112/insights/7k1CM71v)
- [Successful logins (wizard)](https://us.posthog.com/project/483112/insights/ePA9raPy)
- [Meetings created (wizard)](https://us.posthog.com/project/483112/insights/a8BnHgvr)
- [Meeting engagement (wizard)](https://us.posthog.com/project/483112/insights/roaK1qk4)
- [Login conversion funnel (wizard)](https://us.posthog.com/project/483112/insights/FBWVw1y8)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
