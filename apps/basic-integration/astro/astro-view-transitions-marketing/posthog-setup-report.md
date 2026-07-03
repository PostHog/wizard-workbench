<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the NeuralFlow AI marketing site. PostHog is initialized via a dedicated `src/components/posthog.astro` component using the web snippet with a `window.__posthog_initialized` guard to prevent stack overflow errors during Astro View Transitions (ClientRouter) soft navigation. The component is mounted in `src/layouts/Layout.astro` inside `<head>`, and uses `capture_pageview: 'history_change'` so pageviews are automatically tracked on every client-side route change. All event capture scripts use `is:inline` and register both `DOMContentLoaded` and `astro:page-load` handlers with duplicate-listener guards to work correctly across soft navigations. Environment variables `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` are stored in `.env`.

| Event Name | Description | File |
|---|---|---|
| `hero_trial_cta_clicked` | User clicked the "Start Free Trial" button in the homepage hero section. | `src/pages/index.astro` |
| `hero_docs_cta_clicked` | User clicked the "Read the Docs" button in the homepage hero section. | `src/pages/index.astro` |
| `nav_get_started_clicked` | User clicked the "Get Started" button in the site navigation. | `src/components/Navigation.astro` |
| `pricing_page_viewed` | User viewed the pricing page, marking the top of the conversion funnel. | `src/pages/pricing.astro` |
| `starter_plan_cta_clicked` | User clicked "Get Started" on the Starter pricing plan. | `src/pages/pricing.astro` |
| `pro_trial_cta_clicked` | User clicked "Start Free Trial" on the Pro pricing plan. | `src/pages/pricing.astro` |
| `enterprise_contact_sales_clicked` | User clicked "Contact Sales" on the Enterprise pricing plan. | `src/pages/pricing.astro` |
| `features_page_viewed` | User viewed the features page, indicating interest in product capabilities. | `src/pages/features.astro` |
| `docs_section_clicked` | User clicked a documentation section card on the docs page. | `src/pages/docs.astro` |
| `footer_link_clicked` | User clicked a link in the site footer. | `src/components/Footer.astro` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1795665)
- [Pricing Conversion Funnel (wizard)](https://us.posthog.com/project/483112/insights/GwOlPVq8)
- [CTA Clicks Over Time (wizard)](https://us.posthog.com/project/483112/insights/eha0KRTC)
- [Pricing Plan Selection (wizard)](https://us.posthog.com/project/483112/insights/Jrzw9U1G)
- [Docs Section Engagement (wizard)](https://us.posthog.com/project/483112/insights/n5fecXJS)
- [Features vs Pricing Page Interest (wizard)](https://us.posthog.com/project/483112/insights/r10qLuJV)

## Verify before merging

- [ ] Run a full production build (`npm run build`) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
