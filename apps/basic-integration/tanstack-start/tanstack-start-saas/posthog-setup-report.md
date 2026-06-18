<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the CloudFlow TanStack Start application. The integration includes:

- **`posthog-js` / `@posthog/react`** installed for client-side analytics with the `PostHogProvider` added to the root shell component (`src/routes/__root.tsx`).
- **`posthog-node`** installed for server-side event capture via a singleton client (`src/utils/posthog-server.ts`).
- A **Vite reverse proxy** configured in `vite.config.ts` to route PostHog requests through `/ingest`, improving reliability and avoiding ad-blocker interference.
- **Client-side events** added for invoice creation, payment, and PDF download.
- **Server-side events** added for all invoice REST API operations (create, update, pay, delete).
- **Error tracking** via `posthog.captureException` added to the root error boundary.

| Event Name | Description | File |
|---|---|---|
| `invoice_created` | User creates a new invoice via the form | `src/routes/posts.index.tsx` |
| `invoice_paid` | User marks an invoice as paid from the list view | `src/routes/posts.$postId.tsx` |
| `invoice_paid` | User marks an invoice as paid from the full detail page | `src/routes/posts_.$postId.deep.tsx` |
| `invoice_pdf_downloaded` | User clicks Download PDF on the invoice detail page | `src/routes/posts_.$postId.deep.tsx` |
| `invoice_created` | Invoice created via the REST API | `src/routes/api/invoices.ts` |
| `invoice_paid` | Invoice payment processed via the REST API | `src/routes/api/invoices.$invoiceId.pay.ts` |
| `invoice_updated` | Invoice updated via the REST API | `src/routes/api/invoices.$invoiceId.ts` |
| `invoice_deleted` | Invoice deleted via the REST API | `src/routes/api/invoices.$invoiceId.ts` |
| `error_encountered` | Unhandled error caught by the root error boundary | `src/components/DefaultCatchBoundary.tsx` |

## Next steps

Create a dashboard in PostHog to monitor invoice activity. Suggested insights:

- [PostHog Dashboards](https://us.posthog.com/project/2/dashboard) — create a new "Analytics basics (wizard)" dashboard with these insights:
  1. **Invoice creation trend** — Trends chart of `invoice_created` over time
  2. **Invoice payment trend** — Trends chart of `invoice_paid` over time
  3. **Invoice-to-payment funnel** — Funnel from `invoice_created` → `invoice_paid`
  4. **PDF download rate** — Trends chart of `invoice_pdf_downloaded` over time
  5. **Error rate** — Trends chart of `error_encountered` over time

## Verify before merging

- [ ] Run a full production build (`pnpm build`) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` to `.env.example` and any bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
