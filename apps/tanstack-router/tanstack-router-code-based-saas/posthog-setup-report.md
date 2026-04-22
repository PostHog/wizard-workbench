<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the CloudFlow SaaS application (React + TanStack Router, code-based routing). Here is a summary of all changes made:

**`src/main.tsx`** — Added `PostHogProvider` wrapping the root component with reverse-proxy configuration, `usePostHog()` hooks across four components, user identification on login, sign-in/sign-out event capture, invoice creation/update event capture, and `captureException` error tracking on mutation failures.

**`vite.config.js`** — Added a Vite dev server proxy that routes `/ingest/*` through to the PostHog ingestion endpoint, including separate handling of `/ingest/static` and `/ingest/array` asset routes.

**`tsconfig.json`** — Added `"types": ["vite/client"]` to resolve `import.meta.env` TypeScript types.

**`.env`** — Created with `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` environment variables (covered by `.gitignore`).

| Event | Description | File |
|---|---|---|
| `user_signed_in` | User successfully signs in with their username; triggers `posthog.identify()` | `src/main.tsx` — `LoginComponent` |
| `user_signed_out` | User signs out of the application; triggers `posthog.reset()` | `src/main.tsx` — `LoginComponent`, `ProfileComponent` |
| `invoice_created` | User successfully creates a new invoice | `src/main.tsx` — `InvoicesIndexComponent` |
| `invoice_updated` | User successfully updates an existing invoice | `src/main.tsx` — `InvoiceComponent` |

## Next steps

To monitor user behavior, create the following insights in your PostHog dashboard:

- [New insight — User sign-ins over time (Trends)](https://us.posthog.com/project/2/insights/new)
- [New insight — Invoice creation funnel: sign-in → invoice created (Funnels)](https://us.posthog.com/project/2/insights/new)
- [New insight — Invoice updates over time (Trends)](https://us.posthog.com/project/2/insights/new)
- [New insight — User churn: sign-out events (Trends)](https://us.posthog.com/project/2/insights/new)
- [New dashboard — Analytics basics](https://us.posthog.com/project/2/dashboards)

**Suggested "Analytics basics" dashboard insights:**
1. **Sign-in trend** — Trends on `user_signed_in` (daily unique users)
2. **Sign-out / churn trend** — Trends on `user_signed_out`
3. **Invoice creation funnel** — Funnel: `user_signed_in` → `invoice_created`
4. **Invoice update rate** — Trends on `invoice_updated`
5. **Invoices created vs updated** — Combined trend comparing `invoice_created` and `invoice_updated`

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-react-tanstack-router-code-based/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
