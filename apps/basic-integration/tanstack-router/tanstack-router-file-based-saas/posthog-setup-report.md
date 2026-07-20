# PostHog post-wizard report

The wizard integrated PostHog into this React and TanStack Router application. It installed the browser SDK and React bindings, initialized analytics at the root route from Vite environment variables, preserved default autocapture and session recording, enabled exception capture, identified users on login, reset identity on logout, and added business events for authentication, invoices, and subscription intent. The production build completed successfully.

| Event | Description | File |
| --- | --- | --- |
| `user_logged_in` | A user successfully signs in to CloudFlow. | `src/routes/login.tsx` |
| `user_logged_out` | An authenticated user signs out of CloudFlow. | `src/routes/login.tsx` |
| `invoice_created` | A user successfully creates a new invoice. | `src/routes/dashboard.invoices.index.tsx` |
| `invoice_updated` | A user successfully saves changes to an existing invoice. | `src/routes/dashboard.invoices.$invoiceId.tsx` |
| `subscription_upgrade_clicked` | A user clicks the subscription upgrade call to action. | `src/routes/_auth.profile.tsx` |

## Next steps

The dashboard and notebook could not be created because the PostHog MCP server was unavailable at setup time. Once access is restored, create an **Analytics basics (wizard)** dashboard with a login-to-upgrade funnel and trends for invoice creation, invoice updates, and logout activity.

## Verify before merging

- [ ] Run a full production build and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or the bundler upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — the current demo authentication only identifies on fresh login.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
