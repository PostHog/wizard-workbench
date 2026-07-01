# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the NeuralFlow AI Astro marketing site. A new `src/components/posthog.astro` component was created with the PostHog web snippet, wrapped in a `window.__posthog_initialized` guard to prevent stack overflow errors during Astro View Transitions (ClientRouter) soft navigation. The component is initialized with `capture_pageview: 'history_change'` for automatic pageview tracking across transitions. It was imported into `src/layouts/Layout.astro` so all pages are covered. Click and view events were added to the hero section, navigation, pricing page, features page, and docs page, each using the `astro:page-load` event listener pattern required for View Transitions compatibility.

| Event Name | Description | File |
|---|---|---|
| `hero_cta_clicked` | User clicked the primary 'Start Free Trial' call-to-action button in the hero section. | `src/pages/index.astro` |
| `hero_docs_clicked` | User clicked the 'Read the Docs' secondary CTA button in the hero section. | `src/pages/index.astro` |
| `pricing_page_viewed` | User viewed the pricing page, indicating intent to evaluate plans. | `src/pages/pricing.astro` |
| `pricing_plan_selected` | User clicked the CTA button for a specific pricing plan (Starter, Pro, or Enterprise). | `src/pages/pricing.astro` |
| `contact_sales_clicked` | User clicked 'Contact Sales' on the Enterprise pricing tier. | `src/pages/pricing.astro` |
| `features_page_viewed` | User viewed the features page, indicating top-of-funnel interest in the product. | `src/pages/features.astro` |
| `nav_get_started_clicked` | User clicked the 'Get Started' button in the top navigation bar. | `src/components/Navigation.astro` |
| `docs_section_clicked` | User clicked on a documentation section card on the docs page. | `src/pages/docs.astro` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1787321)
- [Marketing Conversion Funnel](https://us.posthog.com/project/483112/insights/9742881)
- [Total CTA Clicks Over Time](https://us.posthog.com/project/483112/insights/9742885)
- [Pricing Plan Selection Breakdown](https://us.posthog.com/project/483112/insights/9742901)
- [Contact Sales Clicks Over Time](https://us.posthog.com/project/483112/insights/9742904)
- [Docs Engagement by Section](https://us.posthog.com/project/483112/insights/9742907)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
