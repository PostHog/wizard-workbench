<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the CloudFlow TanStack Router (code-based) SaaS application. Here's a summary of all changes made:

- **`src/vite-env.d.ts`** (new): Added Vite client type reference so `import.meta.env` is properly typed.
- **`vite.config.js`**: Configured a reverse proxy so PostHog requests route through `/ingest` instead of directly to `us.i.posthog.com`, improving privacy and ad-blocker resilience.
- **`src/main.tsx`**: Wrapped the `RootComponent` with `PostHogProvider` (initialized from environment variables), added `usePostHog()` hooks in `LoginComponent`, `ProfileComponent`, `InvoicesIndexComponent`, and `InvoiceComponent` to capture business-critical events.
- **`.env`** (new): Created with `VITE_PUBLIC_POSTHOG_KEY` and `VITE_PUBLIC_POSTHOG_HOST` values (gitignored automatically).

## Events instrumented

| Event Name | Description | File |
|---|---|---|
| `user_logged_in` | User successfully logs in; also calls `posthog.identify()` to associate future events | `src/main.tsx` |
| `user_logged_out` | User logs out; calls `posthog.reset()` to clear the current identity | `src/main.tsx` |
| `invoice_created` | User submits the Create Invoice form with title and body | `src/main.tsx` |
| `invoice_updated` | User saves changes to an existing invoice (includes invoice_id, title, body) | `src/main.tsx` |
| `plan_upgrade_clicked` | User clicks the Upgrade button on the Account/Subscription page | `src/main.tsx` |

## Next steps

To view these events in PostHog, create an "Analytics basics" dashboard with the following recommended insights:

1. **User Login Trend** — Line chart of `user_logged_in` events over time (user acquisition signal)
2. **Invoice Creation Funnel** — Funnel: `user_logged_in` → `invoice_created` (conversion from login to first invoice)
3. **Invoice Activity** — Bar chart of `invoice_created` + `invoice_updated` per day (engagement)
4. **Plan Upgrade Clicks** — Total count of `plan_upgrade_clicked` over time (revenue intent / churn risk signal)
5. **Churn Signal** — `user_logged_out` without a subsequent `user_logged_in` within 7 days (retention/churn)

You can create this dashboard at [https://us.posthog.com/project/2/dashboard](https://us.posthog.com/project/2/dashboard).

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
