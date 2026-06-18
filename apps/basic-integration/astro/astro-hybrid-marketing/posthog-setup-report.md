# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the NeuralFlow AI marketing site. The integration covers both client-side browser tracking (via the PostHog JS snippet) and server-side tracking (via `posthog-node`) for the contact form API route.

**Files created:**
- `src/components/posthog.astro` — PostHog client-side snippet, loaded via `is:inline` to avoid TypeScript processing errors.
- `src/lib/posthog-server.ts` — Singleton pattern for the `posthog-node` server-side client used in API routes.

**Files modified:**
- `src/layouts/Layout.astro` — Imports and renders the `<PostHog />` component in `<head>` so all pages get analytics automatically.
- `src/pages/index.astro` — Tracks hero CTA clicks (`free_trial_clicked`, `contact_sales_clicked`).
- `src/components/Navigation.astro` — Tracks the nav "Get Started" CTA (`get_started_clicked`).
- `src/pages/pricing.astro` — Tracks pricing page views and plan CTA clicks with the plan name as a property.
- `src/pages/contact.astro` — Tracks form submission outcomes, identifies users by email on success, and captures network errors via `captureException`.
- `src/pages/api/contact.ts` — Tracks server-side form events and identifies users; reads `X-PostHog-Session-Id` and `X-PostHog-Distinct-Id` headers from the client to maintain session continuity.

**Environment variables added to `.env`:** `PUBLIC_POSTHOG_PROJECT_TOKEN`, `PUBLIC_POSTHOG_HOST`.

| Event name | Description | File |
|---|---|---|
| `free_trial_clicked` | User clicked the 'Start Free Trial' button on the home page hero section. | `src/pages/index.astro` |
| `contact_sales_clicked` | User clicked the 'Contact Sales' button on the home page hero section. | `src/pages/index.astro` |
| `get_started_clicked` | User clicked the 'Get Started' call-to-action in the site navigation. | `src/components/Navigation.astro` |
| `pricing_page_viewed` | User viewed the pricing page, indicating top-of-funnel purchase intent. | `src/pages/pricing.astro` |
| `pricing_plan_clicked` | User clicked a CTA button on a specific pricing plan (Starter, Pro, or Enterprise). | `src/pages/pricing.astro` |
| `contact_form_submitted` | User successfully submitted the contact form on the client side. | `src/pages/contact.astro` |
| `contact_form_error` | User received an error after submitting the contact form on the client side. | `src/pages/contact.astro` |
| `contact_form_received` | Server successfully processed and accepted a valid contact form submission. | `src/pages/api/contact.ts` |
| `contact_form_validation_failed` | Server rejected a contact form submission due to missing or invalid fields. | `src/pages/api/contact.ts` |
| `contact_form_server_error` | Server encountered an unexpected error while processing a contact form submission. | `src/pages/api/contact.ts` |

## Next steps

The PostHog API key used by the wizard did not have `dashboard:write` or `insight:write` scopes, so the dashboard could not be created automatically. Visit your PostHog project to create it manually:

- [PostHog Dashboards](https://us.posthog.com/project/2/dashboard) — create a new dashboard named "Analytics basics (wizard)"
- [New Insight](https://us.posthog.com/project/2/insights/new) — suggested insights to add:
  1. **Conversion funnel** — `pricing_page_viewed` → `pricing_plan_clicked` → `contact_form_submitted`
  2. **Contact form submissions over time** — trends for `contact_form_received`
  3. **CTA click breakdown** — trends for `free_trial_clicked`, `contact_sales_clicked`, `get_started_clicked`
  4. **Pricing plan interest** — breakdown of `pricing_plan_clicked` by the `plan` property
  5. **Contact form error rate** — `contact_form_error` vs `contact_form_submitted`

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — currently `identify` is only called on successful contact form submission. If you add authentication later, ensure `identify` is called on login/session restore as well.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
