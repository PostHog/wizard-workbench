<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog into the NeuralFlow AI marketing site (Astro hybrid rendering). The integration covers both client-side and server-side analytics across all key pages and API routes.

**What was set up:**

- **`src/components/posthog.astro`** — New PostHog client-side snippet component using `is:inline` (prevents Astro TypeScript processing). Initialized from `PUBLIC_POSTHOG_KEY` and `PUBLIC_POSTHOG_HOST` environment variables.
- **`src/lib/posthog-server.ts`** — New server-side PostHog singleton using `posthog-node`. Uses a singleton pattern to avoid multiple client instantiations across API route calls.
- **`src/layouts/Layout.astro`** — Updated to import and render `<PostHog />` in `<head>`, ensuring client-side tracking on every page.
- **`src/pages/index.astro`** — Added click tracking for the hero "Start Free Trial" CTA and "Contact Sales" button.
- **`src/pages/pricing.astro`** — Added click tracking for all three pricing plan CTAs (Starter, Pro, Enterprise), with plan name and price as event properties.
- **`src/pages/contact.astro`** — Added successful form submission tracking with interest and company data. Forwards PostHog session ID to the API route via `X-PostHog-Session-Id` header for session continuity. Added `captureException` on network errors.
- **`src/pages/api/contact.ts`** — Added server-side event tracking for successful submissions (`contact_form_submission_received`) and failures (`contact_form_submission_failed`) with failure reason. Includes server-side `identify()` call on successful submission to associate the user's email with their PostHog profile.
- **`src/components/Navigation.astro`** — Added click tracking for the "Get Started" nav CTA.
- **`.env`** — Created with `PUBLIC_POSTHOG_KEY` and `PUBLIC_POSTHOG_HOST` (`.gitignore` coverage ensured).
- **Packages installed** — `posthog-js` and `posthog-node` via npm.

| Event | Description | File |
|---|---|---|
| `cta_clicked` | User clicks the primary "Start Free Trial" CTA in the hero section | `src/pages/index.astro` |
| `contact_sales_clicked` | User clicks the "Contact Sales" button in the hero section | `src/pages/index.astro` |
| `pricing_plan_clicked` | User clicks a pricing plan CTA (Starter, Pro, or Enterprise) | `src/pages/pricing.astro` |
| `contact_form_submitted` | Client-side: user submits the contact form successfully | `src/pages/contact.astro` |
| `contact_form_submission_received` | Server-side: contact form submission validated and processed | `src/pages/api/contact.ts` |
| `contact_form_submission_failed` | Server-side: contact form submission failed validation or encountered an error | `src/pages/api/contact.ts` |
| `get_started_clicked` | User clicks the "Get Started" CTA in the navigation bar | `src/components/Navigation.astro` |

## Next steps

We've outlined 5 insights and a dashboard for you to build in PostHog to keep an eye on user behavior, based on the events we just instrumented. Go to [PostHog Dashboards](https://us.posthog.com/project/dashboards) and create a new **"Analytics basics"** dashboard, then add these insights:

1. **CTA Conversion Funnel** — Funnel insight: `cta_clicked` → `contact_form_submitted`. Shows how many hero visitors convert to contact form completions.
2. **Pricing Plan Interest** — Trends insight: `pricing_plan_clicked` broken down by `plan` property. Shows which plans attract the most interest.
3. **Contact Form Submissions Over Time** — Trends insight: `contact_form_submission_received`. Tracks lead generation volume over time.
4. **Form Submission Failure Reasons** — Trends insight: `contact_form_submission_failed` broken down by `reason` property. Identifies where users struggle in the form.
5. **Get Started vs Contact Sales Clicks** — Trends insight: `get_started_clicked` and `contact_sales_clicked` together. Compares top-of-funnel intent signals.

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-astro-hybrid/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
