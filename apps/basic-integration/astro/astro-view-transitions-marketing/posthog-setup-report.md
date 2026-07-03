# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the NeuralFlow AI marketing site. A new `src/components/posthog.astro` component was created with the PostHog web snippet, wrapped in a `window.__posthog_initialized` guard to prevent stack overflow errors during Astro View Transitions soft navigation. The component is mounted in `src/layouts/Layout.astro` and uses `capture_pageview: 'history_change'` for automatic pageview tracking across all route changes. Event tracking was added to the homepage hero CTAs, the navigation header CTA, the pricing page (plan view and plan clicks), the docs section cards, and the footer links — all using the `astro:page-load` + `DOMContentLoaded` pattern required for correct behavior with Astro's ClientRouter/ViewTransitions.

| Event name | Description | File |
|---|---|---|
| `hero_cta_clicked` | User clicks the primary 'Start Free Trial' button in the hero section of the homepage. | `src/pages/index.astro` |
| `hero_docs_cta_clicked` | User clicks the 'Read the Docs' secondary CTA in the homepage hero, indicating developer interest. | `src/pages/index.astro` |
| `nav_cta_clicked` | User clicks the 'Get Started' call-to-action button in the site navigation header. | `src/components/Navigation.astro` |
| `pricing_viewed` | User views the pricing page, a top-of-funnel conversion signal indicating purchase intent. | `src/pages/pricing.astro` |
| `pricing_plan_clicked` | User clicks the CTA button on a pricing plan card (Starter, Pro, or Enterprise), with `plan` property. | `src/pages/pricing.astro` |
| `docs_section_clicked` | User clicks on a documentation section card, with `section` property (getting_started, api_reference, etc.). | `src/pages/docs.astro` |
| `footer_link_clicked` | User clicks a link in the site footer, with `link` property (features, pricing, about, docs, privacy, terms). | `src/components/Footer.astro` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://us.posthog.com/project/483112/dashboard/1793440)
- [Pricing conversion funnel](https://us.posthog.com/project/483112/insights/C2r0Nfi6) — pricing_viewed → pricing_plan_clicked
- [CTA clicks over time](https://us.posthog.com/project/483112/insights/yTReNvUk) — all CTA click trends
- [Pricing plan selection breakdown](https://us.posthog.com/project/483112/insights/SjmmBAtj) — which plans users click
- [Docs section engagement](https://us.posthog.com/project/483112/insights/8Z98E4o0) — which docs sections attract most interest
- [Pricing page views over time](https://us.posthog.com/project/483112/insights/lZvQZT0Y) — purchase intent signal

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
