# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the NeuralFlow AI marketing site. The integration uses the inline snippet approach with a `window.__posthog_initialized` guard to prevent stack overflow errors during Astro View Transitions (ClientRouter) soft navigation. Pageviews are tracked automatically via `capture_pageview: 'history_change'`. Event tracking covers all major conversion touchpoints: hero CTAs, navigation CTAs, pricing plan selections, and documentation engagement.

## Files changed

| File | Change |
|---|---|
| `src/components/posthog.astro` | Created — PostHog snippet with View Transitions initialization guard |
| `src/layouts/Layout.astro` | Added `PostHog` component import and `<PostHog />` in `<head>` |
| `src/pages/index.astro` | Added click tracking for hero "Start Free Trial" and "Read the Docs" buttons |
| `src/components/Navigation.astro` | Added click tracking for "Get Started" nav CTA |
| `src/pages/pricing.astro` | Added pricing page viewed event and click tracking for all plan CTAs |
| `src/pages/features.astro` | Added features page viewed event |
| `src/pages/docs.astro` | Added data attributes and click tracking for all docs section cards |

## Events instrumented

| Event name | Description | File |
|---|---|---|
| `start_free_trial_clicked` | User clicks the primary 'Start Free Trial' CTA in the hero section. | `src/pages/index.astro` |
| `hero_docs_link_clicked` | User clicks the 'Read the Docs' secondary CTA in the hero section. | `src/pages/index.astro` |
| `get_started_nav_clicked` | User clicks the 'Get Started' button in the top navigation bar. | `src/components/Navigation.astro` |
| `pricing_page_viewed` | User views the pricing page, marking the top of the conversion funnel. | `src/pages/pricing.astro` |
| `pricing_plan_cta_clicked` | User clicks a CTA button on a pricing plan card (starter or pro), with `plan` property. | `src/pages/pricing.astro` |
| `contact_sales_clicked` | User clicks 'Contact Sales' on the Enterprise pricing plan. | `src/pages/pricing.astro` |
| `features_page_viewed` | User views the features page, indicating interest in product capabilities. | `src/pages/features.astro` |
| `docs_section_clicked` | User clicks a documentation section card, with `section` property. | `src/pages/docs.astro` |
| `docs_getting_started_clicked` | User clicks the 'Getting Started' documentation card. | `src/pages/docs.astro` |
| `docs_api_reference_clicked` | User clicks the 'API Reference' documentation card. | `src/pages/docs.astro` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1818063)
- [Trial CTA clicks over time](https://us.posthog.com/project/483112/insights/g2JVeG8V)
- [Pricing-to-trial conversion funnel](https://us.posthog.com/project/483112/insights/NUy7GjL3)
- [Pricing CTA clicks by plan](https://us.posthog.com/project/483112/insights/oOZ95nJI)
- [Docs section engagement](https://us.posthog.com/project/483112/insights/SXVqYwRt)
- [Feature & pricing page interest](https://us.posthog.com/project/483112/insights/3ed8fxli)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
