<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the NeuralFlow AI Astro hybrid marketing site. Here is a summary of what was done:

- **Created** `src/components/posthog.astro` — client-side PostHog snippet component using `is:inline` and Astro env vars
- **Updated** `src/layouts/Layout.astro` — imports and renders the PostHog component in `<head>` so analytics loads on every page
- **Created** `src/lib/posthog-server.ts` — singleton `posthog-node` client for server-side tracking
- **Updated** `src/pages/index.astro` — tracks hero "Start Free Trial" and "Contact Sales" CTA clicks
- **Updated** `src/pages/pricing.astro` — tracks pricing plan CTA clicks with plan name as a property
- **Updated** `src/pages/contact.astro` — tracks contact form submission and client-side errors; passes session ID header to the API
- **Updated** `src/components/Navigation.astro` — tracks "Get Started" nav CTA clicks
- **Updated** `src/pages/api/contact.ts` — server-side tracking of successful and failed contact form submissions using `posthog-node`, with session ID correlation

| Event | Description | File |
|-------|-------------|------|
| `start_free_trial_clicked` | User clicks "Start Free Trial" CTA in the hero section | `src/pages/index.astro` |
| `contact_sales_clicked` | User clicks "Contact Sales" button in the hero section | `src/pages/index.astro` |
| `get_started_nav_clicked` | User clicks "Get Started" CTA in the navigation bar | `src/components/Navigation.astro` |
| `pricing_plan_clicked` | User clicks a pricing plan CTA (with `plan` property: starter/pro/enterprise) | `src/pages/pricing.astro` |
| `contact_form_submitted` | User submits the contact form (with `interest` and `has_company` properties) | `src/pages/contact.astro` |
| `contact_form_error` | Contact form submission fails on the client side | `src/pages/contact.astro` |
| `contact_form_received` | Server successfully processes a contact form (with `interest`, `has_company`, `$session_id`) | `src/pages/api/contact.ts` |
| `contact_form_server_error` | Server fails to process a contact form submission | `src/pages/api/contact.ts` |

## Next steps

To visualize your data, create an **"Analytics basics"** dashboard in PostHog with these recommended insights:

1. **CTA conversion funnel** — Funnel from `start_free_trial_clicked` or `pricing_plan_clicked` → `contact_form_submitted` → `contact_form_received`
2. **Pricing plan interest breakdown** — Trend or bar chart of `pricing_plan_clicked` grouped by `plan` property to see which plan attracts the most interest
3. **Contact form submission rate** — Trend of `contact_form_submitted` vs `contact_form_received` to monitor drop-off
4. **Contact form errors** — Trend of `contact_form_error` and `contact_form_server_error` to monitor reliability
5. **Top CTAs** — Bar chart comparing `start_free_trial_clicked`, `contact_sales_clicked`, and `get_started_nav_clicked` to see which drives the most engagement

Visit your PostHog project to create these insights:
- Dashboards: https://us.posthog.com/project/2/dashboard
- New insight: https://us.posthog.com/project/2/insights/new

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-astro-hybrid/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
