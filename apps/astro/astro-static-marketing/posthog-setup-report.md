<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this static Astro (SSG) marketing site. Here is a summary of changes made:

- Created `src/components/posthog.astro`: a reusable PostHog web snippet component using `is:inline` and `define:vars` to inject environment variables at build time. All keys come from `.env` — nothing is hardcoded.
- Updated `src/layouts/Layout.astro`: imported and rendered `<PostHog />` in the `<head>`, so every page on the site initialises PostHog automatically.
- Added click-tracking scripts (using `<script is:inline>`) to four files — the hero CTAs, the nav CTA, the pricing plan buttons, and the docs section cards.
- Created `.env` with `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` (`.gitignore` coverage ensured by the wizard tooling).

## Tracked events

| Event name | Description | File |
|---|---|---|
| `cta_clicked` | User clicked a hero CTA button (`cta`: `start_free_trial` or `read_the_docs`, `location`: `hero`) | `src/pages/index.astro` |
| `nav_cta_clicked` | User clicked the "Get Started" CTA in the main navigation | `src/components/Navigation.astro` |
| `pricing_cta_clicked` | User clicked a pricing plan button (`plan`: `starter`/`pro`/`enterprise`, `cta`: `get_started`/`start_free_trial`/`contact_sales`) | `src/pages/pricing.astro` |
| `docs_section_clicked` | User clicked a documentation section card (`section`: `getting_started`/`api_reference`/`integrations`/`workflows`/`security`/`faq`) | `src/pages/docs.astro` |

## Next steps

We recommend creating an **"Analytics basics"** dashboard in PostHog with the following insights:

1. **Hero CTA conversion** — Trend of `cta_clicked` filtered to `location = hero`, broken down by `cta` property. Shows how often visitors click "Start Free Trial" vs "Read the Docs".
2. **Pricing funnel** — Funnel from any pageview → `pricing_cta_clicked`. Shows how many visitors reach the pricing page and convert to a plan CTA click.
3. **Pricing plan breakdown** — Bar chart of `pricing_cta_clicked` broken down by `plan`. Shows which plan (Starter / Pro / Enterprise) attracts the most interest.
4. **Docs engagement** — Trend of `docs_section_clicked` broken down by `section`. Shows which documentation topics visitors explore most.
5. **Nav CTA clicks** — Trend of `nav_cta_clicked` over time. Shows overall top-of-funnel interest from the navigation bar.

You can create this dashboard at:
https://us.i.posthog.com/project/2/dashboards

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
