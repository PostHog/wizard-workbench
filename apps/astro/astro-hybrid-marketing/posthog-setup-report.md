<wizard-report>
# PostHog post-wizard report

The wizard has completed a full integration of PostHog analytics into the **NeuralFlow AI** Astro hybrid marketing site. Both client-side (posthog-js) and server-side (posthog-node) tracking are now active.

## Summary of changes

| File | Change |
|------|--------|
| `src/components/posthog.astro` | **Created** – PostHog JS snippet component with `is:inline` directive, initialised from `PUBLIC_POSTHOG_KEY` / `PUBLIC_POSTHOG_HOST` env vars |
| `src/lib/posthog-server.ts` | **Created** – Singleton `getPostHogServer()` factory for the `posthog-node` client used in API routes |
| `src/layouts/Layout.astro` | **Edited** – Imports and renders `<PostHog />` inside `<head>` so every page loads the SDK |
| `src/pages/index.astro` | **Edited** – Tracks `cta_clicked` for hero "Start Free Trial" and "Contact Sales" buttons |
| `src/pages/pricing.astro` | **Edited** – Tracks `pricing_plan_clicked` for all three plan CTAs (Starter, Pro, Enterprise) |
| `src/pages/contact.astro` | **Edited** – Tracks `contact_form_submitted` on success and `contact_form_errored` on failure; passes `X-PostHog-Session-Id` and `X-PostHog-Distinct-Id` headers to the API |
| `src/pages/api/contact.ts` | **Edited** – Server-side: captures `contact_form_received` on success and `contact_form_validation_failed` on validation errors; correlates with client session via `$session_id` |
| `src/components/Navigation.astro` | **Edited** – Tracks `nav_cta_clicked` for the "Get Started" button in the nav bar |
| `.env` | **Created** – `PUBLIC_POSTHOG_KEY` and `PUBLIC_POSTHOG_HOST` added (gitignored) |
| `package.json` | **Updated** – `posthog-node` dependency added |

## Tracked events

| Event | Description | File |
|-------|-------------|------|
| `cta_clicked` | Hero "Start Free Trial" or "Contact Sales" button clicked (`cta`, `location` properties) | `src/pages/index.astro` |
| `pricing_plan_clicked` | Pricing plan CTA clicked (`plan`, `price` properties) | `src/pages/pricing.astro` |
| `contact_form_submitted` | Contact form successfully submitted client-side (`interest` property) | `src/pages/contact.astro` |
| `contact_form_errored` | Contact form submission failed client-side (`error` property) | `src/pages/contact.astro` |
| `contact_form_received` | Contact form received server-side (`interest`, `has_company`, `$session_id` properties) | `src/pages/api/contact.ts` |
| `contact_form_validation_failed` | Server-side validation rejected the form submission (`reason`, `$session_id` properties) | `src/pages/api/contact.ts` |
| `nav_cta_clicked` | Nav "Get Started" CTA clicked (`location` property) | `src/components/Navigation.astro` |

## Next steps

We attempted to create an **Analytics basics** dashboard with the following insights, but the environment API key lacked the required `dashboard:write` / `insight:write` scopes. You can create them manually in PostHog:

1. **CTA conversion funnel** – Funnel: `cta_clicked` → `pricing_plan_clicked` → `contact_form_submitted`
2. **CTA click trend** – Trend: `cta_clicked` broken down by `cta` property
3. **Pricing plan interest** – Trend: `pricing_plan_clicked` broken down by `plan` property
4. **Contact form success rate** – Trend: `contact_form_received` vs `contact_form_errored`
5. **Nav vs Hero CTA comparison** – Trend: `nav_cta_clicked` vs `cta_clicked`

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-astro-hybrid/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
