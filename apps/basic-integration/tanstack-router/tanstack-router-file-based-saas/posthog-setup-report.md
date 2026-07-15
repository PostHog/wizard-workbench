# PostHog post-wizard report

PostHog product analytics was initialized at the browser application entry point using the configured Vite environment variables. Login and logout flows identify users and reset anonymous state appropriately. Invoice creation, invoice updates, invoice note toggles, and team-member profile selection now capture descriptive snake_case events without sending user-entered PII as event properties. Exception capture is enabled in the SDK defaults.

## Events

| Event | Description | File |
|---|---|---|
| `user_logged_in` | A user successfully signs in to the application. | `src/routes/login.tsx` |
| `user_logged_out` | A signed-in user signs out of the application. | `src/routes/login.tsx` |
| `invoice_created` | A user submits the form to create a new invoice. | `src/routes/dashboard.invoices.index.tsx` |
| `invoice_updated` | A user saves changes to an existing invoice. | `src/routes/dashboard.invoices.$invoiceId.tsx` |
| `invoice_notes_toggled` | A user opens or closes the internal notes section for an invoice. | `src/routes/dashboard.invoices.$invoiceId.tsx` |
| `team_member_selected` | A user opens a team member profile. | `src/routes/dashboard.users.user.tsx` |

## Next steps

Dashboard creation was unavailable because the PostHog MCP server could not connect in this run. No dashboard or insight links were created.

## Verify before merging

- [ ] Run a full production build and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite; instrumented call sites may need updated mocks or fixtures.
- [ ] Add `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` to `.env.example` and any bootstrap documentation.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or the bundler upload step) into CI for production stack traces.
- [ ] Confirm the returning-visitor path also calls `identify`; the current demo auth state is in-memory and only identifies on fresh login.

### Agent skill

We've left an agent skill folder in the project to provide up-to-date PostHog integration context for future agent development.
