<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the NeuralFlow AI static Astro marketing site.

## What was done

- **Installed** `posthog-js` as a project dependency
- **Created** `src/components/posthog.astro` — a reusable PostHog web snippet component using `is:inline` and `define:vars` to safely inject environment variables without hardcoding keys
- **Updated** `src/layouts/Layout.astro` — imported and added `<PostHog />` to the `<head>` so analytics initialise on every page across the site
- **Added event tracking** to four files covering all major conversion and engagement touchpoints:

| Event name | Description | File |
|---|---|---|
| `cta_clicked` | User clicks the primary "Start Free Trial" CTA button in the hero section | `src/pages/index.astro` |
| `docs_cta_clicked` | User clicks the "Read the Docs" button in the hero section | `src/pages/index.astro` |
| `pricing_viewed` | User lands on the pricing page — top of conversion funnel | `src/pages/pricing.astro` |
| `pricing_plan_clicked` | User clicks a pricing plan CTA (Starter or Pro), with `plan` and `price` properties | `src/pages/pricing.astro` |
| `contact_sales_clicked` | User clicks the "Contact Sales" button on the Enterprise plan | `src/pages/pricing.astro` |
| `docs_section_clicked` | User clicks a documentation section card, with `section` property | `src/pages/docs.astro` |
| `nav_get_started_clicked` | User clicks the "Get Started" button in the navigation bar | `src/components/Navigation.astro` |

## Environment variables

The following variables were written to `.env` (gitignored):

```
PUBLIC_POSTHOG_KEY=sTMFPsFhdP1Ssg
PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
```

## Next steps

We've designed the following insights and a dashboard to keep an eye on user behaviour, based on the events just instrumented. Create them in PostHog at **https://us.posthog.com/project/2**:

**Dashboard:** "Analytics basics" — Core analytics dashboard for NeuralFlow AI static marketing site

**Recommended insights to add:**

1. **Pricing Conversion Funnel** — Funnel: `pricing_viewed` → `pricing_plan_clicked` (tracks drop-off in the pricing conversion flow)
2. **Hero & Nav CTA Clicks** — Trend: `cta_clicked` + `nav_get_started_clicked` (monitors top-of-funnel demand signals)
3. **Pricing Plan Selection** — Trend: `pricing_plan_clicked` broken down by `plan` property (reveals which tier attracts most interest)
4. **Enterprise Contact Sales Clicks** — Trend: `contact_sales_clicked` (tracks high-value enterprise lead generation)
5. **Docs Section Engagement** — Trend: `docs_section_clicked` broken down by `section` property (shows which docs topics drive the most interest)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-astro-static/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
