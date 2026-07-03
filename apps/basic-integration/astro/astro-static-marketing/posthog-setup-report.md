<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the NeuralFlow AI marketing site. A reusable `posthog.astro` snippet component was created and wired into the existing `Layout.astro` so every page automatically initializes PostHog. Eight custom events were instrumented across five files to capture the key conversion actions — from hero CTA clicks and pricing plan selections to docs section navigation and footer engagement.

| Event Name | Description | File |
|---|---|---|
| `trial_started` | User clicks "Start Free Trial" on the homepage hero | `src/pages/index.astro` |
| `docs_cta_clicked` | User clicks "Read the Docs" on the homepage hero | `src/pages/index.astro` |
| `nav_cta_clicked` | User clicks the "Get Started" CTA in the navigation bar | `src/components/Navigation.astro` |
| `pricing_viewed` | User views the pricing page (top of conversion funnel) | `src/pages/pricing.astro` |
| `pricing_plan_clicked` | User clicks the Starter or Pro pricing plan CTA | `src/pages/pricing.astro` |
| `contact_sales_clicked` | User clicks "Contact Sales" on the Enterprise plan | `src/pages/pricing.astro` |
| `docs_section_clicked` | User clicks a documentation section card | `src/pages/docs.astro` |
| `footer_link_clicked` | User clicks a navigation link in the footer | `src/components/Footer.astro` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1795662)
- [Trial starts over time](https://us.posthog.com/project/483112/insights/xmhL6I2o)
- [Pricing page conversion funnel](https://us.posthog.com/project/483112/insights/hdBkyRIG)
- [Pricing plan selection breakdown](https://us.posthog.com/project/483112/insights/oM42tEbk)
- [Docs section interest](https://us.posthog.com/project/483112/insights/YDQx7uyZ)
- [All key CTAs — unique users](https://us.posthog.com/project/483112/insights/nTvYTQ22)

## Verify before merging

- [ ] Run a full production build (`npm run build`) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
