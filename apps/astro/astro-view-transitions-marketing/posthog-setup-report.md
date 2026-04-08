<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the NeuralFlow AI marketing site (Astro with ClientRouter View Transitions).

A `src/components/posthog.astro` component was created containing the PostHog web snippet, wrapped in a `window.__posthog_initialized` guard to prevent stack overflow errors during soft navigation. It is configured with `capture_pageview: 'history_change'` so pageviews are automatically tracked as users navigate between pages via View Transitions. The component is imported and rendered inside the `<head>` of `src/layouts/Layout.astro`, making it active on every page. PostHog credentials are stored in `.env` and injected at build time via Astro's `import.meta.env` — no secrets are hardcoded.

Event tracking was added to three files: hero CTAs on the homepage, all pricing plan buttons, and the navigation "Get Started" CTA. Each page script follows the view transitions pattern, registering listeners on both `DOMContentLoaded` and `astro:page-load` to correctly re-bind after soft navigation.

| Event | Description | File |
|---|---|---|
| `cta_clicked` | User clicks "Start Free Trial" in the hero section | `src/pages/index.astro` |
| `docs_cta_clicked` | User clicks "Read the Docs" in the hero section | `src/pages/index.astro` |
| `pricing_plan_cta_clicked` | User clicks a pricing plan CTA (Starter or Pro); includes `plan_name` and `plan_price` properties | `src/pages/pricing.astro` |
| `contact_sales_clicked` | User clicks "Contact Sales" on the Enterprise plan; includes `plan_name` property | `src/pages/pricing.astro` |
| `nav_get_started_clicked` | User clicks "Get Started" in the main navigation | `src/components/Navigation.astro` |

## Next steps

Start exploring your analytics in PostHog once events begin flowing. Recommended insights to build:

- **Trends** — `cta_clicked` over time to track hero conversion interest
- **Trends** — `pricing_plan_cta_clicked` broken down by `plan_name` to see which plan attracts most interest
- **Funnel** — Homepage → Pricing (`$pageview`) → `pricing_plan_cta_clicked` to measure top-of-funnel conversion
- **Trends** — `contact_sales_clicked` to track enterprise pipeline interest
- **Trends** — `nav_get_started_clicked` vs `cta_clicked` to compare navigation vs hero CTAs

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-astro-view-transitions/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
