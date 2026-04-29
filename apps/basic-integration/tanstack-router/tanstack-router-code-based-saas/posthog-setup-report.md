<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this React + TanStack Router (code-based) project. Here is a summary of all changes made:

- **`vite.config.js`** — Added a Vite reverse proxy so PostHog requests route through `/ingest`, improving ad-blocker resilience and privacy. Both `/ingest/static` and `/ingest/array` are proxied to the assets CDN.
- **`.env`** — Created with `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` environment variables.
- **`src/main.tsx`** — Added `PostHogProvider` wrapping the entire app in `RootComponent`, enabling PostHog for all child routes. Added `usePostHog()` hooks in key components to capture the events below, identify users on sign-in, and call `posthog.reset()` on sign-out. Error capture via `posthog.captureException()` is wired to invoice mutation failures.

| Event | Description | File |
|---|---|---|
| `user_signed_in` | User signs in via the login form; `posthog.identify()` is also called | `src/main.tsx` — `LoginComponent` |
| `user_signed_out` | User signs out; `posthog.reset()` is called to clear identity | `src/main.tsx` — `LoginComponent`, `ProfileComponent` |
| `invoice_created` | Invoice form submitted and created successfully | `src/main.tsx` — `InvoicesIndexComponent` |
| `invoice_create_failed` | Invoice creation fails; `captureException` also fires | `src/main.tsx` — `InvoicesIndexComponent` |
| `invoice_updated` | Existing invoice saved successfully | `src/main.tsx` — `InvoiceComponent` |
| `invoice_update_failed` | Invoice update fails; `captureException` also fires | `src/main.tsx` — `InvoiceComponent` |
| `upgrade_plan_clicked` | User clicks the Upgrade button on the profile/subscription section | `src/main.tsx` — `ProfileComponent` |
| `dashboard_viewed` | User lands on the main dashboard — top of the conversion funnel | `src/main.tsx` — `DashboardIndexComponent` |

## Next steps

We've suggested the following insights for your "Analytics basics" dashboard. Create them in PostHog:

- **[New dashboard — Analytics basics](https://us.posthog.com/project/2/dashboard)** — Create a new dashboard and add the insights below.
- **[Sign-in trend](https://us.posthog.com/project/2/insights/new#insight=TRENDS&events=[{"id":"user_signed_in","name":"user_signed_in","type":"events","order":0}])** — Track how many users sign in over time.
- **[Invoice creation funnel](https://us.posthog.com/project/2/insights/new#insight=FUNNELS&events=[{"id":"dashboard_viewed","name":"dashboard_viewed","type":"events","order":0},{"id":"invoice_created","name":"invoice_created","type":"events","order":1}])** — Conversion from dashboard view to invoice created.
- **[Upgrade intent](https://us.posthog.com/project/2/insights/new#insight=TRENDS&events=[{"id":"upgrade_plan_clicked","name":"upgrade_plan_clicked","type":"events","order":0}])** — Monitor how often users click Upgrade, a leading indicator of revenue intent.
- **[Invoice error rate](https://us.posthog.com/project/2/insights/new#insight=TRENDS&events=[{"id":"invoice_create_failed","name":"invoice_create_failed","type":"events","order":0},{"id":"invoice_update_failed","name":"invoice_update_failed","type":"events","order":1}])** — Track invoice mutation failures over time.
- **[Sign-out / churn signal](https://us.posthog.com/project/2/insights/new#insight=TRENDS&events=[{"id":"user_signed_out","name":"user_signed_out","type":"events","order":0}])** — Monitor sign-out frequency as a churn signal.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-react-tanstack-router-code-based/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
