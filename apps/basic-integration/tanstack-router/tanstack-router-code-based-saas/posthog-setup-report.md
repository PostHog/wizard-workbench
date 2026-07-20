# PostHog post-wizard report

The wizard integrated PostHog into this React and TanStack Router application. It installed the React SDK, configured initialization at the root route using Vite environment variables, retained default autocapture and session recording behavior, enabled exception capture, identified signed-in users with stable generated IDs, reset identity on logout, and added targeted product events around authentication, invoicing, subscription intent, and team sorting. The production build and TypeScript checks pass.

| Event | Description | File |
| --- | --- | --- |
| `user_logged_in` | A user successfully signs in to CloudFlow. | `src/main.tsx` |
| `user_logged_out` | An authenticated user signs out of CloudFlow. | `src/main.tsx` |
| `invoice_created` | A new invoice is successfully created. | `src/main.tsx` |
| `invoice_updated` | An existing invoice is successfully updated. | `src/main.tsx` |
| `subscription_upgrade_clicked` | A user clicks the subscription upgrade call to action. | `src/main.tsx` |
| `team_sort_changed` | A user changes the team member sorting option. | `src/main.tsx` |

## Next steps

The PostHog MCP endpoint was unavailable during setup, so the live dashboard, insights, and shareable notebook could not be created. Once connectivity is restored, create the `Analytics basics (wizard)` dashboard with an authentication-to-invoice funnel and trends for invoice updates, upgrade intent, logouts, and team sorting.

## Verify before merging

- [ ] Run a full production build and fix any lint or type errors introduced by subsequent changes.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or the bundler upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — the current demo authentication state is memory-only and identifies on fresh login.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
