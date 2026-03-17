<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of your project. PostHog analytics has been added to the NeuralFlow AI Astro marketing site with full View Transitions support. A `src/components/posthog.astro` component was created with the initialization guard (`window.__posthog_initialized`) required to prevent stack overflow errors during soft navigation, and `capture_pageview: 'history_change'` to automatically track pageviews as users navigate between pages. The component is imported in `src/layouts/Layout.astro` so it loads on every page. All event listeners use the `astro:page-load` event alongside `DOMContentLoaded` so they re-attach correctly after view transitions.

| Event | Description | File |
|---|---|---|
| `cta_clicked` | User clicked the 'Start Free Trial' CTA button on the homepage hero section | `src/pages/index.astro` |
| `docs_link_clicked` | User clicked the 'Read the Docs' link in the homepage hero section | `src/pages/index.astro` |
| `pricing_plan_clicked` | User clicked a pricing plan CTA button (Starter, Pro, or Enterprise) | `src/pages/pricing.astro` |
| `contact_sales_clicked` | User clicked 'Contact Sales' on the Enterprise pricing plan | `src/pages/pricing.astro` |
| `nav_cta_clicked` | User clicked the 'Get Started' CTA button in the navigation bar | `src/components/Navigation.astro` |
| `docs_section_clicked` | User clicked a documentation section card (e.g. Getting Started, API Reference) | `src/pages/docs.astro` |

## Next steps

To monitor user behavior based on these events, create an **"Analytics basics"** dashboard in PostHog at https://us.posthog.com/project/2/dashboard with the following suggested insights:

- **CTA Conversion Funnel** — Funnel: `$pageview` (path = `/`) → `cta_clicked` → `pricing_plan_clicked`
- **Pricing Plan Popularity** — Breakdown of `pricing_plan_clicked` by `plan` property
- **Nav vs Hero CTA clicks** — Trend comparing `nav_cta_clicked` and `cta_clicked`
- **Docs engagement** — Breakdown of `docs_section_clicked` by `section` property
- **Enterprise interest** — Trend of `contact_sales_clicked` over time

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
