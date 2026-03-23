<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the NeuralFlow AI marketing site. Here's a summary of what was done:

- **Installed** `posthog-node` for server-side event tracking in API routes
- **Created** `src/components/posthog.astro` — client-side PostHog snippet loaded via `is:inline` in every page's `<head>` using environment variables
- **Created** `src/lib/posthog-server.ts` — singleton pattern for the `posthog-node` client used by API routes
- **Updated** `src/layouts/Layout.astro` — imports and renders `<PostHog />` so all pages are tracked automatically
- **Updated** `src/pages/index.astro` — captures `cta_clicked` and `contact_sales_clicked` events when hero buttons are clicked
- **Updated** `src/pages/pricing.astro` — captures `pricing_plan_selected` (Starter/Pro) and `contact_sales_clicked` (Enterprise) when plan CTAs are clicked
- **Updated** `src/pages/contact.astro` — captures `contact_form_submitted` with interest and company properties; passes `X-PostHog-Session-Id` and `X-PostHog-Distinct-Id` headers to the API route; captures exceptions on network errors
- **Updated** `src/pages/api/contact.ts` — captures `contact_form_completed` (server-confirmed success) and `contact_form_failed` (server error) using `posthog-node`, with `$session_id` and `distinctId` correlated to the client session
- **Configured** environment variables `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` in `.env`

| Event Name | Description | File |
|---|---|---|
| `cta_clicked` | User clicked a primary CTA button (Start Free Trial) | `src/pages/index.astro` |
| `contact_sales_clicked` | User clicked "Contact Sales" from hero or pricing | `src/pages/index.astro`, `src/pages/pricing.astro` |
| `pricing_plan_selected` | User clicked a pricing plan CTA (Starter or Pro) | `src/pages/pricing.astro` |
| `contact_form_submitted` | Client-side: user submitted the contact form | `src/pages/contact.astro` |
| `contact_form_completed` | Server-confirmed: contact form processed successfully | `src/pages/api/contact.ts` |
| `contact_form_failed` | Server error processing the contact form | `src/pages/api/contact.ts` |

## Next steps

Visit your PostHog project to explore your data and build insights based on the events above:

- [PostHog project — Events](https://us.posthog.com/project/238460/activity/explore)
- [PostHog project — Dashboards](https://us.posthog.com/project/238460/dashboard)
- [PostHog project — Funnels](https://us.posthog.com/project/238460/insights/new?insight=FUNNELS)

Suggested insights to build in PostHog:

1. **Contact form conversion funnel** — `contact_form_submitted` → `contact_form_completed`
2. **CTA engagement trend** — trend of `cta_clicked` and `contact_sales_clicked` over time
3. **Pricing plan interest breakdown** — breakdown of `pricing_plan_selected` by `plan` property
4. **Contact funnel from hero** — `contact_sales_clicked` → `contact_form_submitted` → `contact_form_completed`
5. **Form error rate** — `contact_form_failed` as a percentage of `contact_form_submitted`

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
