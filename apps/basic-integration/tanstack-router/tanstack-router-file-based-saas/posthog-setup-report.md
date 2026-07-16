# PostHog post-wizard report

PostHog has been added to this React TanStack Router application. The browser SDK is initialized at the root using Vite environment variables, with exception capture enabled. User sign-in identifies the authenticated demo user and tracks login/logout, while invoice creation and updates emit business events after successful mutations. Invoice mutation failures are captured as exceptions without sending user-entered invoice content.

| Event | Description | File |
| --- | --- | --- |
| `user_logged_in` | Tracks successful sign-in to the CloudFlow workspace. | `src/routes/login.tsx` |
| `user_logged_out` | Tracks a user ending their authenticated session. | `src/routes/login.tsx` |
| `invoice_created` | Tracks successful creation of an invoice. | `src/routes/dashboard.invoices.index.tsx` |
| `invoice_updated` | Tracks successful saving of invoice changes. | `src/routes/dashboard.invoices.$invoiceId.tsx` |

## Next steps

A dashboard and notebook could not be created because the PostHog MCP server was unavailable in this environment. Reconnect the server, then create **Analytics basics (wizard)** with insights for the four events above.

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
