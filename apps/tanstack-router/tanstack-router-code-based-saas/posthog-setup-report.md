<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the CloudFlow TanStack Router (code-based) application. Changes include:

- **`@posthog/react` installed** as a dependency via pnpm
- **`vite.config.js` updated** with a reverse proxy for `/ingest` routing PostHog requests through the dev server (avoids ad-blockers)
- **`tsconfig.json` updated** with `vite/client` types for `import.meta.env` support
- **`.env` created** with `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST`
- **`src/main.tsx` updated** with `PostHogProvider` wrapping the root component, plus event capture at all key user action sites

| Event | Description | File |
|-------|-------------|------|
| `user_signed_in` | User successfully signs in with a username; also calls `posthog.identify()` | `src/main.tsx` |
| `user_signed_out` | User signs out from the app (profile page or login page); also calls `posthog.reset()` | `src/main.tsx` |
| `invoice_created` | User successfully creates a new invoice | `src/main.tsx` |
| `invoice_updated` | User saves changes to an existing invoice | `src/main.tsx` |
| `invoice_viewed` | User opens an invoice detail page (top of conversion funnel) | `src/main.tsx` |
| `upgrade_clicked` | User clicks the Upgrade button on the profile/account page | `src/main.tsx` |
| `team_member_searched` | User filters the team members list by search query | `src/main.tsx` |
| `team_member_sorted` | User changes the sort order for the team members list | `src/main.tsx` |

## Next steps

Create the following insights in PostHog to monitor key business metrics:

1. **User Sign-in Trend** — Trends query on `user_signed_in` over time (daily, last 30 days)
2. **Invoice Created vs Updated** — Trends query comparing `invoice_created` and `invoice_updated` daily
3. **Invoice Conversion Funnel** — Funnel from `invoice_viewed` → `invoice_updated` to see how many viewers update invoices
4. **Upgrade Click Rate** — Trends query on `upgrade_clicked` to track plan upgrade intent
5. **Team Engagement** — Trends query comparing `team_member_searched` and `team_member_sorted` to understand team management usage

Visit [https://us.posthog.com/project/2](https://us.posthog.com/project/2) to build these insights and add them to an "Analytics basics" dashboard.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-react-tanstack-router-code-based/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
