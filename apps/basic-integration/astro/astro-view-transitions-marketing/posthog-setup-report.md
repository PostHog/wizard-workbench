<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the NeuralFlow AI Astro (View Transitions) marketing site. Here is a summary of all changes made:

- **`src/components/posthog.astro`** (new): PostHog initialization component using the web snippet with an `is:inline` directive and a `window.__posthog_initialized` guard to prevent stack overflow during Astro ClientRouter soft navigation. Uses `capture_pageview: 'history_change'` for automatic pageview tracking across view transitions.
- **`src/layouts/Layout.astro`**: Imported the new `PostHog` component and added it inside `<head>` so analytics loads on every page.
- **`src/pages/index.astro`**: Added click tracking for the hero "Start Free Trial" and "Read the Docs" CTAs using `astro:page-load` to re-bind listeners after each soft navigation.
- **`src/pages/pricing.astro`**: Added click tracking for all three pricing plan buttons — Starter, Pro, and Enterprise — capturing plan name and price.
- **`src/components/Navigation.astro`**: Added click tracking for the global "Get Started" nav CTA.
- **`src/pages/docs.astro`**: Added click tracking for each documentation section card, capturing the section name.
- **`.env`** (new): Set `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` for use in the PostHog component via environment variables.

| Event | Description | File |
|---|---|---|
| `cta_clicked` | User clicks "Start Free Trial" in the hero section | `src/pages/index.astro` |
| `cta_clicked` | User clicks "Read the Docs" in the hero section | `src/pages/index.astro` |
| `pricing_plan_clicked` | User clicks "Get Started" on the Starter plan ($29/mo) | `src/pages/pricing.astro` |
| `pricing_plan_clicked` | User clicks "Start Free Trial" on the Pro plan ($99/mo) | `src/pages/pricing.astro` |
| `contact_sales_clicked` | User clicks "Contact Sales" on the Enterprise plan | `src/pages/pricing.astro` |
| `nav_cta_clicked` | User clicks the "Get Started" CTA in the navigation bar | `src/components/Navigation.astro` |
| `docs_section_clicked` | User clicks a documentation section card (with `section` property) | `src/pages/docs.astro` |

## Next steps

To monitor user behavior with these events, create an "Analytics basics" dashboard in PostHog with insights like:

- **CTA conversion trend** — `cta_clicked` over time, broken down by `label`
- **Pricing plan interest** — `pricing_plan_clicked` broken down by `plan` to see which tier gets the most clicks
- **Enterprise pipeline** — `contact_sales_clicked` count as a high-value funnel metric
- **Nav vs hero conversion funnel** — `nav_cta_clicked` + `cta_clicked` together to compare entry points
- **Docs engagement** — `docs_section_clicked` broken down by `section` to see which docs are most in demand

You can create these at: https://us.posthog.com/project/2/insights/new

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
