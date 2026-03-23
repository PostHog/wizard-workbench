<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this CloudFlow TanStack Router (code-based) application. The following changes were made:

- **`package.json`** — `posthog-js` and `@posthog/react` installed via pnpm.
- **`.env`** — `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` environment variables created (added to `.gitignore`).
- **`tsconfig.json`** — Added `"types": ["vite/client"]` so `import.meta.env` is correctly typed.
- **`vite.config.js`** — Updated to use `loadEnv` and added a `/ingest` proxy to route PostHog events through the Vite dev server (avoids ad-blockers).
- **`src/main.tsx`** — `PostHogProvider` wraps `RootComponent`; event tracking and user identification added to key flows.

| Event | Description | File |
|---|---|---|
| `user_signed_in` | Fired when a user submits the login form and signs in. Includes `posthog.identify()`. | `src/main.tsx` |
| `user_signed_out` | Fired when a user clicks Sign Out (from login page or profile page). Includes `posthog.reset()`. | `src/main.tsx` |
| `invoice_created` | Fired when a new invoice is successfully created via the create-invoice form. | `src/main.tsx` |
| `invoice_updated` | Fired when an existing invoice is successfully saved/updated. | `src/main.tsx` |
| `invoice_viewed` | Fired when a user views a specific invoice detail page (top of invoice funnel). | `src/main.tsx` |
| `upgrade_plan_clicked` | Fired when a user clicks the Upgrade button on the Account Settings page. | `src/main.tsx` |
| `team_member_viewed` | Fired when a user views a team member's profile page. | `src/main.tsx` |

## Next steps

To explore these events, open your [PostHog project](https://us.posthog.com/project/238460) and create an **"Analytics basics"** dashboard with the following insights:

1. **Sign-in trend** — Trends insight for `user_signed_in` over time. Shows daily active users logging in.
2. **Invoice creation funnel** — Funnel: `invoice_viewed` → `invoice_updated` (or `invoice_created`). Shows how many users who view an invoice go on to create or update one.
3. **Upgrade clicks** — Trends insight for `upgrade_plan_clicked`. A critical conversion signal — users who click Upgrade are high-intent.
4. **Invoice lifecycle** — Trends comparing `invoice_created` and `invoice_updated` side-by-side. Shows usage intensity.
5. **Churn signal** — Trends for `user_signed_out`. A spike may indicate friction or dissatisfaction.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-react-tanstack-router-code-based/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
