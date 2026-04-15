<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this React + TanStack Router (code-based) project. Here is a summary of all changes made:

- **`package.json`** — `posthog-js` added as a dependency via pnpm.
- **`.env`** — `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` written (covered by `.gitignore`).
- **`vite.config.js`** — Converted to `defineConfig` factory form to load env vars; added `/ingest` reverse proxy for PostHog to improve ad-blocker resilience.
- **`tsconfig.json`** — Added `"types": ["vite/client"]` so `import.meta.env` resolves correctly in TypeScript.
- **`src/main.tsx`** — Main integration file:
  - Imported `PostHogProvider` and `usePostHog` from `posthog-js/react`.
  - Wrapped `RootComponent`'s return in `<PostHogProvider>` with `api_host: '/ingest'`, `capture_exceptions: true`, and `debug` in dev mode.
  - **User identification**: `posthog.identify(username)` called in `LoginComponent.onSubmit` so all subsequent events are tied to the user.
  - **Event tracking**: see table below.

| Event name | Description | File |
|---|---|---|
| `user_signed_in` | User successfully signs in | `src/main.tsx` — `LoginComponent` |
| `user_signed_out` | User signs out (profile page or login page) | `src/main.tsx` — `ProfileComponent`, `LoginComponent` |
| `invoice_created` | New invoice submitted successfully | `src/main.tsx` — `InvoicesIndexComponent` |
| `invoice_updated` | Existing invoice saved | `src/main.tsx` — `InvoiceComponent` |
| `invoice_viewed` | Invoice detail page opened | `src/main.tsx` — `InvoiceComponent` |
| `upgrade_plan_clicked` | Upgrade button clicked on profile page | `src/main.tsx` — `ProfileComponent` |
| `team_member_viewed` | Team member profile viewed | `src/main.tsx` — `UserComponent` |

## Next steps

We recommend creating an **"Analytics basics"** dashboard in PostHog with the following five insights:

1. **Sign-in trend** — Trends chart for `user_signed_in` over time. [Create in PostHog →](https://us.posthog.com/project/2/insights/new#{"events":[{"id":"user_signed_in"}],"insight":"TRENDS"})

2. **Churn signal** — Trends chart for `user_signed_out` over time. [Create in PostHog →](https://us.posthog.com/project/2/insights/new#{"events":[{"id":"user_signed_out"}],"insight":"TRENDS"})

3. **Invoice creation trend** — Trends chart for `invoice_created` over time. [Create in PostHog →](https://us.posthog.com/project/2/insights/new#{"events":[{"id":"invoice_created"}],"insight":"TRENDS"})

4. **Invoice conversion funnel** — Funnel from `invoice_viewed` → `invoice_updated`. [Create in PostHog →](https://us.posthog.com/project/2/insights/new#{"events":[{"id":"invoice_viewed"},{"id":"invoice_updated"}],"insight":"FUNNELS"})

5. **Upgrade clicks** — Trends chart for `upgrade_plan_clicked` to track upsell interest. [Create in PostHog →](https://us.posthog.com/project/2/insights/new#{"events":[{"id":"upgrade_plan_clicked"}],"insight":"TRENDS"})

To create the dashboard manually:
1. Go to [PostHog Dashboards](https://us.posthog.com/project/2/dashboard)
2. Click **New dashboard** → name it "Analytics basics"
3. Add each of the insights above

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-react-tanstack-router-code-based/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
