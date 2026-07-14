# PostHog post-wizard report

The wizard has completed a PostHog integration for this TanStack Start project by installing the React and Node SDKs, initializing PostHog in the root app shell, adding a Vite ingest proxy, wiring server-side capture through a shared PostHog server client, and instrumenting key invoice and team engagement events across both client and API flows. Error capture was also added in the root catch boundary and server-side exception capture was added around invoice creation failures.

| Event name | Description | File |
| --- | --- | --- |
| `invoice_created` | Captures when a new invoice is created from the invoice creation form. | `src/routes/posts.index.tsx` |
| `invoice_created_api` | Captures when the invoice creation API successfully creates a new invoice. | `src/routes/api/invoices.ts` |
| `invoice_paid` | Captures when a user marks an invoice as paid from the invoice details view. | `src/routes/posts.$postId.tsx` |
| `invoice_paid_api` | Captures when the invoice payment API successfully marks an invoice as paid. | `src/routes/api/invoices.$invoiceId.pay.ts` |
| `invoice_details_viewed` | Captures when a user opens the deep invoice details view from the invoice page. | `src/routes/posts.$postId.tsx` |
| `team_member_viewed` | Captures when a team member profile is opened from the team directory. | `src/routes/users.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://us.posthog.com/project/483112/dashboard/1846885)
- [Invoices created (wizard)](https://us.posthog.com/project/483112/insights/B4178hRs)
- [Invoices paid (wizard)](https://us.posthog.com/project/483112/insights/Y4xJNGfM)
- [Invoice API creates (wizard)](https://us.posthog.com/project/483112/insights/mO66Ez5h)
- [Invoice conversion funnel (wizard)](https://us.posthog.com/project/483112/insights/xVIGsSog)
- [Team member views (wizard)](https://us.posthog.com/project/483112/insights/fn75SPlw)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names added here (`VITE_PUBLIC_POSTHOG_PROJECT_TOKEN`, `VITE_PUBLIC_POSTHOG_HOST`) to `.env.example` and any bootstrap scripts collaborators use.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or equivalent bundler upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
