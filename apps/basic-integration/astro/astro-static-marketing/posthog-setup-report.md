<wizard-report>
# PostHog post-wizard report

The wizard has completed a full PostHog integration for the NeuralFlow AI Astro static marketing site. A new `src/components/posthog.astro` snippet component was created using the `is:inline` directive and wired into `src/layouts/Layout.astro` so PostHog initialises on every page. Eight custom events were added across five files to capture the most business-critical user actions: hero and nav CTAs, pricing plan selection, Enterprise contact-sales intent, documentation section exploration, and top-of-funnel feature page visits. All PostHog keys are read from environment variables; no tokens are hardcoded.

| Event name | Description | File |
|---|---|---|
| `free_trial_clicked` | User clicked a "Start Free Trial" call-to-action button on the hero section. | `src/pages/index.astro` |
| `docs_link_clicked` | User clicked the "Read the Docs" button from the hero section. | `src/pages/index.astro` |
| `pricing_viewed` | User viewed the pricing page, indicating top-of-funnel interest in a paid plan. | `src/pages/pricing.astro` |
| `pricing_plan_clicked` | User clicked the get-started or free-trial CTA on a specific pricing plan (property: `plan`). | `src/pages/pricing.astro` |
| `contact_sales_clicked` | User clicked "Contact Sales" on the Enterprise pricing plan. | `src/pages/pricing.astro` |
| `docs_section_clicked` | User clicked on a documentation section card from the docs overview page (property: `section`). | `src/pages/docs.astro` |
| `nav_cta_clicked` | User clicked the "Get Started" call-to-action in the navigation bar. | `src/components/Navigation.astro` |
| `features_viewed` | User viewed the features page, indicating interest in learning about the product. | `src/pages/features.astro` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1829009)
- [Conversion funnel: Features → Pricing → Plan click](https://us.posthog.com/project/483112/insights/jqLw4mSs)
- [Free trial clicks over time](https://us.posthog.com/project/483112/insights/TIDkSUS8)
- [Pricing plan clicks by plan](https://us.posthog.com/project/483112/insights/bFdtLHZ5)
- [Docs section clicks by section](https://us.posthog.com/project/483112/insights/LBVuXe0R)
- [All CTA clicks comparison](https://us.posthog.com/project/483112/insights/QjwxsQVe)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
