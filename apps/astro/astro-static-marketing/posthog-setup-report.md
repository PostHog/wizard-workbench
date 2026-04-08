<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the NeuralFlow AI marketing site. A reusable `posthog.astro` component was created and added to the root `Layout.astro` so that every page on the site initializes PostHog automatically. Five client-side events were instrumented across the key conversion touchpoints: the hero CTA, the navigation CTA, all pricing plan buttons, the enterprise "Contact Sales" button, and documentation section cards. All PostHog keys are read from environment variables — no tokens are hardcoded.

| Event | Description | File |
|---|---|---|
| `cta_clicked` | User clicks the "Start Free Trial" CTA in the hero section | `src/pages/index.astro` |
| `nav_cta_clicked` | User clicks the "Get Started" CTA in the navigation bar | `src/components/Navigation.astro` |
| `pricing_plan_selected` | User clicks a plan button (Starter or Pro) on the pricing page | `src/pages/pricing.astro` |
| `contact_sales_clicked` | User clicks the "Contact Sales" button for the Enterprise plan | `src/pages/pricing.astro` |
| `docs_section_clicked` | User clicks a documentation section card | `src/pages/docs.astro` |

## Next steps

We've instrumented the key conversion events on this marketing site. To build an **"Analytics basics"** dashboard in PostHog, visit your project and create the following insights:

1. **CTA clicks over time** — Trends chart for `cta_clicked` + `nav_cta_clicked`, showing volume day-by-day. Helps you see whether marketing/copy changes affect top-of-funnel interest.
2. **Pricing plan conversion funnel** — Funnel from `$pageview` (URL = `/pricing`) → `pricing_plan_selected`, broken down by `plan` property. Shows what percentage of pricing page visitors click a plan.
3. **Contact Sales clicks** — Trends chart for `contact_sales_clicked`. Leading indicator of enterprise pipeline.
4. **Docs engagement** — Trends chart for `docs_section_clicked`, broken down by `section` property. Shows which docs sections attract the most interest.
5. **CTA-to-pricing funnel** — Funnel from `cta_clicked` (hero) → `$pageview` (URL = `/pricing`) → `pricing_plan_selected`. Full top-of-funnel conversion flow.

You can create these at: https://us.posthog.com/project/2/insights/new

Then add them to a new dashboard at: https://us.posthog.com/project/2/dashboards/new

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
