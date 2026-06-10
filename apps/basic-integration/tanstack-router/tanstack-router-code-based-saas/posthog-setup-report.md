<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the CloudFlow SaaS application. PostHog is now initialized via `PostHogProvider` in the root route component (`RootComponent` in `src/main.tsx`), wrapping the entire application so every child route has access to the PostHog client. A Vite reverse proxy was added in `vite.config.js` to route PostHog requests through `/ingest`, improving ad-blocker resilience and keeping traffic on your domain.

**Key changes made:**
- `vite.config.js` — Added reverse proxy for `/ingest`, `/ingest/static`, and `/ingest/array` to the PostHog ingestion and asset hosts.
- `src/main.tsx` — Imported `PostHogProvider` and `usePostHog` from `@posthog/react`; wrapped `RootComponent` with `PostHogProvider` (with `capture_exceptions: true` for automatic error tracking); added `posthog.identify()` on login and `posthog.reset()` on logout; added `posthog.capture()` calls for all key business events.
- `.env` — Created with `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` environment variables.

| Event | Description | File |
|---|---|---|
| `user_signed_in` | User successfully signs in to CloudFlow | `src/main.tsx` |
| `user_signed_out` | User signs out of CloudFlow | `src/main.tsx` |
| `invoice_created` | User successfully creates a new invoice | `src/main.tsx` |
| `invoice_updated` | User successfully updates an existing invoice | `src/main.tsx` |
| `upgrade_clicked` | User clicks the Upgrade plan button on the profile/account page | `src/main.tsx` |

## Next steps

We've set up event tracking for your key business flows. Use the links below to build insights and a dashboard in PostHog once events start arriving:

- [Create a new insight](https://us.posthog.com/project/2/insights/new) — Build trends, funnels, and retention charts for the events above. Suggested insights:
  - **Sign-in trend**: Trends chart for `user_signed_in` over time
  - **Invoice activity**: Trends for `invoice_created` and `invoice_updated` over time  
  - **Login → Invoice funnel**: Funnel from `user_signed_in` → `invoice_created`
  - **Upgrade conversion funnel**: Funnel from `user_signed_in` → `upgrade_clicked`
  - **User retention**: Retention analysis from `user_signed_in` back to `user_signed_in`
- [View all dashboards](https://us.posthog.com/project/2/dashboard) — Create an "Analytics basics (wizard)" dashboard and pin your new insights to it.
- [Data management — events](https://us.posthog.com/project/2/data-management/events) — Verify events are arriving after the first user sessions.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-react-tanstack-router-code-based/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
</wizard-report>
