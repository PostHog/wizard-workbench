<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the NeuralFlow AI static Astro marketing site. A reusable `posthog.astro` snippet component was created and loaded in the existing `Layout.astro` so PostHog initializes on every page. Event tracking was added across key conversion touchpoints: the hero and navigation CTAs, all three pricing plan buttons, enterprise contact sales, and all six documentation section links. Global unhandled error and promise rejection handlers were added to the PostHog component to capture any runtime errors site-wide.

| Event Name | Description | File |
|---|---|---|
| `cta_clicked` | User clicks the primary 'Start Free Trial' call-to-action button on the hero section. | `src/pages/index.astro` |
| `docs_cta_clicked` | User clicks 'Read the Docs' button on the homepage hero section. | `src/pages/index.astro` |
| `pricing_plan_clicked` | User clicks a pricing plan CTA button (Starter, Pro, or Enterprise) on the pricing page. | `src/pages/pricing.astro` |
| `contact_sales_clicked` | User clicks 'Contact Sales' on the Enterprise pricing plan. | `src/pages/pricing.astro` |
| `docs_section_clicked` | User clicks on a documentation section card on the docs page. | `src/pages/docs.astro` |
| `nav_cta_clicked` | User clicks the 'Get Started' button in the main navigation. | `src/components/Navigation.astro` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1793436)
- [CTA Clicks Trend](https://us.posthog.com/project/483112/insights/E15ADC2I)
- [Pricing Plan Interest by Plan](https://us.posthog.com/project/483112/insights/Eg94yGNY)
- [Enterprise Lead Signal — Contact Sales](https://us.posthog.com/project/483112/insights/yQ3AoyMA)
- [Docs Section Engagement](https://us.posthog.com/project/483112/insights/dEaIUNVy)
- [Total Marketing CTA Actions](https://us.posthog.com/project/483112/insights/iEx2Qoki)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
