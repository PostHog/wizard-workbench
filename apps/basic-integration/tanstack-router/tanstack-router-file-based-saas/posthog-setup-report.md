# PostHog post-wizard report

The wizard integrated PostHog browser analytics into this React application. It installed `posthog-js` and `@posthog/react`, configured the browser client from Vite environment variables, enabled exception capture, and added authenticated user identification plus product events around sign-in and invoice lifecycle actions. Event properties intentionally use only stable invoice identifiers and avoid user-entered content.

| Event name | Description | File |
| --- | --- | --- |
| `user_signed_in` | Tracks a successful sign-in after a user submits the login form. | `src/routes/login.tsx` |
| `user_signed_out` | Tracks when an authenticated user signs out. | `src/routes/login.tsx` |
| `invoice_created` | Tracks a successful invoice creation with non-PII invoice metadata. | `src/routes/dashboard.invoices.index.tsx` |
| `invoice_updated` | Tracks a successful invoice update with its stable invoice identifier. | `src/routes/dashboard.invoices.$invoiceId.tsx` |

## Next steps

The PostHog MCP service was unavailable during this run, so a dashboard, insights, and shareable notebook could not be created. Create an **Analytics basics (wizard)** dashboard in PostHog and add trends for `user_signed_in`, `invoice_created`, and `invoice_updated`, plus a funnel from `user_signed_in` to `invoice_created`.

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — a handler that only identifies on fresh login can leave returning sessions on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
