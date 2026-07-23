# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into CloudFlow, a TanStack Start SaaS business platform. The integration covers both client-side and server-side event tracking for the two core business domains: invoice management and team management.

**What was set up:**
- `PostHogProvider` from `@posthog/react` added to the root shell (`__root.tsx`) wrapping the entire app with client-side analytics, session replay, and error tracking enabled
- Reverse proxy configured in `vite.config.ts` routing `/ingest/*` traffic through the Vite dev server to avoid ad-blocker interference
- Server-side PostHog singleton client (`src/utils/posthog-server.ts`) using `posthog-node` for API route tracking
- `tracing_headers` configured on the `PostHogProvider` to automatically correlate client and server events via `X-POSTHOG-SESSION-ID` and `X-POSTHOG-DISTINCT-ID` headers
- Missing token guards: the app degrades gracefully (no-op) when `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` is unset; dev builds log a loud error

| Event name | Description | File |
|---|---|---|
| `invoice_viewed` | User opens an invoice detail page (top of payment funnel) | `src/routes/posts.$postId.tsx` |
| `invoice_paid` | User marks an invoice as paid from the detail panel | `src/routes/posts.$postId.tsx` |
| `invoice_paid` | User marks an invoice as paid from the full detail page | `src/routes/posts_.$postId.deep.tsx` |
| `invoice_pdf_downloaded` | User clicks Download PDF on the full detail page | `src/routes/posts_.$postId.deep.tsx` |
| `team_member_viewed` | User opens a team member's profile | `src/routes/users.$userId.tsx` |
| `invoice_created` | New invoice created via the REST API | `src/routes/api/invoices.ts` |
| `invoice_payment_processed` | Invoice marked paid via the REST API payment endpoint | `src/routes/api/invoices.$invoiceId.pay.ts` |
| `invoice_updated` | Invoice fields updated via the REST API | `src/routes/api/invoices.$invoiceId.ts` |
| `invoice_deleted` | Invoice deleted via the REST API | `src/routes/api/invoices.$invoiceId.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1897660)
- [Invoice payment funnel (wizard)](https://us.posthog.com/project/483112/insights/3733VRWI)
- [Invoices paid over time (wizard)](https://us.posthog.com/project/483112/insights/4xdL3e0r)
- [Invoice actions breakdown (wizard)](https://us.posthog.com/project/483112/insights/3ojFmq5r)
- [Invoice payments processed (wizard)](https://us.posthog.com/project/483112/insights/m6IdBlud)
- [Team member views (wizard)](https://us.posthog.com/project/483112/insights/uMiyrdXq)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — this app has no auth currently, so when authentication is added, make sure `posthog.identify()` is called on both fresh login and page refresh for returning sessions.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
