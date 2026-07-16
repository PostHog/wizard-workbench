# PostHog post-wizard report

PostHog has been integrated into this React application. The client SDK is initialized at the code-based router root with the configured Vite environment variables, default analytics behavior remains enabled, and exception capture is enabled. The root UI is wrapped so route components can access the PostHog client. Login identifies the demo user with a stable application-derived distinct ID, and logout resets that identity. Key invoicing and upgrade interactions are now tracked without sending form content or other user-entered data in event properties.

| Event name | Description | File |
| --- | --- | --- |
| `user_logged_in` | A user successfully signs in to CloudFlow. | `src/main.tsx` |
| `invoice_created` | A user successfully creates an invoice. | `src/main.tsx` |
| `invoice_updated` | A user successfully saves changes to an invoice. | `src/main.tsx` |
| `subscription_upgrade_clicked` | A user clicks the upgrade action from account settings. | `src/main.tsx` |

## Next steps

The PostHog MCP server was unavailable in this environment, so the requested dashboard, insights, and shareable notebook could not be created. Reconnect the server and create an **Analytics basics (wizard)** dashboard with insights for the four events above.

## Verify before merging

- [ ] Run a full production build and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in this project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
