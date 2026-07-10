<wizard-report>
# PostHog post-wizard report

The wizard has completed a full PostHog integration for the NeuralFlow AI marketing site (Astro with View Transitions). A `posthog.astro` component was created with the PostHog web snippet wrapped in a `window.__posthog_initialized` guard to prevent stack overflow errors during soft navigation via Astro's `ClientRouter`. The component uses `capture_pageview: 'history_change'` for automatic pageview tracking on each view transition. It was imported into `src/layouts/Layout.astro` so PostHog initializes on every page. Event tracking was added to all five pages and both shared components using `is:inline` scripts that listen on both `DOMContentLoaded` and `astro:page-load` to correctly handle soft navigation. Environment variables were written to `.env` for the PostHog token and host.

| Event | Description | File |
|---|---|---|
| `free_trial_clicked` | Hero "Start Free Trial" button clicked | `src/pages/index.astro` |
| `read_docs_clicked` | Hero "Read the Docs" button clicked | `src/pages/index.astro` |
| `pricing_viewed` | User arrived at the pricing page (top of conversion funnel) | `src/pages/pricing.astro` |
| `starter_plan_clicked` | "Get Started" on the Starter plan clicked | `src/pages/pricing.astro` |
| `pro_plan_trial_clicked` | "Start Free Trial" on the Pro plan clicked | `src/pages/pricing.astro` |
| `enterprise_contact_sales_clicked` | "Contact Sales" on the Enterprise plan clicked | `src/pages/pricing.astro` |
| `features_viewed` | User arrived at the features page (top of funnel signal) | `src/pages/features.astro` |
| `docs_section_clicked` | A documentation section card clicked (with `section` property) | `src/pages/docs.astro` |
| `nav_get_started_clicked` | "Get Started" CTA in the navigation clicked | `src/components/Navigation.astro` |
| `footer_link_clicked` | Footer navigation link clicked (with `link` property) | `src/components/Footer.astro` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://us.posthog.com/project/483112/dashboard/1829008)
- [Pricing page conversion funnel](https://us.posthog.com/project/483112/insights/RDPZkbc7)
- [Free trial CTA clicks over time](https://us.posthog.com/project/483112/insights/o6Fix5bX)
- [Pricing plan button clicks by plan](https://us.posthog.com/project/483112/insights/d91AAOA3)
- [Docs section engagement](https://us.posthog.com/project/483112/insights/BHnAok7v)
- [Top-of-funnel page views](https://us.posthog.com/project/483112/insights/huzD4tYO)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
