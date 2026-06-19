<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the CloudFlow TanStack Start application. The integration includes:

- **Client-side initialization**: `PostHogProvider` from `@posthog/react` now wraps the entire app in `src/routes/__root.tsx` (inside the `shellComponent`), enabling automatic pageview tracking, session replay, and exception capture via `capture_exceptions: true`.
- **Reverse proxy**: `vite.config.ts` now proxies `/ingest` → `https://us.i.posthog.com` and `/ingest/static` + `/ingest/array` → `https://us-assets.i.posthog.com` to improve reliability.
- **Server-side client**: A singleton `posthog-node` client is provided by `src/utils/posthog-server.ts` and used across all API route handlers.
- **10 custom events** tracking the full invoice lifecycle (creation, payment), team member views, and error capture across both client and server.
- **Environment variables**: `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` written to `.env`.

| Event Name | Description | File |
|---|---|---|
| `invoice_created` | User submits the create invoice form and the invoice is successfully created. | `src/routes/posts.index.tsx` |
| `invoice_marked_paid` | User clicks 'Mark as Paid' on the invoice summary view. | `src/routes/posts.$postId.tsx` |
| `invoice_marked_paid` | User clicks 'Mark as Paid' on the full invoice detail view. | `src/routes/posts_.$postId.deep.tsx` |
| `invoice_pdf_download_clicked` | User clicks the Download PDF button on the full invoice detail view. | `src/routes/posts_.$postId.deep.tsx` |
| `invoice_payment_processed` | Invoice successfully marked as paid via the REST API payment endpoint. | `src/routes/api/invoices.$invoiceId.pay.ts` |
| `invoice_created_api` | Invoice successfully created via the REST API endpoint. | `src/routes/api/invoices.ts` |
| `invoice_updated_api` | Invoice successfully updated via the PATCH REST API endpoint. | `src/routes/api/invoices.$invoiceId.ts` |
| `invoice_deleted_api` | Invoice successfully deleted via the DELETE REST API endpoint. | `src/routes/api/invoices.$invoiceId.ts` |
| `team_member_viewed` | User navigates to and views an individual team member's profile page. | `src/routes/users.$userId.tsx` |
| `error_caught` (via `captureException`) | An unhandled application error is caught and displayed by the root error boundary. | `src/components/DefaultCatchBoundary.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) Dashboard](https://us.posthog.com/project/478124/dashboard/1737273)
- [Invoice Creation Trend](https://us.posthog.com/project/478124/insights/D21Tpov9)
- [Invoice Payment Funnel](https://us.posthog.com/project/478124/insights/Uu5spWGL)
- [Invoice Payments Over Time](https://us.posthog.com/project/478124/insights/b8RwjHGp)
- [Team Member Profile Views](https://us.posthog.com/project/478124/insights/bif1b9oR)
- [Application Errors](https://us.posthog.com/project/478124/insights/plQzZ64S)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
