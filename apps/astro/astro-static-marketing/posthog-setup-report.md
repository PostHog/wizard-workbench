<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the NeuralFlow AI static Astro marketing site. The integration uses the PostHog web snippet via an `is:inline` Astro component to avoid TypeScript processing errors, and tracks key conversion and engagement events across all marketing pages. Environment variables are used for all credentials — no keys are hardcoded.

**Files created or modified:**

- `src/components/posthog.astro` — New PostHog initialization component using the web snippet with `is:inline` and `define:vars` for environment variable injection
- `src/layouts/Layout.astro` — Updated to import and include `<PostHog />` in the `<head>` of every page
- `src/pages/index.astro` — Added tracking for hero CTA buttons ("Start Free Trial" and "Read the Docs")
- `src/pages/pricing.astro` — Added tracking for all three pricing plan CTA buttons (Starter, Pro, Enterprise)
- `src/components/Navigation.astro` — Added tracking for the nav "Get Started" CTA
- `src/pages/docs.astro` — Added tracking for all six documentation section cards
- `.env` — Created with `PUBLIC_POSTHOG_KEY` and `PUBLIC_POSTHOG_HOST` environment variables

| Event name | Description | File |
|---|---|---|
| `cta_clicked` | User clicked the primary "Start Free Trial" CTA button on the hero section | `src/pages/index.astro` |
| `docs_cta_clicked` | User clicked the "Read the Docs" secondary CTA button on the hero section | `src/pages/index.astro` |
| `pricing_plan_clicked` | User clicked a pricing plan CTA button (Starter `$29` or Pro `$99`), with `plan` and `price` properties | `src/pages/pricing.astro` |
| `contact_sales_clicked` | User clicked the "Contact Sales" button on the Enterprise pricing plan | `src/pages/pricing.astro` |
| `nav_cta_clicked` | User clicked the "Get Started" button in the navigation bar | `src/components/Navigation.astro` |
| `doc_section_clicked` | User clicked a documentation section card, with a `section` property (e.g. `getting-started`, `api-reference`) | `src/pages/docs.astro` |

## Next steps

To monitor user behavior with these events, build insights in PostHog for your project:

- [Create a new insight](https://us.posthog.com/project/2/insights/new) — Build trend charts, funnels, or breakdowns using the events above
- [Pricing conversion funnel](https://us.posthog.com/project/2/insights/new) — Funnel: `$pageview` → `pricing_plan_clicked` or `contact_sales_clicked`
- [CTA engagement trend](https://us.posthog.com/project/2/insights/new) — Trend chart comparing `cta_clicked`, `nav_cta_clicked`, and `docs_cta_clicked` over time
- [Docs section popularity](https://us.posthog.com/project/2/insights/new) — Breakdown of `doc_section_clicked` by the `section` property
- [Pricing plan breakdown](https://us.posthog.com/project/2/insights/new) — Breakdown of `pricing_plan_clicked` by the `plan` property (starter vs. pro)
- [Create a dashboard](https://us.posthog.com/project/2/dashboard/new) — Combine all of the above into an "Analytics basics" dashboard

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
