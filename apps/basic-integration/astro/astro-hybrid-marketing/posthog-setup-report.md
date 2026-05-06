<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the NeuralFlow AI Astro hybrid marketing site. Here's a summary of everything that was set up:

- **`posthog-js`** and **`posthog-node`** were installed as dependencies.
- A `src/components/posthog.astro` snippet component was created and added to `src/layouts/Layout.astro`, ensuring PostHog loads on every page.
- A server-side PostHog singleton (`src/lib/posthog-server.ts`) was created using `posthog-node` to safely track events from API routes without creating multiple clients.
- Client-side events were added to the hero page, pricing page, and contact form.
- Server-side event tracking was added to the contact form API route, correlating with the client-side session via request headers.
- Environment variables `PUBLIC_POSTHOG_PROJECT_TOKEN` and `PUBLIC_POSTHOG_HOST` were written to `.env`.

## Events instrumented

| Event | Description | File |
|-------|-------------|------|
| `cta_clicked` | User clicked a primary CTA button (Start Free Trial, Contact Sales) with `label` and `location` properties | `src/pages/index.astro` |
| `pricing_plan_clicked` | User clicked a pricing plan CTA with `plan` (Starter/Pro/Enterprise) and `plan_price` properties | `src/pages/pricing.astro` |
| `contact_sales_clicked` | User clicked Contact Sales from the pricing page | `src/pages/pricing.astro` |
| `contact_form_submitted` | User submitted the contact form (client-side) with `interest` and `has_company` properties | `src/pages/contact.astro` |
| `contact_form_success` | Contact form successfully processed (client confirmed) | `src/pages/contact.astro` |
| `contact_form_error` | Contact form failed with `error` and `status` properties; exceptions captured via `captureException` | `src/pages/contact.astro` |
| `contact_form_received` | Server confirmed receipt of form data with `interest`, `has_company`, and `$session_id` for session correlation | `src/pages/api/contact.ts` |

## Next steps

We've prepared recommended insights for your "Analytics basics" dashboard. Create it at:

**[Create new dashboard in PostHog](https://us.posthog.com/project/2/dashboard)**

Suggested insights to add:

1. **Contact form conversion funnel** — Funnel: `contact_form_submitted` → `contact_form_success` — tracks what percentage of form submissions succeed
2. **CTA clicks by label** — Trend: `cta_clicked` broken down by `label` property — shows which CTA drives the most engagement
3. **Pricing plan interest** — Trend: `pricing_plan_clicked` broken down by `plan` property — reveals which pricing tier attracts the most clicks
4. **Contact form errors over time** — Trend: `contact_form_error` — monitors form reliability and error rate
5. **Sales pipeline: Pricing → Contact** — Funnel: `pricing_plan_clicked` → `contact_sales_clicked` → `contact_form_success` — tracks the enterprise sales conversion path

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-astro-hybrid/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
