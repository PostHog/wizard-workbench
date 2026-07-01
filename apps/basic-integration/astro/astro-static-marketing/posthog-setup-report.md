# PostHog post-wizard report

The wizard has completed a full integration of PostHog analytics into this Astro static marketing site. PostHog is initialized via a reusable `src/components/posthog.astro` component that is included in the site-wide `Layout.astro`, ensuring the snippet loads on every page. Five conversion and engagement events are now captured from interactive elements across the homepage, pricing page, docs page, and navigation.

| Event name | Description | File |
|---|---|---|
| `free_trial_cta_clicked` | User clicks the primary 'Start Free Trial' button in the hero section of the homepage. | `src/pages/index.astro` |
| `docs_cta_clicked` | User clicks the 'Read the Docs' button in the hero section of the homepage. | `src/pages/index.astro` |
| `pricing_cta_clicked` | User clicks a CTA button on the pricing page, indicating plan selection intent (properties: `plan`, `cta_text`). | `src/pages/pricing.astro` |
| `docs_section_clicked` | User clicks a documentation section card on the docs page (properties: `section`, `section_title`). | `src/pages/docs.astro` |
| `nav_get_started_clicked` | User clicks the 'Get Started' CTA in the navigation bar. | `src/components/Navigation.astro` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard — Analytics basics (wizard):** https://us.posthog.com/project/483112/dashboard/1787317
- Free Trial CTA Clicks: https://us.posthog.com/project/483112/insights/keMN17QO
- Pricing Plan CTA Clicks by Plan: https://us.posthog.com/project/483112/insights/KqdpRn6S
- Conversion Funnel: Pricing to Free Trial: https://us.posthog.com/project/483112/insights/3dHZ898H
- Nav Get Started Clicks: https://us.posthog.com/project/483112/insights/gJRugozh
- Docs Section Engagement: https://us.posthog.com/project/483112/insights/rhtI8ljm

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
