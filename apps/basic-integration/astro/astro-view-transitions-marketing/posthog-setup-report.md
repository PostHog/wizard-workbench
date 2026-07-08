# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the NeuralFlow AI marketing site (Astro with View Transitions). PostHog is initialized in a reusable `src/components/posthog.astro` component using the web snippet with a `window.__posthog_initialized` guard to prevent stack overflow during soft navigation, and `capture_pageview: 'history_change'` for automatic pageview tracking. The component is imported into `src/layouts/Layout.astro`, ensuring every page is covered. Event capture scripts use the `astro:page-load` event alongside `DOMContentLoaded` so listeners are re-bound correctly after each view transition.

| Event name | Description | File |
|---|---|---|
| `free_trial_clicked` | User clicks the "Start Free Trial" CTA in the hero section | `src/pages/index.astro` |
| `read_docs_clicked` | User clicks the "Read the Docs" button in the hero section | `src/pages/index.astro` |
| `nav_cta_clicked` | User clicks the "Get Started" CTA in the top navigation | `src/components/Navigation.astro` |
| `pricing_viewed` | User views the pricing page (conversion funnel entry) | `src/pages/pricing.astro` |
| `pricing_plan_cta_clicked` | User clicks Get Started / Start Free Trial on a pricing card (includes `plan` property) | `src/pages/pricing.astro` |
| `contact_sales_clicked` | User clicks "Contact Sales" on the Enterprise pricing card | `src/pages/pricing.astro` |
| `docs_section_clicked` | User clicks a documentation section card (includes `section` property) | `src/pages/docs.astro` |
| `features_viewed` | User views the features page (top-of-funnel intent signal) | `src/pages/features.astro` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1816742)
- [CTA clicks over time (wizard)](https://us.posthog.com/project/483112/insights/aqi5BSV8)
- [Pricing conversion funnel (wizard)](https://us.posthog.com/project/483112/insights/zgwIhj3Q)
- [Pricing plan selection breakdown (wizard)](https://us.posthog.com/project/483112/insights/umFhArQS)
- [Docs section engagement (wizard)](https://us.posthog.com/project/483112/insights/9m2VatLM)
- [Contact Sales vs plan CTA clicks (wizard)](https://us.posthog.com/project/483112/insights/4ShTfq9d)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
