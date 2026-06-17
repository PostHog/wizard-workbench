# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into this Astro (hybrid) marketing site. Here's what was added:

- **`src/components/posthog.astro`** — new client-side PostHog snippet component, initialized from environment variables via `define:vars` and `is:inline`.
- **`src/lib/posthog-server.ts`** — new singleton for `posthog-node`, used in server-rendered API routes.
- **`src/layouts/Layout.astro`** — imports and renders `<PostHog />` in the `<head>` so all pages are instrumented.
- **`src/pages/index.astro`** — tracks "Start Free Trial" and "Contact Sales" hero CTA clicks.
- **`src/pages/pricing.astro`** — tracks when the pricing page is viewed (top of funnel) and which plan CTA is clicked.
- **`src/pages/contact.astro`** — identifies users by email on successful form submission; captures network errors and sends the PostHog session/distinct IDs as headers to the server.
- **`src/pages/api/contact.ts`** — tracks successful and failed contact form submissions server-side; identifies users by email with `posthog.identify()`.
- **`.env`** — `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` written (gitignored automatically).
- **`package.json`** — `posthog-js` and `posthog-node` added as dependencies.

| Event | Description | File |
|---|---|---|
| `free_trial_started` | User clicks "Start Free Trial" on the homepage hero | `src/pages/index.astro` |
| `contact_sales_clicked` | User clicks "Contact Sales" on the homepage hero | `src/pages/index.astro` |
| `pricing_page_viewed` | User views the pricing page (top of conversion funnel) | `src/pages/pricing.astro` |
| `pricing_plan_selected` | User clicks a pricing plan CTA (properties: `plan`: starter/pro/enterprise) | `src/pages/pricing.astro` |
| `contact_form_submitted` | Contact form successfully processed server-side (properties: `interest`, `has_company`) | `src/pages/api/contact.ts` |
| `contact_form_failed` | Contact form rejected server-side (properties: `reason`: missing_required_fields/invalid_email/server_error) | `src/pages/api/contact.ts` |
| `contact_form_error` | Network error on contact form submit (client-side) | `src/pages/contact.astro` |

## Next steps

The PostHog MCP did not have the `dashboard:write` and `query:read` scopes needed to create the dashboard automatically. Create the **"Analytics basics (wizard)"** dashboard manually using the links below.

Suggested insights to add:

1. **Conversion funnel** — Funnel from `pricing_page_viewed` → `pricing_plan_selected` → `contact_form_submitted`. [New insight](https://us.posthog.com/project/2/insights/new)
2. **Free trial CTA clicks over time** — Trend of `free_trial_started`. [New insight](https://us.posthog.com/project/2/insights/new)
3. **Plan selection breakdown** — Trend of `pricing_plan_selected` broken down by `plan` property. [New insight](https://us.posthog.com/project/2/insights/new)
4. **Contact form success vs. failure** — Trend comparing `contact_form_submitted` vs. `contact_form_failed`. [New insight](https://us.posthog.com/project/2/insights/new)
5. **Contact form failure reasons** — Trend of `contact_form_failed` broken down by `reason` property. [New insight](https://us.posthog.com/project/2/insights/new)

[Create "Analytics basics (wizard)" dashboard](https://us.posthog.com/project/2/dashboard)

## Verify before merging

- [ ] Run a full production build (the wizard only verified the files it touched) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.
- [ ] Confirm the returning-visitor path also calls `identify` — currently identify only fires when the contact form is submitted, so returning visitors who don't re-submit the form will remain on their anonymous distinct ID until their next submission.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
