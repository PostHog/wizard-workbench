<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the CloudFlow TanStack Router (file-based) application. The following changes were made:

- **`@posthog/react`** was installed as a dependency.
- **`src/vite-env.d.ts`** was created to enable `import.meta.env` TypeScript types for Vite.
- **`vite.config.js`** was updated to add a reverse proxy for PostHog requests (`/ingest/*`) so that ad-blockers are less likely to block analytics.
- **`.env`** was created with `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST`.
- **`src/routes/__root.tsx`** was updated to wrap the entire app in `PostHogProvider` and add a `PostHogPageView` component that fires `$pageview` events on every route change using TanStack Router's `useRouterState`.
- **`src/routes/login.tsx`** was updated to call `posthog.identify()` and capture `user_signed_in` on login, and `posthog.reset()` + `user_signed_out` on logout.
- **`src/routes/dashboard.invoices.index.tsx`** was updated to capture `invoice_created` when a new invoice is submitted.
- **`src/routes/dashboard.invoices.$invoiceId.tsx`** was updated to capture `invoice_updated` when invoice changes are saved.
- **`src/routes/_auth.profile.tsx`** was updated to capture `upgrade_plan_clicked` when the Upgrade button is pressed.

| Event | Description | File |
|---|---|---|
| `user_signed_in` | User successfully signed in to the application | `src/routes/login.tsx` |
| `user_signed_out` | User signed out of the application | `src/routes/login.tsx` |
| `invoice_created` | User created a new invoice | `src/routes/dashboard.invoices.index.tsx` |
| `invoice_updated` | User saved changes to an existing invoice | `src/routes/dashboard.invoices.$invoiceId.tsx` |
| `upgrade_plan_clicked` | User clicked the Upgrade button on their profile/subscription section | `src/routes/_auth.profile.tsx` |

## Next steps

Build insights and a dashboard to keep an eye on user behavior based on the events just instrumented. Here are five recommended insights to create in your PostHog project:

1. **User Sign-in Trend** — Track sign-in volume over time to spot growth or drop-off.
   [Create insight](https://us.posthog.com/project/2/insights/new?insight=TRENDS)

2. **Invoice Creation Trend** — Monitor how many invoices are being created each day/week.
   [Create insight](https://us.posthog.com/project/2/insights/new?insight=TRENDS)

3. **Sign-in → Invoice Creation Funnel** — Measure the conversion rate from signing in to creating an invoice.
   [Create funnel](https://us.posthog.com/project/2/insights/new?insight=FUNNELS)

4. **Upgrade Plan Clicks** — Track how many users express upgrade intent from the profile page.
   [Create insight](https://us.posthog.com/project/2/insights/new?insight=TRENDS)

5. **Session Churn: Sign-ins vs Sign-outs** — Compare sign-in and sign-out volumes to understand session retention.
   [Create insight](https://us.posthog.com/project/2/insights/new?insight=TRENDS)

Add all five to a new dashboard named "Analytics basics":
[Go to Dashboards](https://us.posthog.com/project/2/dashboards)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-react-tanstack-router-file-based/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
