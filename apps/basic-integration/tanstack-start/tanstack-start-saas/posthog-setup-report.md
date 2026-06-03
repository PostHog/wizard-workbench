<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the CloudFlow TanStack Start application. The integration covers client-side event tracking via `@posthog/react`, server-side event tracking via `posthog-node`, error tracking, and a Vite reverse proxy configuration to route analytics traffic through the app server.

**Changes made:**

- **`vite.config.ts`** — Added reverse proxy rules for `/ingest`, `/ingest/static`, and `/ingest/array` to route PostHog traffic through the dev server and avoid CORS issues.
- **`src/routes/__root.tsx`** — Wrapped the app shell with `PostHogProvider` from `@posthog/react`, initializing PostHog with the project token, reverse proxy host, `capture_exceptions: true`, and the `defaults: '2025-05-24'` baseline.
- **`src/utils/posthog-server.ts`** *(new file)* — Singleton `posthog-node` client for server-side event capture, used in API route handlers.
- **`src/routes/api/invoices.ts`** — Server-side capture of `invoice_created` on successful invoice POST, including invoice metadata.
- **`src/routes/api/invoices.$invoiceId.pay.ts`** — Server-side capture of `invoice_paid` (critical revenue event), including invoice ID, title, and amount.
- **`src/routes/posts.$postId.tsx`** — Client-side capture of `invoice_viewed` (funnel entry) and `invoice_mark_paid_clicked` in the Mark as Paid handler.
- **`src/routes/posts_.$postId.deep.tsx`** — Client-side capture of `invoice_full_details_viewed` and `invoice_pdf_download_clicked`.
- **`src/routes/users.$userId.tsx`** — Client-side capture of `team_member_viewed` when a team member profile is loaded.
- **`src/routes/index.tsx`** — Client-side capture of `home_cta_clicked` on the two primary homepage CTAs (View Invoices, Manage Team).
- **`src/components/DefaultCatchBoundary.tsx`** — PostHog `captureException` wired into the global error boundary for automatic error tracking.

| Event | Description | File |
|---|---|---|
| `invoice_viewed` | User opens an invoice detail page | `src/routes/posts.$postId.tsx` |
| `invoice_mark_paid_clicked` | User clicks Mark as Paid on an invoice | `src/routes/posts.$postId.tsx` |
| `invoice_paid` | Invoice successfully marked paid (server-side) | `src/routes/api/invoices.$invoiceId.pay.ts` |
| `invoice_created` | New invoice created via API (server-side) | `src/routes/api/invoices.ts` |
| `invoice_full_details_viewed` | User views full invoice detail page | `src/routes/posts_.$postId.deep.tsx` |
| `invoice_pdf_download_clicked` | User clicks Download PDF on full invoice detail | `src/routes/posts_.$postId.deep.tsx` |
| `team_member_viewed` | User views a team member profile | `src/routes/users.$userId.tsx` |
| `home_cta_clicked` | User clicks a primary CTA on the home page | `src/routes/index.tsx` |

## Next steps

To explore your analytics data, visit your PostHog project and create a dashboard with insights like:

1. **Invoice payment funnel** — `invoice_viewed` → `invoice_mark_paid_clicked` → `invoice_paid` — shows the conversion rate from viewing to paying
2. **Invoice creation trend** — Trend of `invoice_created` over time to track business volume
3. **PDF download engagement** — `invoice_pdf_download_clicked` as a percentage of `invoice_full_details_viewed`
4. **Team management activity** — Trend of `team_member_viewed` to understand how often managers check on the team
5. **Homepage CTA breakdown** — `home_cta_clicked` broken down by the `cta` property to see which CTA drives more engagement

You can create these insights at [/insights](/insights) and group them into a dashboard at [/dashboard](/dashboard).

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-tanstack-start/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
