<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the NeuralFlow AI marketing site. The PostHog web snippet was added via a reusable `posthog.astro` component with a `window.__posthog_initialized` guard to prevent stack overflow errors during Astro View Transitions (soft navigation). The component is injected into the shared `Layout.astro` so all pages are covered automatically. Pageviews are tracked automatically using `capture_pageview: 'history_change'`. Six custom conversion and engagement events were instrumented across four files, using `astro:page-load` listeners to ensure correct behavior after soft navigation.

| Event | Description | File |
|---|---|---|
| `cta_clicked` | User clicks the primary "Start Free Trial" CTA on the homepage hero | `src/pages/index.astro` |
| `docs_cta_clicked` | User clicks "Read the Docs" secondary CTA on the homepage hero | `src/pages/index.astro` |
| `pricing_plan_selected` | User clicks a pricing plan CTA (Starter or Pro), includes `plan` property | `src/pages/pricing.astro` |
| `contact_sales_clicked` | User clicks "Contact Sales" on the Enterprise pricing plan | `src/pages/pricing.astro` |
| `docs_section_clicked` | User clicks a documentation section card, includes `section` property | `src/pages/docs.astro` |
| `nav_cta_clicked` | User clicks the "Get Started" CTA in the navigation bar | `src/components/Navigation.astro` |

## Next steps

To monitor user behavior, create an **"Analytics basics"** dashboard in PostHog with these five insights:

1. **CTA conversion funnel** — Funnel: `$pageview` (path = `/`) → `cta_clicked` → `pricing_plan_selected`
2. **Pricing plan breakdown** — Trends: `pricing_plan_selected` broken down by `plan` property
3. **Nav vs hero CTA clicks** — Trends: compare `nav_cta_clicked` and `cta_clicked` over time
4. **Docs engagement** — Trends: `docs_section_clicked` broken down by `section` property
5. **Contact sales conversions** — Trends: `contact_sales_clicked` over time

Create the dashboard at: https://us.posthog.com/project/2/dashboard/new

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
