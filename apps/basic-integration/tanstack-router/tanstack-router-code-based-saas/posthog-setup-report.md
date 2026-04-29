<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the CloudFlow TanStack Router (code-based) application. Here's what was set up:

- **PostHog SDK installed**: `posthog-js` and `@posthog/react` added via pnpm.
- **Provider configured**: `PostHogProvider` wraps the root route component in `src/main.tsx`, with session replay, exception capture, and debug mode enabled.
- **Reverse proxy**: `vite.config.js` updated to proxy `/ingest`, `/ingest/static`, and `/ingest/array` through to PostHog, keeping tracking first-party and ad-blocker resistant.
- **Environment variables**: `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN`, `VITE_PUBLIC_POSTHOG_HOST`, and `VITE_PUBLIC_POSTHOG_ASSETS_HOST` written to `.env`.
- **User identification**: `posthog.identify()` called on login with the username as distinct ID; `posthog.reset()` called on logout.
- **Event tracking**: Six business-critical events instrumented across auth, invoice, and upgrade flows.
- **Error tracking**: `posthog.captureException()` called in the shared `useMutation` hook so all mutation errors are captured automatically.

| Event | Description | File |
|---|---|---|
| `user_signed_in` | User successfully logs in | `src/main.tsx` — `LoginComponent.onSubmit` |
| `user_signed_out` | User logs out | `src/main.tsx` — `ProfileComponent` and `LoginComponent` logout handlers |
| `invoice_created` | New invoice created successfully | `src/main.tsx` — `InvoicesIndexComponent.onSuccess` |
| `invoice_updated` | Invoice changes saved successfully | `src/main.tsx` — `InvoiceComponent.onSuccess` |
| `invoice_viewed` | User views an invoice detail page | `src/main.tsx` — `InvoiceComponent` effect on `invoice.id` |
| `upgrade_plan_clicked` | User clicks Upgrade on the profile page | `src/main.tsx` — `ProfileComponent` Upgrade button |

## Next steps

Build insights and a dashboard in PostHog to monitor these events. Here are suggested insights to create in the **Analytics basics** dashboard:

- **Invoice creation funnel** — Funnel: `invoice_viewed` → `invoice_created` (payment conversion rate)
- **Sign-in trend** — Trend: `user_signed_in` over time (daily active users)
- **Upgrade click rate** — Trend: `upgrade_plan_clicked` (conversion intent)
- **Invoice update activity** — Trend: `invoice_updated` over time (user engagement)
- **Churn signal** — Trend: `user_signed_out` over time (retention signal)

Create these at: https://us.posthog.com/project/2/insights/new

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-react-tanstack-router-code-based/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
