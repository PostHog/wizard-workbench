<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of your project. PostHog analytics have been added to the NeuralFlow AI marketing site (Astro static/SSG). A reusable `posthog.astro` component initializes PostHog via the web snippet on every page through the shared `Layout.astro`. Five custom events capture the most business-critical user interactions across the site: hero CTA clicks, pricing plan interest, enterprise sales contact, docs section engagement, and the navigation "Get Started" button.

| Event | Description | File |
|---|---|---|
| `cta_clicked` | User clicked a CTA button (Start Free Trial or Read the Docs) on the homepage hero section | `src/pages/index.astro` |
| `pricing_plan_cta_clicked` | User clicked a CTA on a pricing plan card, with `plan` (Starter/Pro/Enterprise) and `label` properties | `src/pages/pricing.astro` |
| `contact_sales_clicked` | User clicked "Contact Sales" on the Enterprise pricing plan | `src/pages/pricing.astro` |
| `docs_section_clicked` | User clicked on a documentation section card, with `section` property | `src/pages/docs.astro` |
| `nav_cta_clicked` | User clicked the "Get Started" CTA in the navigation bar | `src/components/Navigation.astro` |

## Files changed

- **`src/components/posthog.astro`** *(created)* — PostHog web snippet component using `is:inline` and `define:vars` to safely pass env variables
- **`src/layouts/Layout.astro`** *(updated)* — Imports and renders `<PostHog />` in `<head>` so all pages are instrumented
- **`src/pages/index.astro`** *(updated)* — Tracks `cta_clicked` on hero buttons
- **`src/pages/pricing.astro`** *(updated)* — Tracks `pricing_plan_cta_clicked` and `contact_sales_clicked` on all plan CTAs
- **`src/pages/docs.astro`** *(updated)* — Tracks `docs_section_clicked` on all documentation section cards
- **`src/components/Navigation.astro`** *(updated)* — Tracks `nav_cta_clicked` on the nav "Get Started" button
- **`.env`** *(created)* — `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` env variables

## Next steps

We've prepared some suggested insights for you to build in PostHog under a new **"Analytics basics"** dashboard. Create them at:

- [New dashboard → "Analytics basics"](https://us.posthog.com/project/2/dashboard/new)

Suggested insights to add to the dashboard:

1. **Hero CTA Clicks over time** — [Trends: `cta_clicked`](https://us.posthog.com/project/2/insights/new#{"events":[{"id":"cta_clicked","name":"cta_clicked","type":"events"}],"display":"ActionsLineGraph"})
2. **Pricing plan interest by plan** — [Trends: `pricing_plan_cta_clicked` broken down by `plan`](https://us.posthog.com/project/2/insights/new#{"events":[{"id":"pricing_plan_cta_clicked","name":"pricing_plan_cta_clicked","type":"events"}],"breakdown":"plan","breakdown_type":"event"})
3. **Enterprise sales contact clicks** — [Trends: `contact_sales_clicked`](https://us.posthog.com/project/2/insights/new#{"events":[{"id":"contact_sales_clicked","name":"contact_sales_clicked","type":"events"}]})
4. **Homepage → Pricing conversion funnel** — [Funnel: `cta_clicked` → `pricing_plan_cta_clicked`](https://us.posthog.com/project/2/insights/new#{"insight":"FUNNELS","events":[{"id":"cta_clicked","name":"cta_clicked","type":"events","order":0},{"id":"pricing_plan_cta_clicked","name":"pricing_plan_cta_clicked","type":"events","order":1}]})
5. **Docs section engagement** — [Trends: `docs_section_clicked` broken down by `section`](https://us.posthog.com/project/2/insights/new#{"events":[{"id":"docs_section_clicked","name":"docs_section_clicked","type":"events"}],"breakdown":"section","breakdown_type":"event"})

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
