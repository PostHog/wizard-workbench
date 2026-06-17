<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this TanStack Start SaaS project ("CloudFlow"). Changes include:

- **Client-side initialization**: `PostHogProvider` added to `__root.tsx`'s `shellComponent` (`RootDocument`), wrapping the entire app with session replay, exception capture, and auto-pageview tracking.
- **Reverse proxy**: Vite dev server proxy configured in `vite.config.ts` to route `/ingest` traffic through the local server, avoiding CORS issues and ad-blocker interference.
- **Server-side singleton**: `src/utils/posthog-server.ts` created with a `getPostHogClient()` singleton for safe, efficient server-side event capture using `posthog-node`.
- **Client events**: `invoice_created`, `invoice_marked_paid`, and `invoice_pdf_download_clicked` captured in the React components, including `captureException` calls on error paths.
- **Server events**: `invoice_created`, `invoice_paid`, `invoice_updated`, and `invoice_deleted` captured in the REST API route handlers, including `X-PostHog-Session-Id` and `X-PostHog-Distinct-Id` header pass-through for session correlation.
- **Environment variables**: `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` written to `.env`.

| Event | Description | File |
|---|---|---|
| `invoice_created` | User successfully submits the create invoice form | `src/routes/posts.index.tsx` |
| `invoice_marked_paid` | User clicks "Mark as Paid" on the invoice detail panel | `src/routes/posts.$postId.tsx` |
| `invoice_marked_paid` | User clicks "Mark as Paid" on the full invoice details page | `src/routes/posts_.$postId.deep.tsx` |
| `invoice_pdf_download_clicked` | User clicks the Download PDF button | `src/routes/posts_.$postId.deep.tsx` |
| `invoice_created` | Server confirms a new invoice was created via REST API | `src/routes/api/invoices.ts` |
| `invoice_paid` | Server confirms an invoice was marked as paid via REST API | `src/routes/api/invoices.$invoiceId.pay.ts` |
| `invoice_updated` | Server confirms an invoice field update via REST API | `src/routes/api/invoices.$invoiceId.ts` |
| `invoice_deleted` | Server confirms an invoice deletion via REST API | `src/routes/api/invoices.$invoiceId.ts` |

## Next steps

The PostHog MCP did not have the `dashboard:write`, `insight:write`, or `query:read` scopes in this session, so the "Analytics basics (wizard)" dashboard could not be created automatically. Create it manually using these links:

- [New Dashboard](https://us.posthog.com/project/2/dashboard) — create a dashboard named **"Analytics basics (wizard)"**
- [New Insight](https://us.posthog.com/project/2/insights/new) — add the suggested insights below

### Suggested insights for the dashboard

1. **Invoice creation trend** — Trends chart of `invoice_created` (source = `server`) over time. Shows business growth.
2. **Invoice payment trend** — Trends chart of `invoice_paid` over time. Tracks revenue confirmations.
3. **Invoice create → paid funnel** — Funnel with step 1 `invoice_created` → step 2 `invoice_paid`. Measures payment conversion rate.
4. **Invoice deletions** — Trends chart of `invoice_deleted` over time. A rising line is a churn signal.
5. **PDF download clicks** — Trends chart of `invoice_pdf_download_clicked` over time. Measures document engagement.

## Verify before merging

- [ ] Run a full production build (`pnpm build`) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-tanstack-start/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
