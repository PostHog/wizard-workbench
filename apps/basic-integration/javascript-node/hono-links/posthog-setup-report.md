# PostHog post-wizard report

The wizard integrated the PostHog Node.js SDK into the Hono links API. The application now initializes PostHog from required environment variables, captures link creation, update, and deletion events, correlates requests using PostHog distinct/session headers when available, captures unhandled route exceptions, flushes request events before responses, and shuts down the SDK cleanly on process termination.

| Event | Description | File |
| --- | --- | --- |
| `link_created` | A link was successfully saved to the collection. | `index.js` |
| `link_updated` | An existing link was successfully updated. | `index.js` |
| `link_deleted` | An existing link was successfully deleted. | `index.js` |

## Next steps

Dashboard and insight creation could not be completed because the PostHog MCP server was unavailable during setup. Reconnect the PostHog MCP server and create an “Analytics basics (wizard)” dashboard using the events above.

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
