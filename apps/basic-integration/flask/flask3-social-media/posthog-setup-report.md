# PostHog post-wizard report

The wizard integrated the PostHog Python SDK into the Flask application. It is initialized once in the application factory using `POSTHOG_API_KEY` and `POSTHOG_HOST`, with exception autocapture enabled and a shutdown handler registered for reliable delivery. Successful authentication identifies people with the stable database user ID and stores email and username as person properties. Server-side analytics now cover registration, login, publishing, following, direct messages, and export requests. The Flask 500 handler also sends captured exceptions to PostHog.

| Event name | Description | File |
| --- | --- | --- |
| `user_logged_in` | Tracks a successful password login. | `app/auth/routes.py` |
| `user_registered` | Tracks a completed account registration. | `app/auth/routes.py` |
| `post_created` | Tracks a published social post with non-content metadata. | `app/main/routes.py` |
| `user_followed` | Tracks a successful follow action. | `app/main/routes.py` |
| `message_sent` | Tracks a successful direct message with length metadata only. | `app/main/routes.py` |
| `post_export_requested` | Tracks a requested post export job. | `app/main/routes.py` |

## Next steps

The PostHog dashboard and shareable notebook could not be created because the configured PostHog MCP service was unavailable during this run. Create an **Analytics basics (wizard)** dashboard after reconnecting it, using the events listed above as its insights.

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
