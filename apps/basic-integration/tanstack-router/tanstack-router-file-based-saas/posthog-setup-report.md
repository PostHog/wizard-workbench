<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this CloudFlow TanStack Router (file-based) application. Here's a summary of all changes made:

- **Installed** `posthog-js` and `@posthog/react` via pnpm
- **Configured** `.env.local` with `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST`
- **Added** a reverse proxy in `vite.config.js` routing `/ingest/*` to PostHog (improves ad-blocker resistance and data quality)
- **Wrapped** the app in `PostHogProvider` in `src/routes/__root.tsx` with `capture_exceptions: true` for automatic error tracking
- **Identified users** on login with `posthog.identify()` and reset identity on logout with `posthog.reset()`
- **Added `vite/client` types** to `tsconfig.json` to resolve `import.meta.env` TypeScript errors

## Events instrumented

| Event | Description | File |
|---|---|---|
| `user_signed_in` | User submits the login form to sign in | `src/routes/login.tsx` |
| `user_signed_out` | User clicks the Sign Out button | `src/routes/login.tsx` |
| `invoice_created` | User submits the form to create a new invoice | `src/routes/dashboard.invoices.index.tsx` |
| `invoice_updated` | User saves changes to an existing invoice | `src/routes/dashboard.invoices.$invoiceId.tsx` |
| `upgrade_plan_clicked` | User clicks the Upgrade button on the profile page | `src/routes/_auth.profile.tsx` |

## Next steps

We've suggested five insights for an **"Analytics basics"** dashboard to monitor user behavior based on the events just instrumented. Create the dashboard and insights in PostHog:

- **New dashboard**: [Create "Analytics basics" dashboard](https://us.posthog.com/project/2/dashboard/new)

Suggested insights to add:

1. **Sign-in trend** — [Trend of `user_signed_in` over time](https://us.posthog.com/project/2/insights/new#{"insight":"TRENDS","events":[{"id":"user_signed_in","name":"user_signed_in","type":"events"}]})
2. **Sign-in → Invoice creation funnel** — Conversion from `user_signed_in` → `invoice_created` to measure activation rate: [Create funnel](https://us.posthog.com/project/2/insights/new#{"insight":"FUNNELS","events":[{"id":"user_signed_in"},{"id":"invoice_created"}]})
3. **Invoice creation trend** — [Trend of `invoice_created` over time](https://us.posthog.com/project/2/insights/new#{"insight":"TRENDS","events":[{"id":"invoice_created","name":"invoice_created","type":"events"}]})
4. **Upgrade intent clicks** — [Trend of `upgrade_plan_clicked` over time](https://us.posthog.com/project/2/insights/new#{"insight":"TRENDS","events":[{"id":"upgrade_plan_clicked","name":"upgrade_plan_clicked","type":"events"}]})
5. **Churn signal — sign-outs** — [Trend of `user_signed_out` over time](https://us.posthog.com/project/2/insights/new#{"insight":"TRENDS","events":[{"id":"user_signed_out","name":"user_signed_out","type":"events"}]})

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-react-tanstack-router-file-based/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
