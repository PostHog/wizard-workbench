<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the CloudFlow SaaS application. The following changes were made:

- **`vite.config.js`**: Added a Vite reverse proxy for PostHog (`/ingest` → PostHog host) to route analytics calls through the same domain, improving ad-blocker resilience and performance.
- **`tsconfig.json`**: Added `vite/client` types to support `import.meta.env` type-checking.
- **`src/main.tsx`**: Integrated `PostHogProvider` from `@posthog/react` wrapping the entire `RootComponent`, with `capture_exceptions: true` for automatic error tracking. Added `usePostHog` hooks in five components to capture business-critical events.
- **`.env`**: Added `VITE_PUBLIC_POSTHOG_KEY` and `VITE_PUBLIC_POSTHOG_HOST` environment variables.

## Events instrumented

| Event name | Description | File |
|---|---|---|
| `user_logged_in` | User successfully logs in. Calls `posthog.identify()` with username and `posthog.capture()` with username property. | `src/main.tsx` |
| `user_logged_out` | User logs out from either the login page or the profile page. Calls `posthog.reset()` to clear identity. | `src/main.tsx` |
| `invoice_created` | User successfully creates a new invoice. Captures `invoice_id` and `title` properties. | `src/main.tsx` |
| `invoice_updated` | User saves changes to an existing invoice. Captures `invoice_id` and `title` properties. | `src/main.tsx` |
| `upgrade_clicked` | User clicks the Upgrade button on the Account Settings page. Captures `current_plan` property. Key conversion intent signal. | `src/main.tsx` |

## Next steps

To create an "Analytics basics" dashboard in PostHog, navigate to your project and add the following insights:

1. **Daily active users** — Trend of `user_logged_in` over time (daily) — tracks acquisition/retention
2. **Invoice creation funnel** — Funnel from `user_logged_in` → `invoice_created` — measures core conversion
3. **Invoice activity** — Trend of `invoice_created` + `invoice_updated` over time — tracks engagement
4. **Upgrade intent** — Trend of `upgrade_clicked` over time — tracks monetization pipeline
5. **Churn signals** — Trend of `user_logged_out` over time — tracks churn activity

You can create these manually at [https://us.posthog.com/project/2/dashboards](https://us.posthog.com/project/2/dashboards).

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-react-tanstack-router-code-based/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
