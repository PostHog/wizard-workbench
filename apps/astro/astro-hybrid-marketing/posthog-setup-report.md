<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the **NeuralFlow AI** Astro (Hybrid) marketing site. The integration covers both client-side analytics (via the PostHog JS snippet) and server-side event tracking (via `posthog-node` in the contact API route), with session correlation between the two.

## Changes made

### New files created

- **`src/components/posthog.astro`** — Client-side PostHog snippet component using the `is:inline` directive to prevent Astro TypeScript processing. Reads `PUBLIC_POSTHOG_KEY` and `PUBLIC_POSTHOG_HOST` from environment variables.
- **`src/lib/posthog-server.ts`** — Singleton server-side PostHog client using `posthog-node`. Exposes `getPostHogServer()` and `shutdownPostHog()` helpers for use in API routes.
- **`.env`** — Environment variables for `PUBLIC_POSTHOG_KEY` and `PUBLIC_POSTHOG_HOST` (added to `.gitignore`).

### Modified files

- **`src/layouts/Layout.astro`** — Imports and renders `<PostHog />` in `<head>` to enable site-wide client-side tracking on all pages.
- **`src/pages/index.astro`** — Tracks `hero_cta_clicked` when users click "Start Free Trial" or "Contact Sales" in the hero section.
- **`src/pages/pricing.astro`** — Tracks `pricing_plan_selected` (with `plan` and `cta` properties) when users click any pricing plan CTA.
- **`src/pages/contact.astro`** — Tracks `contact_form_started` (first field focus), `contact_form_submitted` (on submit), and `contact_form_submit_error` (on failure). Passes PostHog session ID and distinct ID as headers to the server for session correlation. Includes `captureException` for network errors.
- **`src/pages/api/contact.ts`** — Server-side tracking via `posthog-node` singleton. Tracks `contact_form_received` on success and `contact_form_validation_failed` on validation errors (missing fields, invalid email, server error). Uses session ID and distinct ID from request headers for cross-domain correlation.
- **`src/components/Navigation.astro`** — Tracks `navigation_link_clicked` (with `label` and `href` properties) for all nav links.

### Packages installed

- `posthog-js` — Client-side analytics
- `posthog-node` — Server-side event tracking

## Events instrumented

| Event name | Description | File |
|---|---|---|
| `hero_cta_clicked` | User clicked "Start Free Trial" or "Contact Sales" in the homepage hero | `src/pages/index.astro` |
| `pricing_plan_selected` | User clicked a CTA on a pricing plan (Starter, Pro, or Enterprise) | `src/pages/pricing.astro` |
| `contact_form_started` | User began filling out the contact form (first field interaction) | `src/pages/contact.astro` |
| `contact_form_submitted` | User submitted the contact form (client-side) | `src/pages/contact.astro` |
| `contact_form_submit_error` | Contact form submission failed (network or server error) | `src/pages/contact.astro` |
| `contact_form_received` | Server successfully validated and received a contact form submission | `src/pages/api/contact.ts` |
| `contact_form_validation_failed` | Server rejected the form submission due to validation error | `src/pages/api/contact.ts` |
| `navigation_link_clicked` | User clicked a navigation link in the top nav bar | `src/components/Navigation.astro` |

## Next steps

To view your analytics, visit your PostHog project and explore the **Events** and **Insights** sections. Recommended insights to create based on these events:

1. **Contact Form Conversion Funnel** — `contact_form_started` → `contact_form_submitted` → `contact_form_received`
2. **Pricing Plan Interest** — Breakdown of `pricing_plan_selected` by `plan` property
3. **Hero CTA Performance** — Trend of `hero_cta_clicked` broken down by `cta` property
4. **Form Error Rate** — Ratio of `contact_form_submit_error` + `contact_form_validation_failed` vs `contact_form_submitted`
5. **Navigation Engagement** — Breakdown of `navigation_link_clicked` by `label` property

You can explore all events at: [https://us.posthog.com/project/238460/events](https://us.posthog.com/project/238460/events)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-astro-hybrid/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
