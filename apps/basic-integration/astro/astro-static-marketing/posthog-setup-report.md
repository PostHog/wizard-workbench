# PostHog post-wizard report

The wizard has completed a full PostHog analytics integration for the NeuralFlow AI static Astro marketing site. A `src/components/posthog.astro` snippet component was created and injected into `src/layouts/Layout.astro`, initialising PostHog on every page via environment variables. Custom event capture was added to the hero section, pricing page, docs page, navigation, and footer using `is:inline` scripts to avoid Astro/TypeScript conflicts. Environment variables (`PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST`) were written to `.env` and are referenced throughout — no tokens are hardcoded.

| Event name | Description | File |
|---|---|---|
| `hero_cta_clicked` | User clicks "Start Free Trial" in the hero section | `src/pages/index.astro` |
| `hero_docs_clicked` | User clicks "Read the Docs" in the hero section | `src/pages/index.astro` |
| `pricing_viewed` | User views the pricing page (top of conversion funnel) | `src/pages/pricing.astro` |
| `pricing_plan_selected` | User clicks a "Get Started" or "Start Free Trial" CTA on a pricing plan | `src/pages/pricing.astro` |
| `enterprise_contact_clicked` | User clicks "Contact Sales" on the Enterprise plan | `src/pages/pricing.astro` |
| `docs_section_clicked` | User clicks a documentation section card | `src/pages/docs.astro` |
| `nav_cta_clicked` | User clicks "Get Started" in the navigation bar | `src/components/Navigation.astro` |
| `footer_link_clicked` | User clicks a link in the site footer | `src/components/Footer.astro` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1795654)
- [CTA Click Trends](https://us.posthog.com/project/483112/insights/E9Hs4uDy)
- [Pricing Page Conversion Funnel](https://us.posthog.com/project/483112/insights/iQcAL7EW)
- [Pricing Plan Selection by Plan](https://us.posthog.com/project/483112/insights/J9pFIZin)
- [Docs Section Engagement](https://us.posthog.com/project/483112/insights/L3OOzy4m)
- [Enterprise Contact Click Rate vs. Pricing Page](https://us.posthog.com/project/483112/insights/1aFq91gr)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
