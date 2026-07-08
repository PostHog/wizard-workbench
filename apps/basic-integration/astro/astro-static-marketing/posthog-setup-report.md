# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the NeuralFlow AI static Astro site. A reusable `posthog.astro` component was created and injected into the shared `Layout.astro` so PostHog initializes on every page. Nine custom events were instrumented across five pages and one navigation component, focusing on conversion CTAs, pricing plan intent, and documentation engagement.

| Event name | Description | File |
|---|---|---|
| `hero_cta_clicked` | User clicked the "Start Free Trial" button in the homepage hero section. | `src/pages/index.astro` |
| `hero_docs_clicked` | User clicked the "Read the Docs" button in the homepage hero section. | `src/pages/index.astro` |
| `nav_get_started_clicked` | User clicked the "Get Started" CTA in the navigation bar. | `src/components/Navigation.astro` |
| `pricing_page_viewed` | User viewed the pricing page, indicating bottom-of-funnel intent. | `src/pages/pricing.astro` |
| `pricing_starter_clicked` | User clicked "Get Started" on the Starter plan ($29/month). | `src/pages/pricing.astro` |
| `pricing_pro_clicked` | User clicked "Start Free Trial" on the Pro plan ($99/month). | `src/pages/pricing.astro` |
| `pricing_enterprise_clicked` | User clicked "Contact Sales" on the Enterprise plan. | `src/pages/pricing.astro` |
| `docs_section_clicked` | User clicked a documentation section card on the docs page. | `src/pages/docs.astro` |
| `features_page_viewed` | User navigated to the features page, indicating top-of-funnel product interest. | `src/pages/features.astro` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1818062)
- [CTA clicks over time (wizard)](https://us.posthog.com/project/483112/insights/VM3iaDEZ)
- [Pricing page conversion funnel (wizard)](https://us.posthog.com/project/483112/insights/QF5Cnpzh)
- [Pricing plan clicks by plan (wizard)](https://us.posthog.com/project/483112/insights/Mk5JZJ2y)
- [Docs section engagement (wizard)](https://us.posthog.com/project/483112/insights/QK8CNzbG)
- [Hero CTA total clicks (wizard)](https://us.posthog.com/project/483112/insights/qlbSCoVT)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
