<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into CloudFlow, a TanStack Start business management SaaS. The integration covers client-side tracking with `@posthog/react`, server-side event capture with `posthog-node`, automatic exception tracking, and a Vite reverse proxy for reliable event ingestion.

## Summary of changes

| File | Change |
|------|--------|
| `package.json` | Added `@posthog/react` and `posthog-node` dependencies |
| `.env` | Added `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` |
| `vite.config.ts` | Added `/ingest` reverse proxy routes for PostHog |
| `src/routes/__root.tsx` | Wrapped shell with `PostHogProvider` (auto pageview tracking, exception capture) |
| `src/utils/posthog-server.ts` | New singleton server-side PostHog client |
| `src/routes/posts.index.tsx` | Captures `invoice_created` on form submit |
| `src/routes/posts.$postId.tsx` | Captures `invoice_viewed` (funnel top) and `invoice_paid` |
| `src/routes/posts_.$postId.deep.tsx` | Captures `invoice_full_details_viewed` and `invoice_paid` |
| `src/routes/users.$userId.tsx` | Captures `team_member_viewed` |
| `src/components/DefaultCatchBoundary.tsx` | Captures exceptions via `captureException` |
| `src/routes/api/invoices.$invoiceId.pay.ts` | Server-side `invoice_paid` via REST API |
| `src/routes/api/invoices.ts` | Server-side `invoice_created` via REST API |

## Events instrumented

| Event | Description | File |
|-------|-------------|------|
| `invoice_created` | User creates a new invoice via the form | `src/routes/posts.index.tsx` |
| `invoice_viewed` | User opens an invoice detail panel — top of payment funnel | `src/routes/posts.$postId.tsx` |
| `invoice_paid` | User marks an invoice as paid (client-side) | `src/routes/posts.$postId.tsx`, `src/routes/posts_.$postId.deep.tsx` |
| `invoice_full_details_viewed` | User clicks View Full Details on an invoice | `src/routes/posts_.$postId.deep.tsx` |
| `team_member_viewed` | User opens a team member's profile | `src/routes/users.$userId.tsx` |
| `error_caught` | Unhandled error surfaced in the error boundary | `src/components/DefaultCatchBoundary.tsx` |
| `invoice_paid` (server) | Invoice marked paid via REST API — authoritative payment event | `src/routes/api/invoices.$invoiceId.pay.ts` |
| `invoice_created` (server) | Invoice created via REST API — authoritative creation event | `src/routes/api/invoices.ts` |

## Next steps

We recommend creating an **"Analytics basics"** dashboard in PostHog with these insights:

1. **Invoice payment funnel** — Funnel from `invoice_viewed` → `invoice_paid`. Reveals your payment conversion rate and where users drop off.
2. **Invoice creation trend** — Trends chart for `invoice_created` over time. Track growth in new invoices.
3. **Invoice payment trend** — Trends chart for `invoice_paid` over time. Track revenue activity.
4. **Team engagement** — Trends chart for `team_member_viewed`. See how often users browse the team directory.
5. **Error rate** — Trends chart for `$exception` (auto-captured). Monitor application health.

To create this dashboard, visit [Dashboards](/dashboards) in PostHog and use the events listed above.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
