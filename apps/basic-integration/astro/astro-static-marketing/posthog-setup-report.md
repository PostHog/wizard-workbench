<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the NeuralFlow AI marketing site. A reusable `posthog.astro` component was created in `src/components/` using the PostHog web snippet with `is:inline` and `define:vars` to pass environment variables safely at build time. The component is imported and rendered in the `<head>` of `src/layouts/Layout.astro`, making PostHog available on every page automatically. Ten custom events were instrumented across six files, covering the full visitor journey from landing on the homepage to selecting a pricing plan.

| Event Name | Description | File |
|---|---|---|
| `start_free_trial_clicked` | User clicks the primary 'Start Free Trial' CTA on the homepage hero section. | `src/pages/index.astro` |
| `read_docs_clicked` | User clicks the 'Read the Docs' secondary CTA on the homepage hero section. | `src/pages/index.astro` |
| `pricing_viewed` | User views the pricing page, marking the top of the payment conversion funnel. | `src/pages/pricing.astro` |
| `starter_plan_clicked` | User clicks 'Get Started' on the Starter plan ($29/month) pricing card. | `src/pages/pricing.astro` |
| `pro_plan_clicked` | User clicks 'Start Free Trial' on the Pro plan ($99/month) pricing card. | `src/pages/pricing.astro` |
| `contact_sales_clicked` | User clicks 'Contact Sales' on the Enterprise pricing card. | `src/pages/pricing.astro` |
| `features_viewed` | User views the features page, indicating interest in product capabilities. | `src/pages/features.astro` |
| `docs_section_clicked` | User clicks on a documentation section card, indicating which topic they explored. | `src/pages/docs.astro` |
| `nav_get_started_clicked` | User clicks the 'Get Started' CTA button in the top navigation bar. | `src/components/Navigation.astro` |
| `footer_link_clicked` | User clicks a link in the site footer, with the link label tracked as a property. | `src/components/Footer.astro` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) Dashboard](https://us.posthog.com/project/483112/dashboard/1792360)
- [Pricing to Plan Conversion Funnel](https://us.posthog.com/project/483112/insights/ixmd9jMd)
- [Trial CTA Engagement](https://us.posthog.com/project/483112/insights/OwplO2mR)
- [Plan Selection Breakdown](https://us.posthog.com/project/483112/insights/O1SWnV4d)
- [Feature & Docs Engagement](https://us.posthog.com/project/483112/insights/gj98WkfN)
- [Homepage CTA Comparison](https://us.posthog.com/project/483112/insights/l6DVPwmW)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add the exact PostHog env var names (`PUBLIC_POSTHOG_PROJECT_TOKEN`, `PUBLIC_POSTHOG_HOST`) to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
