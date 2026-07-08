# PostHog post-wizard report

The wizard has completed a full PostHog integration for the NeuralFlow AI marketing site. A new `src/components/posthog.astro` component was created with the PostHog web snippet, wrapped in a `window.__posthog_initialized` guard to prevent stack overflow during Astro View Transitions soft navigation. The component is imported into `src/layouts/Layout.astro` so it loads on every page. Nine custom events were instrumented across five files, covering key conversion touchpoints: hero and navigation CTAs, pricing plan selections, feature and docs page exploration.

| Event Name | Description | File |
|---|---|---|
| `hero_cta_clicked` | User clicks the primary 'Start Free Trial' CTA on the homepage hero section. | `src/pages/index.astro` |
| `hero_docs_clicked` | User clicks the 'Read the Docs' button on the homepage hero section. | `src/pages/index.astro` |
| `pricing_page_viewed` | User views the pricing page, marking entry to the conversion funnel. | `src/pages/pricing.astro` |
| `pricing_starter_clicked` | User clicks the 'Get Started' button on the Starter pricing plan. | `src/pages/pricing.astro` |
| `pricing_pro_clicked` | User clicks the 'Start Free Trial' button on the Pro pricing plan. | `src/pages/pricing.astro` |
| `pricing_enterprise_clicked` | User clicks the 'Contact Sales' button on the Enterprise pricing plan. | `src/pages/pricing.astro` |
| `nav_cta_clicked` | User clicks the 'Get Started' CTA button in the top navigation bar. | `src/components/Navigation.astro` |
| `docs_section_clicked` | User clicks on a documentation section card on the docs page. | `src/pages/docs.astro` |
| `features_page_viewed` | User views the features page, indicating product exploration intent. | `src/pages/features.astro` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://us.posthog.com/project/483112/dashboard/1818045)
- [Pricing page to CTA conversion funnel](https://us.posthog.com/project/483112/insights/lD9PXb0i)
- [CTA clicks over time](https://us.posthog.com/project/483112/insights/X0phMlsn)
- [Pricing plan CTA breakdown](https://us.posthog.com/project/483112/insights/r1al7V8t)
- [Page exploration trends](https://us.posthog.com/project/483112/insights/UuTknpTt)
- [Docs section engagement](https://us.posthog.com/project/483112/insights/2lvI82N4)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
