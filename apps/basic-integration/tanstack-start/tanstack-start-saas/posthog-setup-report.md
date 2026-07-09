<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of this TanStack Start project with PostHog for both client-side and server-side analytics. The setup now initializes PostHog in the root application shell, configures a Vite ingest proxy, adds a singleton server client for backend capture and exception reporting, writes required environment variables to `.env`, and instruments key invoice and team workflow events plus client and server error capture.

| Event name | Description | File |
| --- | --- | --- |
| `invoice_created` | Captures when a new invoice is created from the invoice form. | `src/routes/posts.index.tsx` |
| `invoice_created_server` | Captures when the server creates a new invoice successfully. | `src/utils/invoices.ts` |
| `invoice_marked_paid` | Captures when a user marks an invoice as paid from the invoice detail view. | `src/routes/posts.$postId.tsx` |
| `invoice_paid_server` | Captures when the server marks an invoice as paid successfully. | `src/utils/invoices.ts` |
| `invoice_shortcut_opened` | Captures when the home page shortcut opens a highlighted invoice. | `src/routes/index.tsx` |
| `team_member_selected` | Captures when a team member is selected from the team list. | `src/routes/users.tsx` |
| `team_member_fetch_failed` | Captures when fetching a team member fails on the server. | `src/utils/users.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- Dashboard: https://us.posthog.com/project/483112/dashboard/1825442
- Insight: Invoices created over time (wizard) — https://us.posthog.com/project/483112/insights/bG8O49Vo
- Insight: Invoice creation to payment funnel (wizard) — https://us.posthog.com/project/483112/insights/TEf7tdzx
- Insight: Invoice events by source (wizard) — https://us.posthog.com/project/483112/insights/eqYpZnrX
- Insight: Team member selections (wizard) — https://us.posthog.com/project/483112/insights/jtirAhVI
- Insight: Team member fetch failures (wizard) — https://us.posthog.com/project/483112/insights/eSKOuOXC

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names you added to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
