<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the NeuralFlow AI marketing site. PostHog is initialized via a reusable `posthog.astro` component that uses the web snippet with a `window.__posthog_initialized` guard to prevent stack overflow during Astro View Transitions (soft navigation). Pageviews are tracked automatically via `capture_pageview: 'history_change'`. Six custom events have been instrumented across four files covering key conversion touchpoints: hero CTAs, pricing plan selection, contact sales, navigation CTAs, and documentation engagement.

| Event | Description | File |
|-------|-------------|------|
| `free_trial_started` | User clicks "Start Free Trial" on the home page hero | `src/pages/index.astro` |
| `docs_cta_clicked` | User clicks "Read the Docs" on the home page hero | `src/pages/index.astro` |
| `pricing_plan_clicked` | User clicks a pricing plan CTA (Starter or Pro) | `src/pages/pricing.astro` |
| `contact_sales_clicked` | User clicks "Contact Sales" for the Enterprise tier | `src/pages/pricing.astro` |
| `docs_section_clicked` | User clicks a documentation section card | `src/pages/docs.astro` |
| `get_started_nav_clicked` | User clicks "Get Started" in the navigation bar | `src/components/Navigation.astro` |

## Next steps

We recommend building an **Analytics basics (wizard)** dashboard in PostHog with the following insights, based on the events just instrumented:

1. **Free trial funnel** — Funnel from `free_trial_started` → `pricing_plan_clicked` to measure home-page-to-pricing conversion.
2. **Pricing plan breakdown** — Trends of `pricing_plan_clicked` broken down by `plan` property (starter vs pro) to see which tier resonates most.
3. **Contact sales volume** — Trend of `contact_sales_clicked` over time to track enterprise interest.
4. **Nav vs hero CTA comparison** — Trends comparing `get_started_nav_clicked` and `free_trial_started` to understand which entry point drives more intent.
5. **Docs engagement** — Trend of `docs_section_clicked` broken down by `section` to see which documentation areas attract the most interest.

- [Create a new dashboard](https://us.posthog.com/project/2/dashboard)
- [Create a new insight](https://us.posthog.com/project/2/insights/new)

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
