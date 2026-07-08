<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Astro hybrid marketing site (NeuralFlow AI). The setup adds both **client-side** tracking via the PostHog web snippet and **server-side** tracking via `posthog-node` in the API route.

Key changes made:

- Created `src/components/posthog.astro` — PostHog web snippet component using `is:inline` and `define:vars` to inject environment variables.
- Updated `src/layouts/Layout.astro` — Imported and rendered the `<PostHog />` component in the `<head>`, ensuring all pages are instrumented.
- Created `src/lib/posthog-server.ts` — Singleton `getPostHogServer()` function for server-side PostHog client reuse.
- Updated `src/pages/index.astro` — Added `cta_clicked` event for hero CTA buttons ("Start Free Trial" and "Contact Sales").
- Updated `src/pages/pricing.astro` — Added `pricing_plan_clicked` event on all pricing plan CTA buttons, with `plan` and `price` properties.
- Updated `src/pages/contact.astro` — Added `contact_form_started` event on first form interaction; passes PostHog session ID and distinct ID headers to the API for session correlation.
- Updated `src/pages/api/contact.ts` — Added server-side `contact_form_submitted` capture (with `interest` and `has_company` properties) and error capture via `$exception` event.

| Event | Description | File |
|-------|-------------|------|
| `cta_clicked` | User clicks the primary CTA button (Start Free Trial or Contact Sales) on the homepage hero. | `src/pages/index.astro` |
| `pricing_plan_clicked` | User clicks the CTA button on a pricing plan card. | `src/pages/pricing.astro` |
| `contact_form_started` | User starts filling out the contact form (first interaction with the form). | `src/pages/contact.astro` |
| `contact_form_submitted` | Contact form submission was successfully processed server-side. | `src/pages/api/contact.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) — Dashboard](https://us.posthog.com/project/483112/dashboard/1818042)
- [Contact form conversion funnel](https://us.posthog.com/project/483112/insights/i60c9Gcl)
- [CTA clicks over time (by CTA type)](https://us.posthog.com/project/483112/insights/fAejbWW5)
- [Pricing plan clicks by plan](https://us.posthog.com/project/483112/insights/G6UmRzIg)
- [Contact form submissions over time](https://us.posthog.com/project/483112/insights/vgmzSiGo)
- [Top of funnel: CTA → form started → form submitted](https://us.posthog.com/project/483112/insights/71VCElGL)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
