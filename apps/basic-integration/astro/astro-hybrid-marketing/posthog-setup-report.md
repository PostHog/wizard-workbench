<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into this Astro hybrid marketing site (NeuralFlow AI). The integration covers both client-side and server-side event tracking, user identification on the contact form, and error capture.

**What was added:**

- `src/components/posthog.astro` — PostHog web snippet loaded via `is:inline` to avoid TypeScript conflicts. Reads token and host from environment variables using `define:vars`.
- `src/layouts/Layout.astro` — Imports and renders `<PostHog />` in the `<head>` of every page.
- `src/lib/posthog-server.ts` — Singleton factory for the `posthog-node` server-side client, used by API routes.
- `src/pages/index.astro` — Click tracking for hero CTAs ("Start Free Trial" and "Contact Sales").
- `src/pages/pricing.astro` — Page-load event for top-of-funnel tracking and click tracking for all three plan CTA buttons with plan name property.
- `src/pages/contact.astro` — On successful form submit: identifies the user by email and captures the conversion event. On failure: captures the exception.
- `src/pages/api/contact.ts` — Server-side event on successful contact form receipt, with `$session_id` and `distinct_id` headers passed from the client for session correlation.

**Environment variables** (written to `.env`):
- `PUBLIC_POSTHOG_PROJECT_TOKEN`
- `PUBLIC_POSTHOG_HOST`

| Event | Description | File |
|---|---|---|
| `free_trial_started` | User clicked "Start Free Trial" CTA on the homepage hero | `src/pages/index.astro` |
| `contact_sales_clicked` | User clicked "Contact Sales" on the homepage hero | `src/pages/index.astro` |
| `pricing_plan_viewed` | User viewed the pricing page (top of conversion funnel) | `src/pages/pricing.astro` |
| `pricing_cta_clicked` | User clicked a pricing plan CTA, includes `plan` and `cta` properties | `src/pages/pricing.astro` |
| `contact_form_submitted` | User successfully submitted the contact form (client-side) | `src/pages/contact.astro` |
| `contact_submission_received` | API route received and validated the contact form (server-side) | `src/pages/api/contact.ts` |

## Next steps

To build an "Analytics basics" dashboard, navigate to [Dashboards](/dashboard) in PostHog and create insights for:

1. **Free trial CTAs** — Trends for `free_trial_started` over time
2. **Pricing page funnel** — Funnel from `pricing_plan_viewed` → `pricing_cta_clicked` → `contact_form_submitted`
3. **Contact form conversion** — Trends for `contact_form_submitted` and `contact_submission_received`
4. **CTA breakdown by plan** — `pricing_cta_clicked` broken down by the `plan` property
5. **CTA breakdown by location** — `contact_sales_clicked` and `free_trial_started` breakdown by `location`

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
