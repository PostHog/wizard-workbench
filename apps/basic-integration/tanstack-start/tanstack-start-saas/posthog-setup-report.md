# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the CloudFlow TanStack Start SaaS application. The setup covers client-side analytics via `@posthog/react`, server-side event capture via `posthog-node`, a reverse proxy for reliability in the Vite dev server, and error tracking in the global error boundary.

## Changes summary

| File | Change |
|---|---|
| `src/routes/__root.tsx` | Added `PostHogProvider` wrapping the shell document for client-side tracking |
| `vite.config.ts` | Added `/ingest`, `/ingest/static`, `/ingest/array` reverse proxy routes |
| `src/utils/posthog-server.ts` | **New file** — singleton `posthog-node` client for server-side capture |
| `src/routes/posts.index.tsx` | Captures `invoice_created` on successful form submit |
| `src/routes/posts.$postId.tsx` | Captures `invoice_viewed` on mount and `invoice_marked_paid` on button click |
| `src/routes/posts_.$postId.deep.tsx` | Captures `invoice_full_details_viewed` on mount, `invoice_marked_paid` on button, `invoice_pdf_download_clicked` on download button |
| `src/routes/users.$userId.tsx` | Captures `team_member_viewed` on mount |
| `src/routes/index.tsx` | Captures `dashboard_cta_clicked` with label on each CTA link click |
| `src/routes/api/invoices.ts` | Server-side `invoice_created` on successful POST |
| `src/routes/api/invoices.$invoiceId.ts` | Server-side `invoice_updated` on PATCH and `invoice_deleted` on DELETE |
| `src/routes/api/invoices.$invoiceId.pay.ts` | Server-side `invoice_marked_paid` on successful POST |
| `src/components/DefaultCatchBoundary.tsx` | Calls `posthog.captureException(error)` whenever the global error boundary triggers |

## Event tracking table

| Event name | Description | File |
|---|---|---|
| `invoice_viewed` | User opened an invoice detail page (top of payment funnel) | `src/routes/posts.$postId.tsx` |
| `invoice_created` | User submitted the create-invoice form successfully | `src/routes/posts.index.tsx` |
| `invoice_marked_paid` | User clicked "Mark as Paid" on the invoice detail view | `src/routes/posts.$postId.tsx` |
| `invoice_full_details_viewed` | User navigated to the full invoice detail page (top of PDF funnel) | `src/routes/posts_.$postId.deep.tsx` |
| `invoice_marked_paid` | User clicked "Mark as Paid" from the full invoice detail view | `src/routes/posts_.$postId.deep.tsx` |
| `invoice_pdf_download_clicked` | User clicked the "Download PDF" button | `src/routes/posts_.$postId.deep.tsx` |
| `team_member_viewed` | User opened a team member's profile | `src/routes/users.$userId.tsx` |
| `dashboard_cta_clicked` | User clicked a CTA button on the home dashboard | `src/routes/index.tsx` |
| `invoice_created` | Server: invoice created via REST API | `src/routes/api/invoices.ts` |
| `invoice_updated` | Server: invoice updated via REST API | `src/routes/api/invoices.$invoiceId.ts` |
| `invoice_deleted` | Server: invoice deleted via REST API | `src/routes/api/invoices.$invoiceId.ts` |
| `invoice_marked_paid` | Server: invoice marked paid via REST API | `src/routes/api/invoices.$invoiceId.pay.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard**: [Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1818383)
- **Insight**: [Invoice lifecycle](https://us.posthog.com/project/483112/insights/Hty3gFKD) — invoice_created, invoice_marked_paid, invoice_deleted over 30 days
- **Insight**: [Invoice payment funnel](https://us.posthog.com/project/483112/insights/SLQwZsiI) — invoice_viewed → invoice_marked_paid conversion
- **Insight**: [Invoice detail to PDF download funnel](https://us.posthog.com/project/483112/insights/cqUGcbrt) — invoice_full_details_viewed → invoice_pdf_download_clicked conversion
- **Insight**: [Dashboard CTA clicks by label](https://us.posthog.com/project/483112/insights/IGvbt0Dd) — which home page CTAs drive the most clicks
- **Insight**: [Team member profile views](https://us.posthog.com/project/483112/insights/jenxYLna) — team engagement over time

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
