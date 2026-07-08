<wizard-report>
# PostHog post-wizard report

The wizard has completed a full PostHog analytics integration for the NeuralFlow AI static marketing site. A reusable `posthog.astro` snippet component was created and injected into the shared `Layout.astro` so every page initializes PostHog automatically. Eight custom events were instrumented across five files to capture key conversion and engagement actions. Environment variables for the PostHog project token and host are stored in `.env` and referenced via Astro's `PUBLIC_` env prefix.

| Event name | Description | File |
|---|---|---|
| `start_free_trial_clicked` | User clicks "Start Free Trial" in the hero section | `src/pages/index.astro` |
| `read_docs_clicked` | User clicks "Read the Docs" in the hero section | `src/pages/index.astro` |
| `pricing_page_viewed` | User views the pricing page (top of conversion funnel) | `src/pages/pricing.astro` |
| `pricing_plan_clicked` | User clicks a pricing plan CTA (property: `plan`) | `src/pages/pricing.astro` |
| `contact_sales_clicked` | User clicks "Contact Sales" on the Enterprise plan | `src/pages/pricing.astro` |
| `features_page_viewed` | User views the features page (early-funnel awareness) | `src/pages/features.astro` |
| `docs_section_clicked` | User clicks a documentation section card (property: `section`) | `src/pages/docs.astro` |
| `get_started_clicked` | User clicks "Get Started" in the navigation bar | `src/components/Navigation.astro` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1818049)
- [Pricing conversion funnel (wizard)](https://us.posthog.com/project/483112/insights/dYQ9X9QD)
- [CTA clicks over time (wizard)](https://us.posthog.com/project/483112/insights/oYPxL54M)
- [Pricing plan clicks by plan (wizard)](https://us.posthog.com/project/483112/insights/Kik0cr2x)
- [Docs section engagement (wizard)](https://us.posthog.com/project/483112/insights/D5I7pCeD)
- [Page awareness funnel (wizard)](https://us.posthog.com/project/483112/insights/kknWVclv)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` to `.env.example` and any bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
