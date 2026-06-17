<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of your project. `posthog-node` was installed and a PostHog client is initialized in `index.js` using environment variables (`POSTHOG_API_KEY`, `POSTHOG_HOST`). The client uses `withContext` per incoming request to propagate a distinct ID (from the `X-POSTHOG-DISTINCT-ID` header, falling back to the client IP) and session ID (`X-POSTHOG-SESSION-ID`) to all events captured within that request. Exception autocapture is enabled. On contact creation, `identify` is called to build a person profile; all subsequent contact events use the contact's email as the distinct ID so actions are linked to the same person. Graceful shutdown is wired to `SIGINT` and `SIGTERM` so queued events are flushed before the process exits.

| Event | Description | File |
|---|---|---|
| `contact created` | Fired when a new contact is successfully created via `POST /api/contacts` | `index.js` |
| `contact updated` | Fired when an existing contact is updated via `PATCH /api/contacts/:id` | `index.js` |
| `contact deleted` | Fired when a contact is deleted via `DELETE /api/contacts/:id` | `index.js` |
| `group created` | Fired when a new group is created via `POST /api/groups` | `index.js` |

## Next steps

The PostHog API key in use does not have `dashboard:write` or `insight:write` scopes, so the dashboard could not be created automatically. Create the **"Analytics basics (wizard)"** dashboard manually using the links below, with the following recommended insights:

1. **Contact creation trend** — Trends chart for `contact created` over time
2. **Contact deletion trend** — Trends chart for `contact deleted` over time (churn signal)
3. **Group creation trend** — Trends chart for `group created` over time
4. **Contact lifecycle funnel** — Funnel: `contact created` → `contact updated` → `contact deleted`
5. **Contacts updated by field** — Trends chart for `contact updated` broken down by `updated_fields`

- [Create dashboard](https://us.posthog.com/project/2/dashboard)
- [New insight](https://us.posthog.com/project/2/insights/new)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_API_KEY` and `POSTHOG_HOST` to `.env.example` and any bootstrap scripts so collaborators know what to set.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh contact creation can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
