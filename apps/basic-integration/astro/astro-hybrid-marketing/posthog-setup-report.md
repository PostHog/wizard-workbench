<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the NeuralFlow AI marketing site. The integration includes client-side tracking via the PostHog web snippet, server-side tracking via `posthog-node` in the contact API route, user identification on form submission, and error capture throughout the contact flow.

**Files created:**
- `src/components/posthog.astro` — PostHog client-side snippet, loaded in the layout head
- `src/lib/posthog-server.ts` — Server-side PostHog singleton using `posthog-node`

**Files modified:**
- `src/layouts/Layout.astro` — Added `<PostHog />` component to the `<head>`
- `src/pages/index.astro` — `trial_started` and `contact_sales_clicked` events on hero CTAs
- `src/pages/pricing.astro` — `pricing_plan_cta_clicked` event on all three plan CTA buttons (with `plan` and `plan_price` properties)
- `src/components/Navigation.astro` — `get_started_clicked` event on nav CTA
- `src/pages/contact.astro` — `contact_form_submitted`, `contact_form_errored`, `posthog.identify()` on success, and `captureException` on error
- `src/pages/api/contact.ts` — `contact_form_completed`, `contact_form_validation_failed`, and server-side `posthog.identify()` using email as distinct ID; session continuity via `X-PostHog-Session-Id` and `X-PostHog-Distinct-Id` headers

**Environment variables set in `.env`:**
- `PUBLIC_POSTHOG_PROJECT_TOKEN`
- `PUBLIC_POSTHOG_HOST`

| Event | Description | File |
|---|---|---|
| `trial_started` | User clicked 'Start Free Trial' on the hero section | `src/pages/index.astro` |
| `contact_sales_clicked` | User clicked 'Contact Sales' from the hero section | `src/pages/index.astro` |
| `pricing_plan_cta_clicked` | User clicked a CTA on a pricing plan card (Starter, Pro, or Enterprise) | `src/pages/pricing.astro` |
| `get_started_clicked` | User clicked the 'Get Started' CTA in the navigation bar | `src/components/Navigation.astro` |
| `contact_form_submitted` | User submitted the contact form (client-side attempt) | `src/pages/contact.astro` |
| `contact_form_errored` | Contact form submission failed with a network or server error | `src/pages/contact.astro` |
| `contact_form_completed` | Contact form was successfully processed by the server | `src/pages/api/contact.ts` |
| `contact_form_validation_failed` | Contact form submission failed server-side validation | `src/pages/api/contact.ts` |

## Next steps

To monitor user behavior, create an **"Analytics basics"** dashboard in PostHog with these recommended insights:

1. **CTA conversion funnel** — Funnel: `pricing_plan_cta_clicked` → `contact_form_submitted` → `contact_form_completed`
2. **Trial interest trend** — Trend of `trial_started` over time, broken down by day
3. **Contact form completion rate** — Trend comparing `contact_form_submitted` vs `contact_form_completed`
4. **Pricing plan interest breakdown** — Trend of `pricing_plan_cta_clicked` broken down by `plan` property
5. **Form errors** — Trend of `contact_form_errored` + `contact_form_validation_failed` to track reliability

Create your dashboard at [/dashboard](https://us.posthog.com/project/2/dashboard).

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-astro-hybrid/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
