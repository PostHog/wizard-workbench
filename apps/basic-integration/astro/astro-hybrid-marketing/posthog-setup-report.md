<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Astro hybrid marketing site (NeuralFlow AI). The integration covers both client-side (browser) and server-side (API route) event tracking, user identification, and error capture.

**Files created:**
- `src/components/posthog.astro` — PostHog browser snippet component using `is:inline` and environment variables
- `src/lib/posthog-server.ts` — Singleton `posthog-node` client for server-side event tracking
- `.env` — PostHog public token and host set (never hardcoded in source)

**Files modified:**
- `src/layouts/Layout.astro` — Imports and renders the PostHog component in `<head>` so every page gets analytics
- `src/pages/index.astro` — Tracks hero CTA button clicks
- `src/pages/pricing.astro` — Tracks pricing page view and per-plan CTA clicks
- `src/components/Navigation.astro` — Tracks the nav "Get Started" CTA
- `src/pages/contact.astro` — Tracks form submission lifecycle and identifies users on success
- `src/pages/api/contact.ts` — Server-side tracking of form receipt, validation failures, and user identification

| Event name | Description | File |
|---|---|---|
| `free_trial_cta_clicked` | "Start Free Trial" button clicked in hero section | `src/pages/index.astro` |
| `contact_sales_clicked` | "Contact Sales" button clicked in hero section | `src/pages/index.astro` |
| `pricing_viewed` | Pricing page viewed (top of conversion funnel) | `src/pages/pricing.astro` |
| `pricing_plan_cta_clicked` | A pricing plan CTA button clicked (with `plan` property) | `src/pages/pricing.astro` |
| `get_started_clicked` | "Get Started" CTA clicked in the navigation bar | `src/components/Navigation.astro` |
| `contact_form_submitted` | User submitted the contact form | `src/pages/contact.astro` |
| `contact_form_succeeded` | Contact form submission accepted by server | `src/pages/contact.astro` |
| `contact_form_errored` | Contact form submission failed (server or network error) | `src/pages/contact.astro` |
| `contact_form_received` | Server successfully received and processed a form submission | `src/pages/api/contact.ts` |
| `contact_form_validation_failed` | Server rejected form submission due to validation errors | `src/pages/api/contact.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) Dashboard](https://us.posthog.com/project/483112/dashboard/1792393)
- [Pricing Conversion Funnel](https://us.posthog.com/project/483112/insights/GzB6LJb9)
- [Free Trial CTA Clicks Over Time](https://us.posthog.com/project/483112/insights/5lW3x9db)
- [Contact Form Conversion](https://us.posthog.com/project/483112/insights/Z7dbNBSF)
- [Pricing Plan CTA by Plan](https://us.posthog.com/project/483112/insights/VLYnrzIT)
- [CTA Engagement (Get Started + Contact Sales)](https://us.posthog.com/project/483112/insights/3VEOcE36)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — the current implementation only identifies on a successful contact form submission. If your app later adds a login flow, make sure `identify` is called there too so returning sessions are not left on anonymous distinct IDs.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
