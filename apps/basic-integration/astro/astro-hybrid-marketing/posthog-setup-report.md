<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this NeuralFlow AI Astro hybrid marketing site.

**What was done:**

- Installed `posthog-js` (client-side) and `posthog-node` (server-side) packages via npm.
- Created `src/components/posthog.astro` — the PostHog web snippet using `is:inline` so Astro does not process it as TypeScript.
- Updated `src/layouts/Layout.astro` to import and render the PostHog component inside `<head>`, enabling analytics on every page.
- Created `src/lib/posthog-server.ts` — a singleton pattern for the `posthog-node` client used in API routes.
- Set up `.env` with `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` environment variables.
- Added client-side event captures in `src/pages/index.astro` (hero CTA clicks) and `src/pages/pricing.astro` (pricing page view, plan button clicks).
- Updated `src/pages/contact.astro` to pass `X-PostHog-Session-Id` and `X-PostHog-Distinct-Id` headers to the API, identify the user on successful form submission, and capture exceptions on network errors.
- Added server-side event tracking in `src/pages/api/contact.ts` for contact form submissions and failures, reading the PostHog headers for session/identity correlation.

| Event | Description | File |
|---|---|---|
| `cta_clicked` | User clicks a hero CTA button (Start Free Trial or Contact Sales) | `src/pages/index.astro` |
| `pricing_page_viewed` | User views the pricing page — top of the conversion funnel | `src/pages/pricing.astro` |
| `pricing_plan_clicked` | User clicks a pricing plan button (Starter, Pro, or Enterprise) | `src/pages/pricing.astro` |
| `contact_form_submitted` | Server-side: contact form successfully validated and processed | `src/pages/api/contact.ts` |
| `contact_form_failed` | Server-side: contact form failed validation or hit a server error | `src/pages/api/contact.ts` |

## Next steps

Create the **Analytics basics (wizard)** dashboard in PostHog with the following suggested insights:

1. **Contact form conversions** — Trends of `contact_form_submitted` over time
2. **CTA engagement** — Trends of `cta_clicked` broken down by `cta` property
3. **Pricing funnel** — Funnel: `pricing_page_viewed` → `pricing_plan_clicked` → `contact_form_submitted`
4. **Plan interest breakdown** — Trends of `pricing_plan_clicked` broken down by `plan` property
5. **Form failure reasons** — Trends of `contact_form_failed` broken down by `reason` property

Visit your [PostHog Dashboards](https://us.posthog.com/project/2/dashboard) to create this dashboard, or [create a new insight](https://us.posthog.com/project/2/insights/new) to get started.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-astro-hybrid/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
