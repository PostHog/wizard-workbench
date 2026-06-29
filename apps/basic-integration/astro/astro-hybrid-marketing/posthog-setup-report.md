<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Astro hybrid marketing site (NeuralFlow AI). Changes include:

- **`src/components/posthog.astro`** (new): PostHog browser snippet, initialised with `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` via `define:vars`. Uses `is:inline` to prevent Astro from processing it.
- **`src/layouts/Layout.astro`**: Imports and renders `<PostHog />` in `<head>`, ensuring every page loads the analytics snippet.
- **`src/lib/posthog-server.ts`** (new): Singleton `getPostHogServer()` returning a `posthog-node` client; used by API routes for server-side event capture.
- **`src/pages/index.astro`**: Captures `start_free_trial_clicked` and `contact_sales_clicked` on hero CTA clicks.
- **`src/pages/features.astro`**: Captures `features_page_viewed` on page load (top-of-funnel signal).
- **`src/pages/pricing.astro`**: Captures `pricing_page_viewed` on load and `pricing_plan_clicked` (with `plan` property: starter/pro/enterprise) on CTA clicks.
- **`src/components/Navigation.astro`**: Captures `navigation_cta_clicked` on the nav "Get Started" button.
- **`src/pages/contact.astro`**: Captures `contact_form_submitted` (with `interest` and `has_company` properties) on success; `contact_form_error` on failure; `captureException` on network errors. Passes `X-PostHog-Session-Id` and `X-PostHog-Distinct-Id` headers to the server for session correlation.
- **`src/pages/api/contact.ts`**: Server-side `contact_form_submitted` capture via `posthog-node`, reading session/distinct IDs from request headers.
- **`.env`** (new): `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` set and covered by `.gitignore`.

| Event name | Description | File |
|---|---|---|
| `start_free_trial_clicked` | User clicks the Start Free Trial CTA on the homepage hero section. | `src/pages/index.astro` |
| `contact_sales_clicked` | User clicks the Contact Sales CTA on the homepage hero section. | `src/pages/index.astro` |
| `features_page_viewed` | User views the features page, indicating interest at the top of the conversion funnel. | `src/pages/features.astro` |
| `pricing_page_viewed` | User views the pricing page, a key conversion funnel step. | `src/pages/pricing.astro` |
| `pricing_plan_clicked` | User clicks a pricing plan CTA button, indicating intent to sign up or contact sales. | `src/pages/pricing.astro` |
| `navigation_cta_clicked` | User clicks the Get Started CTA in the top navigation bar. | `src/components/Navigation.astro` |
| `contact_form_submitted` | User successfully submits the contact form (client-side capture). | `src/pages/contact.astro` |
| `contact_form_error` | Contact form submission fails due to a validation or network error. | `src/pages/contact.astro` |
| `contact_form_submitted` | Server-side capture of a successful contact form submission with lead details. | `src/pages/api/contact.ts` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics (wizard) dashboard](https://us.i.posthog.com/project/483112/dashboard/1775076)
  - Conversion Funnel: features_page_viewed → pricing_page_viewed → pricing_plan_clicked → contact_form_submitted
  - CTA Performance: Free Trial vs Contact Sales over time
  - Pricing Plan Popularity Breakdown (by plan property)
  - Form Health: Submissions vs Errors over time
  - Navigation CTA Engagement over time

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
