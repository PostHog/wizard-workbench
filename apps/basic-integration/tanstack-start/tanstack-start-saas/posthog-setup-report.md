<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the CloudFlow TanStack Start application. Changes include: installing `posthog-js` and `posthog-node`, wrapping the app with `PostHogProvider` in the root shell component, configuring a Vite reverse proxy for reliable event ingestion, creating a singleton server-side PostHog client, and instrumenting 10 business events across 8 files covering the invoice payment funnel, team management, and server-side API operations. Error tracking via `captureException` was added to the invoice creation form and the global error boundary.

| Event | Description | File |
|-------|-------------|------|
| `invoice_viewed` | User views an invoice detail page — top of payment funnel | `src/routes/posts.$postId.tsx` |
| `invoice_created` | User successfully submits the create invoice form | `src/routes/posts.index.tsx` |
| `invoice_paid` | User marks an invoice as paid (summary view) | `src/routes/posts.$postId.tsx` |
| `invoice_paid` | User marks an invoice as paid (full detail view) | `src/routes/posts_.$postId.deep.tsx` |
| `invoice_pdf_download_clicked` | User clicks Download PDF on the full invoice detail page | `src/routes/posts_.$postId.deep.tsx` |
| `team_member_viewed` | User views a team member's profile page | `src/routes/users.$userId.tsx` |
| `home_cta_clicked` | User clicks View Invoices or Manage Team CTA on the home page | `src/routes/index.tsx` |
| `invoice_api_created` | Server-side: invoice created via POST /api/invoices | `src/routes/api/invoices.ts` |
| `invoice_api_paid` | Server-side: invoice paid via POST /api/invoices/:id/pay | `src/routes/api/invoices.$invoiceId.pay.ts` |
| `invoice_api_deleted` | Server-side: invoice deleted via DELETE /api/invoices/:id | `src/routes/api/invoices.$invoiceId.ts` |

## Next steps

The PostHog MCP did not have `dashboard:write` or `query:read` scopes available during this run, so the dashboard could not be created automatically. You can build it manually in PostHog — recommended insights are listed below:

- **[Create a new dashboard](https://us.posthog.com/project/2/dashboard)** — name it `Analytics basics (wizard)`
- **[New insight](https://us.posthog.com/project/2/insights/new)** — suggested insights to add:

  1. **Invoice payment funnel** — Funnel: `invoice_viewed` → `invoice_paid` — measures conversion from viewing to paying
  2. **Invoice creation trend** — Trends: `invoice_created` over time — tracks new business volume
  3. **Invoice payments over time** — Trends: `invoice_paid` + `invoice_api_paid` over time — tracks revenue activity
  4. **Home CTA clicks** — Trends: `home_cta_clicked` broken down by `cta` property — reveals which CTA drives engagement
  5. **Team activity** — Trends: `team_member_viewed` over time — shows team management usage

## Verify before merging

- [ ] Run a full production build (`pnpm build`) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — currently there is no login flow, so if you add authentication later, ensure `posthog.identify()` is called on both fresh login and returning sessions to avoid anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-tanstack-start/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
