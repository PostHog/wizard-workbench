<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the CloudFlow TanStack Router (code-based) application. Here is a summary of all changes made:

- **`posthog-js` and `@posthog/react`** were installed as dependencies.
- **`vite.config.js`** was updated to add a reverse proxy routing `/ingest` requests to the PostHog host (read from `VITE_PUBLIC_POSTHOG_HOST`), which improves ad-blocker resilience.
- **`.env`** was created with `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST`.
- **`tsconfig.json`** was updated to include `vite/client` types, enabling `import.meta.env` support.
- **`src/main.tsx`** was updated to:
  - Wrap `RootComponent` with `PostHogProvider` (initialized with env vars, reverse proxy host, exception capture, and debug mode in dev).
  - Call `posthog.identify()` and capture `user_logged_in` on login form submit.
  - Capture `user_logged_out` and call `posthog.reset()` on logout from both the login page and the profile page.
  - Capture `invoice_created` (with invoice ID and title) on successful invoice creation.
  - Capture `invoice_updated` (with invoice ID and title) on successful invoice update.
  - Capture `upgrade_plan_clicked` (with `current_plan: 'free'`) when the Upgrade button is clicked on the profile page.
  - Capture `team_member_viewed` (with user ID and name) when a team member's profile is opened.

| Event | Description | File |
|-------|-------------|------|
| `user_logged_in` | User successfully logs in with a username | `src/main.tsx` |
| `user_logged_out` | User logs out from the profile page or login page | `src/main.tsx` |
| `invoice_created` | User submits the create invoice form | `src/main.tsx` |
| `invoice_updated` | User submits the update invoice form to save changes | `src/main.tsx` |
| `upgrade_plan_clicked` | User clicks the Upgrade button on the profile/subscription page | `src/main.tsx` |
| `team_member_viewed` | User views a team member's profile detail page | `src/main.tsx` |

## Next steps

To monitor user behavior, create an **"Analytics basics"** dashboard in your [PostHog project](https://us.posthog.com/project/2) with these suggested insights:

1. **Login funnel** — Funnel insight: `user_logged_in` → `invoice_created` → `upgrade_plan_clicked`. Tracks the core conversion path from signup to upgrade intent.
2. **Invoice activity** — Trend insight: `invoice_created` and `invoice_updated` over time. Monitors how actively users are managing invoices.
3. **Upgrade intent** — Trend insight: `upgrade_plan_clicked`. Shows how many users are hitting the upgrade CTA — a key churn/conversion signal.
4. **Login/logout ratio** — Trend insight: `user_logged_in` vs `user_logged_out`. Highlights session health and user retention.
5. **Team engagement** — Trend insight: `team_member_viewed`. Shows how actively users are exploring the team management feature.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-react-tanstack-router-code-based/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
